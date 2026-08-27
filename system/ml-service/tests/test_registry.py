"""The family-aware verdict score (spec 0002 AC-3).

Mocks the estimator, so these run without scikit-learn or the joblib models: they pin the
score contract, not the models. The tree path is a calibrated probability; the SVM path is
an uncalibrated squashed margin, asserted by its rescale-invariant properties (bounded 0..1,
monotonic in the margin, oriented toward the malicious class).
"""

import numpy as np
import pytest

from app.registry import LoadedModel, _malicious_index, _sigmoid, score_flow


class FakeTree:
    classes_ = [0, 1]

    def __init__(self, proba_malicious: float, pred: int) -> None:
        self._p = proba_malicious
        self._pred = pred

    def predict(self, _X):
        return [self._pred]

    def predict_proba(self, _X):
        return [[1 - self._p, self._p]]


class FakeSVM:
    classes_ = [0, 1]

    def __init__(self, margin: float, pred: int) -> None:
        self._m = margin
        self._pred = pred

    def predict(self, _X):
        return [self._pred]

    def decision_function(self, _X):
        return np.array([self._m])


def tree(proba: float, pred: int = 1) -> LoadedModel:
    return LoadedModel("dt", "Tree", True, FakeTree(proba, pred), 1, 1, True)


def svm(margin: float, pred: int = 1, malicious_index: int = 1) -> LoadedModel:
    positive_is_malicious = malicious_index == 1
    return LoadedModel("svm", "SVM", False, FakeSVM(margin, pred), malicious_index, malicious_index, positive_is_malicious)


def test_tree_score_is_the_calibrated_malicious_probability():
    # covers: AC-3
    verdict, score, kind = score_flow(tree(0.97, pred=1), None)
    assert verdict == "malicious"
    assert score == pytest.approx(0.97)
    assert kind == "calibrated"


def test_benign_prediction_maps_to_a_benign_verdict():
    verdict, _score, _kind = score_flow(tree(0.02, pred=0), None)
    assert verdict == "benign"


@pytest.mark.parametrize("margin", [-8.0, -2.0, -0.5, 0.0, 0.5, 2.0, 8.0])
def test_svm_score_is_bounded_and_uncalibrated(margin):
    # covers: AC-3 (rescale-invariant: always in 0..1, flagged uncalibrated)
    _verdict, score, kind = score_flow(svm(margin), None)
    assert 0.0 <= score <= 1.0
    assert kind == "uncalibrated"


def test_svm_score_is_monotonic_in_the_margin():
    # covers: AC-3 (a larger margin toward malicious yields a higher score; survives any rescale)
    scores = [score_flow(svm(m), None)[1] for m in [-3.0, -1.0, 0.0, 1.0, 3.0]]
    assert scores == sorted(scores)


def test_svm_orientation_when_malicious_is_class_zero():
    # decision_function points at the positive (last) class; when malicious is class 0 it is
    # negated, so a positive margin (toward benign) gives a LOW malicious score.
    _v, high_margin_score, _k = score_flow(svm(5.0, malicious_index=0), None)
    _v2, low_margin_score, _k2 = score_flow(svm(-5.0, malicious_index=0), None)
    assert high_margin_score < 0.5 < low_margin_score


def test_sigmoid_is_bounded_and_centered():
    assert _sigmoid(0.0) == pytest.approx(0.5)
    assert 0.0 < _sigmoid(-60.0) < 1e-10  # overflow safe for large negative
    assert 1.0 - _sigmoid(60.0) < 1e-10  # overflow safe for large positive


@pytest.mark.parametrize(
    "classes,expected",
    [([0, 1], 1), (["BENIGN", "DDoS"], 1), (["attack", "BENIGN"], 0), ([0.0, 1.0], 1), ([False, True], 1)],
)
def test_malicious_index_detection_across_label_encodings(classes, expected):
    assert _malicious_index(classes) == expected
