import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Database,
  Cog,
  Brain,
  BarChart3,
  Rocket,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react'

interface WorkflowStep {
  id: string
  title: string
  icon: React.ReactNode
  color: string
  description: string
  tools: string[]
  keyConcepts: string[]
  code: string
  tips: string[]
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 'data',
    title: '1. 数据收集与探索',
    icon: <Database size={24} />,
    color: 'from-blue-500 to-indigo-500',
    description: '理解数据、发现规律、识别问题',
    tools: ['pandas', 'matplotlib', 'seaborn', 'sklearn.datasets'],
    keyConcepts: ['EDA (探索性数据分析)', '数据分布', '缺失值检测', '异常值识别', '相关性分析'],
    code: `import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# 加载数据
df = pd.read_csv('data/raw/housing.csv')

# 基本信息
print(df.info())
print(df.describe())

# 可视化分布
fig, axes = plt.subplots(2, 3, figsize=(15, 10))
for i, col in enumerate(df.columns[:6]):
    ax = axes[i // 3, i % 3]
    sns.histplot(df[col], ax=ax, kde=True)
    ax.set_title(col)
plt.tight_layout()
plt.show()

# 相关性矩阵
corr = df.corr()
sns.heatmap(corr, annot=True, cmap='coolwarm')
plt.show()`,
    tips: [
      '先了解业务背景再分析数据',
      '注意数据泄漏问题',
      '检查类别不平衡',
    ],
  },
  {
    id: 'preprocessing',
    title: '2. 数据预处理',
    icon: <Cog size={24} />,
    color: 'from-purple-500 to-pink-500',
    description: '清洗数据、特征工程、构建 Pipeline',
    tools: ['StandardScaler', 'LabelEncoder', 'OneHotEncoder', 'SimpleImputer', 'Pipeline'],
    keyConcepts: ['特征缩放', '类别编码', '缺失值处理', '特征选择', 'Pipeline'],
    code: `from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer

# 数值型特征处理
numeric_features = ['age', 'income', 'rooms']
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# 类别型特征处理
categorical_features = ['city', 'type']
categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

# 组合预处理
preprocessor = ColumnTransformer(transformers=[
    ('num', numeric_transformer, numeric_features),
    ('cat', categorical_transformer, categorical_features)
])

# 完整 Pipeline
from sklearn.ensemble import RandomForestRegressor
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('model', RandomForestRegressor(n_estimators=100))
])`,
    tips: [
      '使用 Pipeline 避免数据泄漏',
      'fit 只在训练集上，transform 在测试集上',
      '考虑使用 ColumnTransformer 处理混合类型',
    ],
  },
  {
    id: 'training',
    title: '3. 模型训练',
    icon: <Brain size={24} />,
    color: 'from-amber-500 to-orange-500',
    description: '选择算法、训练模型、调参优化',
    tools: ['LinearRegression', 'RandomForest', 'XGBoost', 'SVM', 'Neural Networks'],
    keyConcepts: ['偏差-方差权衡', '正则化', '交叉验证', 'GridSearchCV', '学习曲线'],
    code: `from sklearn.model_selection import (
    cross_val_score, GridSearchCV, learning_curve
)
from sklearn.ensemble import RandomForestRegressor

# 基础模型
model = RandomForestRegressor(random_state=42)

# 交叉验证
cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='neg_mean_squared_error')
print(f"CV MSE: {-cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

# 超参数调优
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 20, None],
    'min_samples_split': [2, 5, 10],
}

grid_search = GridSearchCV(
    model, param_grid, cv=5,
    scoring='neg_mean_squared_error',
    n_jobs=-1, verbose=1
)
grid_search.fit(X_train, y_train)

print(f"最佳参数: {grid_search.best_params_}")
print(f"最佳分数: {-grid_search.best_score_:.4f}")

best_model = grid_search.best_estimator_`,
    tips: [
      '从简单模型开始，逐步增加复杂度',
      '使用交叉验证避免过拟合',
      '注意训练时间和效果的平衡',
    ],
  },
  {
    id: 'evaluation',
    title: '4. 模型评估',
    icon: <BarChart3 size={24} />,
    color: 'from-emerald-500 to-teal-500',
    description: '多维度评估、误差分析、模型解释',
    tools: ['mean_squared_error', 'r2_score', 'classification_report', 'confusion_matrix', 'SHAP'],
    keyConcepts: ['评估指标选择', '混淆矩阵', 'ROC 曲线', '学习曲线', 'SHAP 解释'],
    code: `from sklearn.metrics import (
    mean_squared_error, r2_score,
    classification_report, roc_curve, auc
)
import shap

# 回归评估
y_pred = best_model.predict(X_test)
print(f"RMSE: {mean_squared_error(y_test, y_pred, squared=False):.4f}")
print(f"R²:   {r2_score(y_test, y_pred):.4f}")

# 分类评估 (如果是分类任务)
y_pred_class = classifier.predict(X_test)
print(classification_report(y_test, y_pred_class))

# 特征重要性
importances = best_model.feature_importances_
feature_names = preprocessor.get_feature_names_out()

# SHAP 解释 (更强大的模型解释)
explainer = shap.TreeExplainer(best_model)
shap_values = explainer.shap_values(X_test)
shap.summary_plot(shap_values, X_test, feature_names=feature_names)`,
    tips: [
      '根据业务选择合适的评估指标',
      '不仅看整体指标，也分析子群体表现',
      '使用 SHAP/LIME 解释模型预测',
    ],
  },
  {
    id: 'deployment',
    title: '5. 模型部署',
    icon: <Rocket size={24} />,
    color: 'from-rose-500 to-red-500',
    description: '模型服务化、API 封装、容器化部署',
    tools: ['FastAPI', 'Docker', 'joblib', 'TensorFlow Serving', 'MLflow'],
    keyConcepts: ['REST API', '模型序列化', '容器化', 'CI/CD', '监控'],
    code: `# model_api.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="ML Model API")

# 加载模型
model = joblib.load("models_saved/best_model.pkl")
scaler = joblib.load("models_saved/scaler.pkl")

class InputData(BaseModel):
    features: list[float]

@app.post("/predict")
async def predict(data: InputData):
    X = np.array(data.features).reshape(1, -1)
    X_scaled = scaler.transform(X)
    prediction = model.predict(X_scaled)
    return {"prediction": float(prediction[0])}

# Dockerfile
# FROM python:3.10-slim
# WORKDIR /app
# COPY requirements.txt .
# RUN pip install -r requirements.txt
# COPY . .
# CMD ["uvicorn", "model_api:app", "--host", "0.0.0.0", "--port", "8000"]`,
    tips: [
      '使用 Docker 确保环境一致性',
      '添加健康检查端点',
      '考虑模型版本管理 (MLflow)',
      '设置监控和告警',
    ],
  },
]

export default function MLWorkflow() {
  const [activeStep, setActiveStep] = useState(workflowSteps[0].id)
  const current = workflowSteps.find((s) => s.id === activeStep)!

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">ML 工作流</h2>
        <p className="text-slate-400">
          完整的机器学习项目流程：从数据到部署的五个关键步骤
        </p>
      </div>

      {/* Workflow Steps Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {workflowSteps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeStep === step.id
                  ? `bg-gradient-to-r ${step.color} text-white shadow-lg`
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-slate-700/50'
              }`}
            >
              {step.icon}
              <span className="hidden sm:inline">{step.title.split('. ')[1]}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
            {i < workflowSteps.length - 1 && (
              <ArrowRight size={16} className="text-slate-600 mx-1 shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Active Step Detail */}
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Step Header */}
          <div className={`p-6 rounded-2xl bg-gradient-to-r ${current.color} bg-opacity-20`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-white/10">{current.icon}</div>
              <h3 className="text-xl font-bold text-white">{current.title}</h3>
            </div>
            <p className="text-white/80">{current.description}</p>
          </div>

          {/* Code */}
          <div className="rounded-2xl overflow-hidden border border-slate-700/50">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-xs text-slate-500 ml-2">example.py</span>
            </div>
            <pre className="p-5 bg-slate-900 overflow-x-auto text-sm leading-relaxed">
              <code className="text-slate-300">{current.code}</code>
            </pre>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Tools */}
          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Cog size={16} className="text-slate-400" />
              使用工具
            </h4>
            <div className="flex flex-wrap gap-2">
              {current.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1 rounded-lg bg-slate-700/50 text-xs text-slate-300 border border-slate-600/30"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Key Concepts */}
          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              核心概念
            </h4>
            <ul className="space-y-2">
              {current.keyConcepts.map((concept) => (
                <li key={concept} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                  {concept}
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
              <Lightbulb size={16} />
              实践建议
            </h4>
            <ul className="space-y-2">
              {current.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <AlertCircle size={14} className="text-amber-400/60 mt-0.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Bottom Flow Diagram */}
      <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50">
        <h4 className="text-sm font-semibold text-white mb-4 text-center">完整工作流概览</h4>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {workflowSteps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                  activeStep === step.id
                    ? `bg-gradient-to-r ${step.color} text-white`
                    : 'bg-slate-700/50 text-slate-400'
                }`}
              >
                {step.icon}
                <span className="hidden md:inline">{step.title.split('. ')[1]}</span>
              </div>
              {i < workflowSteps.length - 1 && (
                <ArrowRight size={14} className="text-slate-600" />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-500 mt-4">
          💡 点击上方的步骤按钮查看每个阶段的详细内容、代码示例和实践建议
        </p>
      </div>
    </div>
  )
}
