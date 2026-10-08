"""
FastAPI 模型服务入口
提供 REST API 接口用于模型预测
"""

import sys
from pathlib import Path

# 添加项目根目录到路径
PROJECT_ROOT = Path(__file__).parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import joblib
import numpy as np

# ============================================
# 应用初始化
# ============================================

app = FastAPI(
    title="ML Library Practice - 模型预测 API",
    description="""
    ## 机器学习模型服务

    提供以下功能：
    - 房价预测 (线性回归)
    - 鸢尾花分类 (逻辑回归)
    - 模型健康检查
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# 全局变量
# ============================================

MODELS_DIR = PROJECT_ROOT / "models_saved"

# 模型和预处理器的全局存储
loaded_models: Dict[str, Any] = {}


def load_all_models():
    """启动时加载所有模型"""
    global loaded_models

    # 加载房价预测模型
    regression_model_path = MODELS_DIR / "sklearn" / "linear_regression.pkl"
    regression_scaler_path = MODELS_DIR / "sklearn" / "scaler.pkl"

    if regression_model_path.exists() and regression_scaler_path.exists():
        loaded_models["housing"] = {
            "model": joblib.load(regression_model_path),
            "scaler": joblib.load(regression_scaler_path),
        }
        print(f"✓ 房价预测模型已加载")
    else:
        print(f"⚠ 房价预测模型文件不存在，跳过加载")

    # 加载鸢尾花分类模型
    iris_model_path = MODELS_DIR / "sklearn" / "iris_classifier.pkl"
    if iris_model_path.exists():
        loaded_models["iris"] = {
            "model": joblib.load(iris_model_path),
        }
        print(f"✓ 鸢尾花分类模型已加载")
    else:
        print(f"⚠ 鸢尾花分类模型文件不存在，跳过加载")


# ============================================
# 数据模型 (Schemas)
# ============================================

class HouseFeatures(BaseModel):
    """加州房价预测输入"""
    MedInc: float = Field(..., description="街区收入中位数", ge=0)
    HouseAge: float = Field(..., description="房屋年龄中位数", ge=0)
    AveRooms: float = Field(..., description="平均房间数", ge=0)
    AveBedrms: float = Field(..., description="平均卧室数", ge=0)
    Population: float = Field(..., description="街区人口", ge=0)
    AveOccup: float = Field(..., description="平均入住率", ge=0)
    Latitude: float = Field(..., description="纬度", ge=-90, le=90)
    Longitude: float = Field(..., description="经度", ge=-180, le=180)

    class Config:
        json_schema_extra = {
            "example": {
                "MedInc": 8.3252,
                "HouseAge": 41.0,
                "AveRooms": 6.984,
                "AveBedrms": 1.023,
                "Population": 322.0,
                "AveOccup": 2.555,
                "Latitude": 37.88,
                "Longitude": -122.23,
            }
        }


class IrisFeatures(BaseModel):
    """鸢尾花分类输入"""
    sepal_length: float = Field(..., description="花萼长度 (cm)", ge=0)
    sepal_width: float = Field(..., description="花萼宽度 (cm)", ge=0)
    petal_length: float = Field(..., description="花瓣长度 (cm)", ge=0)
    petal_width: float = Field(..., description="花瓣宽度 (cm)", ge=0)

    class Config:
        json_schema_extra = {
            "example": {
                "sepal_length": 5.1,
                "sepal_width": 3.5,
                "petal_length": 1.4,
                "petal_width": 0.2,
            }
        }


class PredictionResponse(BaseModel):
    """预测响应"""
    prediction: float
    model: str
    features: Dict[str, float]


class ClassificationResponse(BaseModel):
    """分类响应"""
    predicted_class: int
    class_name: str
    probabilities: Optional[List[float]] = None
    features: Dict[str, float]


class BatchPredictionRequest(BaseModel):
    """批量预测请求"""
    data: List[Dict[str, float]]


class BatchPredictionResponse(BaseModel):
    """批量预测响应"""
    predictions: List[float]
    count: int


class HealthResponse(BaseModel):
    """健康检查响应"""
    status: str
    models_loaded: List[str]
    version: str


# ============================================
# API 路由
# ============================================

@app.on_event("startup")
async def startup_event():
    """应用启动时加载模型"""
    load_all_models()


@app.get("/", tags=["基础"])
async def root():
    """API 根路径"""
    return {
        "message": "🤖 ML Library Practice - 模型预测 API",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/health", response_model=HealthResponse, tags=["系统"])
async def health_check():
    """健康检查"""
    return HealthResponse(
        status="healthy",
        models_loaded=list(loaded_models.keys()),
        version="1.0.0",
    )


@app.post("/predict/housing", response_model=PredictionResponse, tags=["房价预测"])
async def predict_housing(house: HouseFeatures):
    """
    预测加州房价

    根据房屋特征预测街区房价中位数（单位：十万美元）
    """
    if "housing" not in loaded_models:
        raise HTTPException(
            status_code=503,
            detail="房价预测模型未加载，请先训练模型"
        )

    try:
        model_info = loaded_models["housing"]
        features = np.array([[
            house.MedInc, house.HouseAge, house.AveRooms,
            house.AveBedrms, house.Population, house.AveOccup,
            house.Latitude, house.Longitude,
        ]])

        # 标准化
        features_scaled = model_info["scaler"].transform(features)

        # 预测
        prediction = float(model_info["model"].predict(features_scaled)[0])

        return PredictionResponse(
            prediction=round(prediction, 4),
            model="linear_regression",
            features=house.model_dump(),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"预测失败: {str(e)}")


@app.post("/predict/housing/batch", response_model=BatchPredictionResponse, tags=["房价预测"])
async def predict_housing_batch(request: BatchPredictionRequest):
    """批量房价预测"""
    if "housing" not in loaded_models:
        raise HTTPException(status_code=503, detail="模型未加载")

    try:
        model_info = loaded_models["housing"]
        feature_cols = [
            "MedInc", "HouseAge", "AveRooms", "AveBedrms",
            "Population", "AveOccup", "Latitude", "Longitude",
        ]

        features = np.array([
            [item[col] for col in feature_cols]
            for item in request.data
        ])

        features_scaled = model_info["scaler"].transform(features)
        predictions = model_info["model"].predict(features_scaled)

        return BatchPredictionResponse(
            predictions=[round(float(p), 4) for p in predictions],
            count=len(predictions),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/iris", response_model=ClassificationResponse, tags=["鸢尾花分类"])
async def predict_iris(iris: IrisFeatures):
    """
    鸢尾花分类

    根据花的特征预测品种
    """
    if "iris" not in loaded_models:
        raise HTTPException(status_code=503, detail="鸢尾花模型未加载")

    try:
        model = loaded_models["iris"]["model"]
        features = np.array([[
            iris.sepal_length, iris.sepal_width,
            iris.petal_length, iris.petal_width,
        ]])

        prediction = int(model.predict(features)[0])
        class_names = ["setosa", "versicolor", "virginica"]

        probabilities = None
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(features)[0].tolist()

        return ClassificationResponse(
            predicted_class=prediction,
            class_name=class_names[prediction],
            probabilities=[round(p, 4) for p in probabilities] if probabilities else None,
            features=iris.model_dump(),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# 启动入口
# ============================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
