import { useState } from 'react'
import { motion } from 'framer-motion'
import { Highlight, themes } from 'prism-react-renderer'
import { Copy, Check, ChevronDown } from 'lucide-react'

interface CodeExample {
  id: string
  title: string
  description: string
  language: string
  code: string
  tags: string[]
}

const examples: CodeExample[] = [
  {
    id: 'linear-regression',
    title: 'sklearn 线性回归 - 加州房价预测',
    description: '使用 scikit-learn 的 LinearRegression 进行房价预测，展示完整的 ML 工作流',
    language: 'python',
    tags: ['sklearn', '回归', '入门'],
    code: `"""
加州房价预测 - 线性回归实战
使用 scikit-learn 完成完整的机器学习工作流
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error

# ============================================
# 1. 数据加载与探索
# ============================================

# 加载加州房价数据集
california = fetch_california_housing()
X = pd.DataFrame(california.data, columns=california.feature_names)
y = california.target

print(f"数据集形状: {X.shape}")
print(f"特征列: {list(X.columns)}")
print(f"\\n目标变量统计:")
print(pd.Series(y).describe())

# ============================================
# 2. 数据预处理
# ============================================

# 划分训练集和测试集 (80/20)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 特征标准化 (均值为0，标准差为1)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # 注意：只用 transform

print(f"\\n训练集大小: {X_train_scaled.shape}")
print(f"测试集大小: {X_test_scaled.shape}")

# ============================================
# 3. 模型训练
# ============================================

# 创建并训练线性回归模型
model = LinearRegression()
model.fit(X_train_scaled, y_train)

# 查看模型参数
print(f"\\n模型系数:")
for feature, coef in zip(california.feature_names, model.coef_):
    print(f"  {feature:15s}: {coef:+.4f}")
print(f"  {'截距':15s}: {model.intercept_:+.4f}")

# ============================================
# 4. 模型预测与评估
# ============================================

# 预测
y_pred = model.predict(X_test_scaled)

# 计算评估指标
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"\\n===== 模型评估结果 =====")
print(f"MSE  (均方误差):      {mse:.4f}")
print(f"RMSE (均方根误差):    {rmse:.4f}")
print(f"MAE  (平均绝对误差):  {mae:.4f}")
print(f"R²   (决定系数):      {r2:.4f}")

# ============================================
# 5. 可视化
# ============================================

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# 预测值 vs 真实值
axes[0].scatter(y_test, y_pred, alpha=0.3, s=10)
axes[0].plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
axes[0].set_xlabel('真实值')
axes[0].set_ylabel('预测值')
axes[0].set_title('预测值 vs 真实值')

# 残差分布
residuals = y_test - y_pred
axes[1].hist(residuals, bins=50, edgecolor='black', alpha=0.7)
axes[1].set_xlabel('残差')
axes[1].set_ylabel('频数')
axes[1].set_title('残差分布')

plt.tight_layout()
plt.show()`,
  },
  {
    id: 'logistic-regression',
    title: 'sklearn 逻辑回归 - 鸢尾花分类',
    description: '使用 LogisticRegression 对鸢尾花进行三分类',
    language: 'python',
    tags: ['sklearn', '分类', '入门'],
    code: `"""
鸢尾花分类 - 逻辑回归实战
"""

import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt

# 1. 加载数据
iris = load_iris()
X, y = iris.data, iris.target

# 2. 数据划分
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

# 3. 标准化
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 4. 训练模型
model = LogisticRegression(random_state=42, max_iter=200)
model.fit(X_train_scaled, y_train)

# 5. 评估
y_pred = model.predict(X_test_scaled)
print("分类报告:")
print(classification_report(y_test, y_pred, target_names=iris.target_names))

# 6. 混淆矩阵可视化
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=iris.target_names,
            yticklabels=iris.target_names)
plt.xlabel('预测标签')
plt.ylabel('真实标签')
plt.title('混淆矩阵')
plt.show()`,
  },
  {
    id: 'random-forest',
    title: '随机森林 - 特征重要性分析',
    description: '使用 RandomForestClassifier 进行特征重要性分析',
    language: 'python',
    tags: ['sklearn', '集成学习', '进阶'],
    code: `"""
随机森林 - 特征重要性分析
"""

from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import cross_val_score
import matplotlib.pyplot as plt
import numpy as np

# 加载乳腺癌数据集
data = load_breast_cancer()
X, y = data.data, data.target

# 训练随机森林
rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    n_jobs=-1
)
rf.fit(X, y)

# 交叉验证
cv_scores = cross_val_score(rf, X, y, cv=5, scoring='accuracy')
print(f"交叉验证准确率: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

# 特征重要性排序
importance = rf.feature_importances_
indices = np.argsort(importance)[::-1][:15]  # Top 15

plt.figure(figsize=(10, 8))
plt.barh(range(len(indices)), importance[indices][::-1])
plt.yticks(range(len(indices)), data.feature_names[indices][::-1])
plt.xlabel('特征重要性')
plt.title('Top 15 重要特征 (Random Forest)')
plt.tight_layout()
plt.show()`,
  },
  {
    id: 'tf-neural-network',
    title: 'TensorFlow/Keras - 神经网络构建',
    description: '使用 Keras Sequential API 构建神经网络进行图像分类',
    language: 'python',
    tags: ['tensorflow', 'keras', '深度学习'],
    code: `"""
TensorFlow/Keras 神经网络 - MNIST 手写数字识别
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import matplotlib.pyplot as plt
import numpy as np

# ============================================
# 1. 数据准备
# ============================================

(x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()

# 归一化到 [0, 1]
x_train = x_train.astype('float32') / 255.0
x_test = x_test.astype('float32') / 255.0

print(f"训练集: {x_train.shape}, 测试集: {x_test.shape}")

# ============================================
# 2. 构建模型
# ============================================

model = keras.Sequential([
    layers.Flatten(input_shape=(28, 28)),      # 展平 28x28 -> 784
    layers.Dense(256, activation='relu'),       # 隐藏层 1
    layers.Dropout(0.3),                        # Dropout 防止过拟合
    layers.Dense(128, activation='relu'),       # 隐藏层 2
    layers.Dropout(0.2),                        # Dropout
    layers.Dense(10, activation='softmax')      # 输出层 (10个类别)
])

# 编译模型
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

# ============================================
# 3. 训练模型
# ============================================

# 添加回调
callbacks = [
    keras.callbacks.EarlyStopping(
        patience=5, restore_best_weights=True
    ),
    keras.callbacks.ReduceLROnPlateau(
        factor=0.5, patience=3, min_lr=1e-6
    )
]

history = model.fit(
    x_train, y_train,
    validation_split=0.1,
    epochs=30,
    batch_size=128,
    callbacks=callbacks,
    verbose=1
)

# ============================================
# 4. 评估与可视化
# ============================================

test_loss, test_acc = model.evaluate(x_test, y_test)
print(f"\\n测试集准确率: {test_acc:.4f}")

# 绘制训练曲线
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

ax1.plot(history.history['accuracy'], label='训练准确率')
ax1.plot(history.history['val_accuracy'], label='验证准确率')
ax1.set_title('模型准确率')
ax1.legend()

ax2.plot(history.history['loss'], label='训练损失')
ax2.plot(history.history['val_loss'], label='验证损失')
ax2.set_title('模型损失')
ax2.legend()

plt.tight_layout()
plt.show()`,
  },
  {
    id: 'fastapi-serving',
    title: 'FastAPI 模型服务',
    description: '使用 FastAPI 将训练好的模型封装为 REST API',
    language: 'python',
    tags: ['fastapi', '部署', 'API'],
    code: `"""
FastAPI 模型服务 - 房价预测 API
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
from typing import List

# ============================================
# 初始化
# ============================================

app = FastAPI(
    title="房价预测 API",
    description="基于加州房价数据集的线性回归模型",
    version="1.0.0"
)

# 加载模型和预处理器
model = joblib.load("models_saved/sklearn/linear_regression.pkl")
scaler = joblib.load("models_saved/sklearn/scaler.pkl")

# ============================================
# 数据模型
# ============================================

class HouseFeatures(BaseModel):
    """输入特征"""
    MedInc: float       # 街区收入中位数
    HouseAge: float     # 房屋年龄中位数
    AveRooms: float     # 平均房间数
    AveBedrms: float    # 平均卧室数
    Population: float   # 街区人口
    AveOccup: float     # 平均入住率
    Latitude: float     # 纬度
    Longitude: float    # 经度

class PredictionResponse(BaseModel):
    """预测结果"""
    predicted_price: float
    features: dict

# ============================================
# API 路由
# ============================================

@app.get("/")
async def root():
    return {"message": "房价预测 API 运行中 🏠"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/predict", response_model=PredictionResponse)
async def predict(house: HouseFeatures):
    """
    根据房屋特征预测房价
    """
    try:
        # 构建特征向量
        features = np.array([[
            house.MedInc, house.HouseAge, house.AveRooms,
            house.AveBedrms, house.Population, house.AveOccup,
            house.Latitude, house.Longitude
        ]])

        # 标准化 & 预测
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]

        return PredictionResponse(
            predicted_price=round(float(prediction), 4),
            features=house.dict()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/batch")
async def predict_batch(houses: List[HouseFeatures]):
    """批量预测"""
    features = np.array([
        [h.MedInc, h.HouseAge, h.AveRooms, h.AveBedrms,
         h.Population, h.AveOccup, h.Latitude, h.Longitude]
        for h in houses
    ])
    features_scaled = scaler.transform(features)
    predictions = model.predict(features_scaled)

    return {
        "predictions": [round(float(p), 4) for p in predictions],
        "count": len(predictions)
    }

# ============================================
# 启动
# ============================================
# uvicorn main:app --reload --port 8000`,
  },
]

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors z-10"
        title="复制代码"
      >
        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-slate-400" />}
      </button>
      <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} p-5 rounded-xl overflow-x-auto text-sm leading-relaxed`}
            style={{ ...style, backgroundColor: '#0f172a' }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="inline-block w-8 text-right mr-4 text-slate-600 select-none text-xs">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}

export default function CodeExample() {
  const [activeExample, setActiveExample] = useState(examples[0].id)
  const current = examples.find((e) => e.id === activeExample)!

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">代码示例</h2>
        <p className="text-slate-400">
          完整的可运行代码，涵盖 sklearn、TensorFlow 和 FastAPI 实战
        </p>
      </div>

      {/* Example Selector */}
      <div className="flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => setActiveExample(example.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeExample === example.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
            }`}
          >
            {example.title.split(' - ')[0]}
          </button>
        ))}
      </div>

      {/* Code Display */}
      <motion.div
        key={activeExample}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {/* Info Card */}
        <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{current.title}</h3>
              <p className="text-sm text-slate-400">{current.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              {current.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-slate-700/50 text-xs text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Code Block */}
        <CodeBlock code={current.code} language={current.language} />

        {/* Run Instructions */}
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <p className="text-sm text-emerald-400 flex items-center gap-2">
            <ChevronDown size={16} className="rotate-[-90deg]" />
            运行方式：将代码复制到 Jupyter Notebook 的 Cell 中，逐段执行
          </p>
        </div>
      </motion.div>
    </div>
  )
}
