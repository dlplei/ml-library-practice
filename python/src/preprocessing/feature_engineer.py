"""
特征工程模块
提供常用的特征工程方法
"""

import numpy as np
import pandas as pd
from sklearn.preprocessing import (
    StandardScaler,
    MinMaxScaler,
    RobustScaler,
    LabelEncoder,
    OneHotEncoder,
    PolynomialFeatures,
)
from sklearn.feature_selection import (
    SelectKBest,
    f_regression,
    f_classif,
    mutual_info_regression,
    mutual_info_classif,
    RFE,
)
from sklearn.decomposition import PCA
from typing import List, Optional, Tuple


class FeatureEngineer:
    """特征工程工具类"""

    def __init__(self):
        self.scaler = None
        self.encoder = None
        self.selector = None
        self.pca = None

    def handle_missing_values(
        self,
        df: pd.DataFrame,
        strategy: str = "median",
        columns: Optional[List[str]] = None,
    ) -> pd.DataFrame:
        """
        处理缺失值

        Parameters
        ----------
        df : pd.DataFrame
            输入数据
        strategy : str
            策略: 'mean', 'median', 'mode', 'drop', 'ffill', 'bfill'
        columns : list, optional
            要处理的列，默认处理所有列
        """
        df = df.copy()

        if columns is None:
            columns = df.columns.tolist()

        for col in columns:
            if df[col].isnull().sum() == 0:
                continue

            missing_pct = df[col].isnull().mean() * 100
            print(f"  列 '{col}': {missing_pct:.1f}% 缺失值")

            if strategy == "mean":
                df[col] = df[col].fillna(df[col].mean())
            elif strategy == "median":
                df[col] = df[col].fillna(df[col].median())
            elif strategy == "mode":
                df[col] = df[col].fillna(df[col].mode()[0])
            elif strategy == "drop":
                df = df.dropna(subset=[col])
            elif strategy == "ffill":
                df[col] = df[col].ffill()
            elif strategy == "bfill":
                df[col] = df[col].bfill()

        return df

    def detect_outliers(
        self,
        df: pd.DataFrame,
        columns: List[str],
        method: str = "iqr",
        threshold: float = 1.5,
    ) -> pd.DataFrame:
        """
        检测并处理异常值

        Parameters
        ----------
        method : str
            'iqr' 或 'zscore'
        threshold : float
            阈值
        """
        df = df.copy()

        for col in columns:
            if method == "iqr":
                Q1 = df[col].quantile(0.25)
                Q3 = df[col].quantile(0.75)
                IQR = Q3 - Q1
                lower = Q1 - threshold * IQR
                upper = Q3 + threshold * IQR
                outlier_mask = (df[col] < lower) | (df[col] > upper)

            elif method == "zscore":
                mean = df[col].mean()
                std = df[col].std()
                z_scores = np.abs((df[col] - mean) / std)
                outlier_mask = z_scores > threshold

            n_outliers = outlier_mask.sum()
            if n_outliers > 0:
                print(f"  列 '{col}': 发现 {n_outliers} 个异常值")
                # 用中位数替换异常值
                df.loc[outlier_mask, col] = df[col].median()

        return df

    def encode_categorical(
        self,
        df: pd.DataFrame,
        columns: List[str],
        method: str = "label",
    ) -> pd.DataFrame:
        """
        类别编码

        Parameters
        ----------
        method : str
            'label' 或 'onehot'
        """
        df = df.copy()

        if method == "label":
            for col in columns:
                le = LabelEncoder()
                df[col] = le.fit_transform(df[col].astype(str))
        elif method == "onehot":
            df = pd.get_dummies(df, columns=columns, drop_first=True)

        return df

    def create_polynomial_features(
        self,
        X: pd.DataFrame,
        degree: int = 2,
        interaction_only: bool = False,
    ) -> pd.DataFrame:
        """创建多项式特征"""
        poly = PolynomialFeatures(
            degree=degree,
            interaction_only=interaction_only,
            include_bias=False,
        )
        X_poly = poly.fit_transform(X)
        feature_names = poly.get_feature_names_out(X.columns)
        return pd.DataFrame(X_poly, columns=feature_names)

    def select_features(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        k: int = 10,
        task: str = "regression",
    ) -> Tuple[pd.DataFrame, List[str]]:
        """
        特征选择

        Parameters
        ----------
        k : int
            选择的特征数量
        task : str
            'regression' 或 'classification'
        """
        if task == "regression":
            selector = SelectKBest(score_func=f_regression, k=k)
        else:
            selector = SelectKBest(score_func=f_classif, k=k)

        X_selected = selector.fit_transform(X, y)
        selected_mask = selector.get_support()
        selected_features = X.columns[selected_mask].tolist()

        # 打印特征得分
        scores = selector.scores_
        feature_scores = sorted(
            zip(X.columns, scores), key=lambda x: x[1], reverse=True
        )
        print("\n特征得分排名:")
        for i, (feat, score) in enumerate(feature_scores[:k]):
            print(f"  {i+1}. {feat}: {score:.4f}")

        return pd.DataFrame(X_selected, columns=selected_features), selected_features

    def apply_pca(
        self,
        X: pd.DataFrame,
        n_components: Optional[int] = None,
        explained_variance: float = 0.95,
    ) -> Tuple[pd.DataFrame, PCA]:
        """
        PCA 降维

        Parameters
        ----------
        n_components : int, optional
            目标维度，如果不指定则根据解释方差比例自动确定
        explained_variance : float
            目标解释方差比例
        """
        if n_components is None:
            # 先拟合全部，找到满足方差解释率的维度
            pca_full = PCA()
            pca_full.fit(X)
            cumsum = np.cumsum(pca_full.explained_variance_ratio_)
            n_components = np.argmax(cumsum >= explained_variance) + 1
            print(f"  选择 {n_components} 个主成分 (解释 {explained_variance*100:.0f}% 方差)")

        pca = PCA(n_components=n_components)
        X_pca = pca.fit_transform(X)

        # 打印解释方差
        print(f"\n各主成分解释方差比:")
        for i, var in enumerate(pca.explained_variance_ratio_):
            print(f"  PC{i+1}: {var:.4f} ({var*100:.1f}%)")
        print(f"  累计: {sum(pca.explained_variance_ratio_):.4f}")

        columns = [f"PC{i+1}" for i in range(n_components)]
        return pd.DataFrame(X_pca, columns=columns), pca


def feature_correlation_analysis(
    df: pd.DataFrame,
    threshold: float = 0.9,
) -> List[Tuple[str, str, float]]:
    """
    分析特征相关性，找出高度相关的特征对

    Parameters
    ----------
    threshold : float
        相关性阈值
    """
    corr_matrix = df.corr().abs()
    upper = corr_matrix.where(
        np.triu(np.ones(corr_matrix.shape), k=1).astype(bool)
    )

    highly_correlated = []
    for column in upper.columns:
        correlated = upper.index[upper[column] > threshold].tolist()
        for corr_col in correlated:
            highly_correlated.append(
                (column, corr_col, corr_matrix.loc[column, corr_col])
            )

    highly_correlated.sort(key=lambda x: x[2], reverse=True)

    print(f"\n高度相关的特征对 (阈值 > {threshold}):")
    for feat1, feat2, corr in highly_correlated:
        print(f"  {feat1} <-> {feat2}: {corr:.4f}")

    return highly_correlated


if __name__ == "__main__":
    from sklearn.datasets import fetch_california_housing

    # 测试特征工程
    print("=" * 50)
    print("测试特征工程模块")
    print("=" * 50)

    data = fetch_california_housing()
    df = pd.DataFrame(data.data, columns=data.feature_names)

    fe = FeatureEngineer()

    # 相关性分析
    print("\n--- 相关性分析 ---")
    feature_correlation_analysis(df)

    # 特征选择
    print("\n--- 特征选择 ---")
    X_selected, selected = fe.select_features(
        df, pd.Series(data.target), k=5, task="regression"
    )
    print(f"\n选择的特征: {selected}")
