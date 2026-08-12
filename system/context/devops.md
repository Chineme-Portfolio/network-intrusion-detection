# Caught — DevOps

> The operational lifecycle as an authority document: environments, container build/deploy, secrets in the deploy path, observability, and the pipeline/supply-chain security gates (DevSecOps). For *why*, see `foundation.md`; for which tools/versions, see `library-docs.md` (this file owns how they are *operated*, not which they are).
> **Authority:** this file wins on any deploy, pipeline, or operations conflict, **except** data-handling policy, which `code-standards.md` Section 6 owns. `foundation.md` still wins overall.

**Status key:** ✅ in place · 🟡 in progress · ⬜ planned

## Section 1 — Environments

- **Dev:** `docker-compose up` stands up Redis + all services on the builder's machine. One command, reproducible.
- **Prod:** containers on a Linux host (`foundation.md` Section 7 #8). The capture service is the sensor and sits where it can see traffic (a SPAN/mirror port or TAP); the other services can sit anywhere reachable. Two environments = a real deploy surface, which is why this file exists.

## Section 2 — Build and deploy

- **One Dockerfile per service**, multi-stage (build → slim runtime). Images are the deploy unit.
- **Deploy** = pull the new images and restart via compose (or the orchestrator). **Rollback** = redeploy the previous image tag; keep the last known-good tag.
- No state in containers (nothing persisted this phase), so deploy/rollback is stateless and low-risk.

## Section 3 — Secrets in the deploy path

- Secrets (Redis URL/credentials, service config) are **injected as environment variables at deploy**, never baked into an image or committed. Local dev uses an uncommitted `.env`; prod uses the host/orchestrator secret mechanism.
- A **secret-scanning gate** (below) blocks a commit or image that contains a secret.

## Section 4 — Observability

- Each service exposes a **health endpoint** (`/health`) and logs structured events (service, event, flow id, verdict) — never payloads or full flow contents (`code-standards.md` Section 6).
- Minimum signal: capture rate, inference latency (already in the verdict), verdict counts, and error logs. Metrics/tracing stack is ⬜ (add if the demo needs it).

## Section 5 — DevSecOps (pipeline and supply-chain gates)

CI runs these on every PR; **gate on critical findings only** (blocking too much trains the team to bypass, keep blocked PRs under ~5%). Aligned to the OWASP CI/CD Top 10.

| Gate | Tool (see `library-docs.md`) | Blocks on |
|---|---|---|
| Dependency scan (SCA) | Trivy / Dependabot | known-critical CVEs in deps |
| Secret scan | gitleaks | any committed secret |
| SAST | Semgrep | critical code findings |
| Container image scan | Trivy | critical image CVEs |
| IaC scan (if IaC added) | Checkov | critical misconfig |
| SBOM | Syft (CycloneDX) | generate + attach per release |

- **Branch protection:** PRs only to main, CI green to merge, no direct pushes.
- **Supply chain:** produce an SBOM per release; image signing (Cosign/Sigstore) and SLSA provenance are ⬜ (add if this leaves demo scope).

## Section 6 — Backups and DR

Nothing persisted this phase, so there is nothing to back up. The models (`models/*.joblib`) are the only durable artifacts and are regenerable from v1. Revisit if persistence is ever added (`foundation.md` Section 8, deferred).

## References

- OWASP CI/CD Security Top 10, checked 2026-08-11: https://owasp.org/www-project-top-10-ci-cd-security-risks/
- DevSecOps 2026 gate set (SCA/SAST/DAST/secret/IaC/SBOM/signing), checked 2026-08-11: https://blog.habsi.net/building-a-secure-ci-cd-pipeline-integrating-devsecops-from-code-to-deployment/
- Trivy (container + dependency scanning), checked 2026-08-11: https://github.com/aquasecurity/trivy
