import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from glob import glob

dataset = glob('./data/raw/MachineLearningCVE/*.csv')

df = pd.concat((pd.read_csv(i) for i in dataset), ignore_index=True)

