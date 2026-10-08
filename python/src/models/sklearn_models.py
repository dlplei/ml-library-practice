"""
scikit-learn 模型训练封装
提供统一的模型训练、评估、保存接口
"""

import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from typing import Dict, Any, Optional, List, Union
from sklearn.base import BaseEstimator
from sklearn.model_selection import cross_val_score, GridSearchCV, learning_curve
from sklearn.metrics import (
    mean_squared_error,
    mean_absolute_error,
    r2_score,
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score,
)
from sklearn.linear_model import LinearRegression, LogisticRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeRegressor, DecisionTreeClassifier
from sklearn.ensemble import (
    RandomForestRegressor,
    RandomForestClassifier,
    GradientBoostingRegressor,
    GradientBoostingClassifier,
)
from sklearn.svm import SVR, SVC
from sklearn.neighbors import KNeighborsRegressor, KNeighborsClassifier


# 模型注册表
REGRESSION_MODELS = {
    "linear_regression": LinearRegression,
    "ridge": Ridge,
    "lasso": Lasso,
    "decision_tree": DecisionTreeRegressor,
    "random_forest": RandomForestRegressor,
    "gradient_boosting": GradientBoostingRegressor,
    "svr": SVR,
    "knn": KNeighborsRegressor,
}

CLASSIFICATION_MODELS = {
    "logistic_regression": LogisticRegression,
    "decision_tree": DecisionTreeClassifier,
    "random_forest": RandomForestClassifier,
    "gradient_boosting": GradientBoostingClassifier,
    "svc": SVC,
    "knn": KNeighborsClassifier,
}


class SklearnModelTrainer:
    """
    scikit-learn 模型训练器

    提供统一的训练、评估、调参、保存接口

    Example
    -------
    >>> trainer = SklearnModelTrainer(task='regression')
    >>> trainer.train('random_forest', X_train, y_train)
    >>> metrics = trainer.evaluate(X_test, y_test)
    >>> trainer.save('models_saved/sklearn/my_model.pkl')
    """

    def __init__(
        self,
        task: str = "regression",
        model_name: Optional[str] = None,
        model_params: Optional[Dict] = None,
    ):
        """
        Parameters
        ----------
        task : str
            'regression' 或 'classification'
        model_name : str, optional
            模型名称
        model_params : dict, optional
            模型超参数
        """
        self.task = task
        self.model: Optional[BaseEstimator] = None
        self.model_name = model_name
        self.metrics: Dict[str, float] = {}
        self.cv_results: Optional[Dict] = None

        if model_name:
            self._init_model(model_name, model_params or {})

    def _init_model(self, name: str, params: Dict):
        """初始化模型"""
        registry = (
            REGRESSION_MODELS if self.task == "regression" else CLASSIFICATION_MODELS
        )

        if name not in registry:
            available = list(registry.keys())
            raise ValueError(f"未知模型 '{name}'。可选: {available}")

        self.model_name = name
        self.model = registry[name](**params)

    def train(
        self,
        X_train: Union[pd.DataFrame, np.ndarray],
        y_train: Union[pd.Series, np.ndarray],
        model_name: Optional[str] = None,
        model_params: Optional[Dict] = None,
    ) -> BaseEstimator:
        """
        训练模型

        Parameters
        ----------
        X_train : array-like
            训练特征
        y_train : array-like
            训练标签
        model_name : str, optional
            模型名称（覆盖初始化时的设置）
        model_params : dict, optional
            模型参数

        Returns
        -------
        BaseEstimator
            训练好的模型
        """
        if model_name:
            self._init_model(model_name, model_params or {})

        if self.model is None:
            raise ValueError("请先指定模型名称")

        print(f"正在训练 {self.model_name}...")
        self.model.fit(X_train, y_train)
        print(f"✓ 训练完成")

        return self.model

    def evaluate(
        self,
        X_test: Union[pd.DataFrame, np.ndarray],
        y_test: Union[pd.Series, np.ndarray],
    ) -> Dict[str, float]:
        """
        评估模型

        Returns
        -------
        dict
            评估指标
        """
        if self.model is None:
            raise ValueError("模型未训练")

        y_pred = self.model.predict(X_test)

        if self.task == "regression":
            self.metrics = {
                "mse": float(mean_squared_error(y_test, y_pred)),
                "rmse": float(np.sqrt(mean_squared_error(y_test, y_pred))),
                "mae": float(mean_absolute_error(y_test, y_pred)),
                "r2": float(r2_score(y_test, y_pred)),
            }
        else:
            self.metrics = {
                "accuracy": float(accuracy_score(y_test, y_pred)),
            }
            try:
                if hasattr(self.model, "predict_proba"):
                    y_prob = self.model.predict_proba(X_test)
                    if y_prob.shape[1] == 2:
                        self.metrics["roc_auc"] = float(
                            roc_auc_score(y_test, y_prob[:, 1])
                        )
            except Exception:
                pass

        print(f"\n===== 评估结果 ({self.model_name}) =====")
        for metric, value in self.metrics.items():
            print(f"  {metric.upper():10s}: {value:.4f}")

        return self.metrics

    def cross_validate(
        self,
        X: Union[pd.DataFrame, np.ndarray],
        y: Union[pd.Series, np.ndarray],
        cv: int = 5,
        scoring: Optional[str] = None,
    ) -> Dict[str, float]:
        """
        交叉验证

        Parameters
        ----------
        cv : int
            折数
        scoring : str, optional
            评分标准
        """
        if self.model is None:
            raise ValueError("模型未初始化")

        if scoring is None:
            scoring = "neg_mean_squared_error" if self.task == "regression" else "accuracy"

        scores = cross_val_score(self.model, X, y, cv=cv, scoring=scoring)

        self.cv_results = {
            "mean": float(scores.mean()),
            "std": float(scores.std()),
            "scores": scores.tolist(),
        }

        print(f"\n交叉验证结果 ({cv}-fold):")
        print(f"  均值: {self.cv_results['mean']:.4f}")
        print(f"  标准差: {self.cv_results['std']:.4f}")
        print(f"  各折: {[f'{s:.4f}' for s in self.cv_results['scores']]}")

        return self.cv_results

    def grid_search(
        self,
        X_train: Union[pd.DataFrame, np.ndarray],
        y_train: Union[pd.Series, np.ndarray],
        param_grid: Dict[str, List],
        cv: int = 5,
        scoring: Optional[str] = None,
        n_jobs: int = -1,
    ) -> Dict[str, Any]:
        """
        网格搜索调参

        Parameters
        ----------
        param_grid : dict
            参数网格
        cv : int
            交叉验证折数
        """
        if self.model is None:
            raise ValueError("模型未初始化")

        if scoring is None:
            scoring = "neg_mean_squared_error" if self.task == "regression" else "accuracy"

        grid_search = GridSearchCV(
            self.model,
            param_grid,
            cv=cv,
            scoring=scoring,
            n_jobs=n_jobs,
            verbose=1,
            return_train_score=True,
        )

        print(f"开始网格搜索...")
        grid_search.fit(X_train, y_train)

        print(f"\n最佳参数: {grid_search.best_params_}")
        print(f"最佳分数: {grid_search.best_score_:.4f}")

        self.model = grid_search.best_estimator_
        self.cv_results = {
            "best_params": grid_search.best_params_,
            "best_score": float(grid_search.best_score_),
            "cv_results": grid_search.cv_results_,
        }

        return self.cv_results

    def get_feature_importance(self, feature_names: Optional[List[str]] = None) -> pd.DataFrame:
        """获取特征重要性"""
        if self.model is None:
            raise ValueError("模型未训练")

        if hasattr(self.model, "feature_importances_"):
            importances = self.model.feature_importances_
        elif hasattr(self.model, "coef_"):
            importances = np.abs(self.model.coef_)
        else:
            raise ValueError("模型不支持特征重要性")

        if feature_names is None:
            feature_names = [f"feature_{i}" for i in range(len(importances))]

        df = pd.DataFrame({
            "feature": feature_names,
            "importance": importances,
        }).sort_values("importance", ascending=False)

        return df

    def save(self, filepath: str):
        """保存模型"""
        path = Path(filepath)
        path.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.model, filepath)
        print(f"✓ 模型已保存到 {filepath}")

    @staticmethod
    def load(filepath: str) -> BaseEstimator:
        """加载模型"""
        model = joblib.load(filepath)
        print(f"✓ 模型已从 {filepath} 加载")
        return model

    def summary(self) -> str:
        """获取模型摘要"""
        if self.model is None:
            return "模型未初始化"

        lines = [
            f"模型: {self.model_name}",
            f"任务: {self.task}",
            f"类型: {type(self.model).__name__}",
        ]

        if hasattr(self.model, "get_params"):
            params = self.model.get_params()
            lines.append(f"参数: {params}")

        if self.metrics:
            lines.append(f"指标: {self.metrics}")

        return "\n".join(lines)


# ============================================
# 便捷函数
# ============================================

def quick_train_and_evaluate(
    X_train, y_train, X_test, y_test,
    task: str = "regression",
    models: Optional[List[str]] = None,
) -> pd.DataFrame:
    """
    快速训练多个模型并比较

    Returns
    -------
    pd.DataFrame
        各模型的评估结果
    """
    if models is None:
        if task == "regression":
            models = ["linear_regression", "random_forest", "gradient_boosting"]
        else:
            models = ["logistic_regression", "random_forest", "gradient_boosting"]

    results = []

    for model_name in models:
        trainer = SklearnModelTrainer(task=task)
        trainer.train(model_name, X_train, y_train)
        metrics = trainer.evaluate(X_test, y_test)
        metrics["model"] = model_name
        results.append(metrics)

    df = pd.DataFrame(results).set_index("model")
    print("\n===== 模型比较 =====")
    print(df.to_string())

    return df


if __name__ == "__main__":
    from sklearn.datasets import fetch_california_housing
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler

    print("=" * 50)
    print("测试 sklearn 模型训练器")
    print("=" * 50)

    # 加载数据
    data = fetch_california_housing()
    X = pd.DataFrame(data.data, columns=data.feature_names)
    y = data.target

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 快速比较
    quick_train_and_evaluate(
        X_train_scaled, y_train, X_test_scaled, y_test,
        task="regression",
    )
