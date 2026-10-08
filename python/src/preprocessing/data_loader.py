"""
数据加载工具模块
提供统一的数据加载接口，支持多种数据源
"""

import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.datasets import (
    fetch_california_housing,
    load_iris,
    load_breast_cancer,
    load_digits,
    make_classification,
    make_regression,
)
from typing import Tuple, Optional, Dict, Any


# 项目根目录
PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data"


def load_california_housing(
    test_size: float = 0.2,
    random_state: int = 42,
    scale: bool = True,
) -> Dict[str, Any]:
    """
    加载加州房价数据集

    Parameters
    ----------
    test_size : float
        测试集比例
    random_state : int
        随机种子
    scale : bool
        是否标准化

    Returns
    -------
    dict
        包含 X_train, X_test, y_train, y_test, feature_names 的字典
    """
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler

    data = fetch_california_housing()
    X = pd.DataFrame(data.data, columns=data.feature_names)
    y = data.target

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    if scale:
        scaler = StandardScaler()
        X_train = pd.DataFrame(
            scaler.fit_transform(X_train),
            columns=X.columns,
            index=X_train.index,
        )
        X_test = pd.DataFrame(
            scaler.transform(X_test),
            columns=X.columns,
            index=X_test.index,
        )

    return {
        "X_train": X_train,
        "X_test": X_test,
        "y_train": y_train,
        "y_test": y_test,
        "feature_names": data.feature_names,
        "target_name": "MedHouseVal",
        "description": data.DESCR,
    }


def load_iris_dataset(
    test_size: float = 0.3,
    random_state: int = 42,
) -> Dict[str, Any]:
    """加载鸢尾花数据集"""
    from sklearn.model_selection import train_test_split

    data = load_iris()
    X = pd.DataFrame(data.data, columns=data.feature_names)
    y = data.target

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )

    return {
        "X_train": X_train,
        "X_test": X_test,
        "y_train": y_train,
        "y_test": y_test,
        "feature_names": data.feature_names,
        "target_names": data.target_names,
    }


def load_breast_cancer_dataset(
    test_size: float = 0.2,
    random_state: int = 42,
) -> Dict[str, Any]:
    """加载乳腺癌数据集"""
    from sklearn.model_selection import train_test_split

    data = load_breast_cancer()
    X = pd.DataFrame(data.data, columns=data.feature_names)
    y = data.target

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )

    return {
        "X_train": X_train,
        "X_test": X_test,
        "y_train": y_train,
        "y_test": y_test,
        "feature_names": data.feature_names,
        "target_names": data.target_names,
    }


def load_custom_csv(filepath: str, target_col: str) -> Dict[str, Any]:
    """
    加载自定义 CSV 文件

    Parameters
    ----------
    filepath : str
        CSV 文件路径
    target_col : str
        目标列名

    Returns
    -------
    dict
        包含 X, y, feature_names 的字典
    """
    df = pd.read_csv(filepath)

    if target_col not in df.columns:
        raise ValueError(f"目标列 '{target_col}' 不存在于数据中")

    X = df.drop(columns=[target_col])
    y = df[target_col]

    return {
        "X": X,
        "y": y,
        "feature_names": X.columns.tolist(),
        "shape": X.shape,
    }


def generate_synthetic_data(
    n_samples: int = 1000,
    n_features: int = 10,
    task: str = "regression",
    random_state: int = 42,
) -> Dict[str, Any]:
    """
    生成合成数据用于测试

    Parameters
    ----------
    n_samples : int
        样本数量
    n_features : int
        特征数量
    task : str
        'regression' 或 'classification'
    random_state : int
        随机种子
    """
    if task == "regression":
        X, y = make_regression(
            n_samples=n_samples,
            n_features=n_features,
            noise=0.1,
            random_state=random_state,
        )
    else:
        X, y = make_classification(
            n_samples=n_samples,
            n_features=n_features,
            n_classes=2,
            random_state=random_state,
        )

    feature_names = [f"feature_{i}" for i in range(n_features)]
    X = pd.DataFrame(X, columns=feature_names)

    return {
        "X": X,
        "y": y,
        "feature_names": feature_names,
    }


if __name__ == "__main__":
    # 测试数据加载
    print("=" * 50)
    print("测试数据加载模块")
    print("=" * 50)

    data = load_california_housing()
    print(f"\n加州房价数据集:")
    print(f"  训练集: {data['X_train'].shape}")
    print(f"  测试集: {data['X_test'].shape}")
    print(f"  特征: {data['feature_names']}")

    data = load_iris_dataset()
    print(f"\n鸢尾花数据集:")
    print(f"  训练集: {data['X_train'].shape}")
    print(f"  测试集: {data['X_test'].shape}")
    print(f"  类别: {data['target_names']}")
