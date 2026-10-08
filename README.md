# ml-library-practice

> 🤖 机器学习实战学习项目 — 从零基础到模型部署

一个完整的 ML 学习项目，涵盖 scikit-learn 传统机器学习与 TensorFlow 深度学习，通过 Jupyter Notebooks 交互式学习，最终用 FastAPI 部署模型。

## ✨ 项目特色

- 📊 **scikit-learn 完整路径** — 从数据预处理到模型评估
- 🧠 **TensorFlow/Keras 深度学习** — CNN、RNN、迁移学习
- 🔄 **真实 ML 工作流** — 数据 → 预处理 → 训练 → 评估 → 部署
- 📓 **Jupyter Notebooks** — 交互式学习，边学边练
- 🌐 **FastAPI 部署** — 模型服务化，REST API

## 🛠 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 语言 | Python | 3.10+ |
| ML 库 | scikit-learn | 1.3+ |
| 深度学习 | TensorFlow | 2.x |
| Web API | FastAPI | 0.100+ |
| 数据处理 | Pandas, NumPy | 2.0+, 1.24+ |
| 可视化 | Matplotlib, Seaborn | 3.7+, 0.12+ |
| 环境 | Jupyter Lab | 4.0+ |

## 📁 项目结构

```
ml-library-practice/
├── notebooks/                    # Jupyter 学习笔记本
│   ├── 01_sklearn_basics/        # scikit-learn 基础
│   │   ├── 01_introduction.ipynb
│   │   ├── 02_data_preprocessing.ipynb
│   │   ├── 03_linear_regression.ipynb
│   │   ├── 04_logistic_regression.ipynb
│   │   ├── 05_decision_trees.ipynb
│   │   ├── 06_svm.ipynb
│   │   └── 07_model_evaluation.ipynb
│   ├── 02_sklearn_advanced/      # scikit-learn 进阶
│   ├── 03_tensorflow_basics/     # TensorFlow 基础
│   ├── 04_tensorflow_advanced/   # TensorFlow 进阶
│   └── 05_deployment/            # 模型部署
├── python/                       # Python 源码
│   └── src/
│       ├── preprocessing/        # 数据预处理模块
│       │   ├── data_loader.py
│       │   └── feature_engineer.py
│       ├── models/               # 模型定义
│       │   ├── sklearn_models.py
│       │   └── tf_models.py
│       └── api/                  # FastAPI 接口
│           └── main.py
├── data/                         # 数据集
│   ├── raw/                      # 原始数据
│   └── processed/                # 处理后数据
├── models_saved/                 # 保存的模型
├── requirements.txt              # Python 依赖
├── Dockerfile                    # Docker 配置
└── README.md
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/ml-library-practice.git
cd ml-library-practice
```

### 2. 创建虚拟环境

```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

### 3. 安装依赖

```bash
pip install -r requirements.txt
```

### 4. 启动 Jupyter Lab

```bash
jupyter lab
```

### 5. 启动 API 服务（可选）

```bash
cd python/src/api
python main.py
# 访问 http://localhost:8000/docs 查看 API 文档
```

## 📚 学习路径

### 第一阶段：scikit-learn 基础（约 7 小时）
1. ML 概念与 sklearn 概览
2. 数据加载与预处理
3. 线性回归实战 ⭐
4. 逻辑回归与分类
5. 决策树与随机森林
6. 支持向量机
7. 模型评估与交叉验证

### 第二阶段：scikit-learn 进阶（约 8 小时）
1. 特征工程技巧
2. Pipeline 与 ColumnTransformer
3. 集成学习方法
4. 超参数调优
5. 聚类算法
6. 降维与 PCA

### 第三阶段：TensorFlow 基础（约 6 小时）
1. TF 基础与张量操作
2. 神经网络基础
3. Keras Sequential API
4. 训练技巧与回调

### 第四阶段：TensorFlow 进阶（约 7 小时）
1. CNN 图像分类
2. RNN 序列建模
3. 迁移学习
4. 自定义训练循环

### 第五阶段：模型部署（约 4 小时）
1. 模型保存与加载
2. FastAPI 入门
3. 模型 API 服务

## 🐳 Docker 部署

```bash
# 构建镜像
docker build -t ml-practice .

# 运行容器
docker run -p 8000:8000 ml-practice
```

## 📝 许可证

MIT License
