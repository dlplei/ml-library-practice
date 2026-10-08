import { motion } from 'framer-motion'
import { CheckCircle2, Circle, BookOpen, Clock, BarChart3 } from 'lucide-react'

interface Notebook {
  title: string
  description: string
  duration: string
  difficulty: '入门' | '基础' | '进阶' | '高级'
  completed: boolean
}

interface LearningModule {
  id: string
  title: string
  subtitle: string
  icon: string
  color: string
  notebooks: Notebook[]
}

const modules: LearningModule[] = [
  {
    id: 'sklearn-basics',
    title: '第一阶段：scikit-learn 基础',
    subtitle: '掌握传统机器学习核心算法',
    icon: '📊',
    color: 'from-purple-500 to-indigo-500',
    notebooks: [
      { title: 'ML 概念与 sklearn 概览', description: '机器学习三大范式、sklearn API 设计', duration: '45 min', difficulty: '入门', completed: true },
      { title: '数据加载与预处理', description: 'sklearn datasets、StandardScaler、LabelEncoder', duration: '60 min', difficulty: '入门', completed: true },
      { title: '线性回归实战', description: 'LinearRegression、波士顿房价预测', duration: '75 min', difficulty: '基础', completed: true },
      { title: '逻辑回归与分类', description: 'LogisticRegression、鸢尾花分类', duration: '60 min', difficulty: '基础', completed: false },
      { title: '决策树与随机森林', description: 'DecisionTree、RandomForest、特征重要性', duration: '90 min', difficulty: '基础', completed: false },
      { title: '支持向量机', description: 'SVC、核函数、非线性分类', duration: '75 min', difficulty: '进阶', completed: false },
      { title: '模型评估与交叉验证', description: 'cross_val_score、GridSearchCV、混淆矩阵', duration: '90 min', difficulty: '进阶', completed: false },
    ],
  },
  {
    id: 'sklearn-advanced',
    title: '第二阶段：scikit-learn 进阶',
    subtitle: '特征工程、集成学习与模型调优',
    icon: '🔧',
    color: 'from-blue-500 to-cyan-500',
    notebooks: [
      { title: '特征工程技巧', description: '多项式特征、特征选择、特征提取', duration: '90 min', difficulty: '进阶', completed: false },
      { title: 'Pipeline 与 ColumnTransformer', description: '构建完整的数据处理流水线', duration: '75 min', difficulty: '进阶', completed: false },
      { title: '集成学习方法', description: 'Bagging、Boosting、Stacking', duration: '120 min', difficulty: '进阶', completed: false },
      { title: '超参数调优', description: 'GridSearchCV、RandomizedSearchCV、BayesSearchCV', duration: '90 min', difficulty: '进阶', completed: false },
      { title: '聚类算法', description: 'KMeans、DBSCAN、层次聚类', duration: '90 min', difficulty: '进阶', completed: false },
      { title: '降维与 PCA', description: 'PCA、t-SNE、LDA', duration: '75 min', difficulty: '高级', completed: false },
    ],
  },
  {
    id: 'tf-basics',
    title: '第三阶段：TensorFlow 基础',
    subtitle: '深度学习入门与 Keras 实践',
    icon: '🧠',
    color: 'from-amber-500 to-orange-500',
    notebooks: [
      { title: 'TF 基础与张量操作', description: 'Tensor、Variable、自动微分', duration: '90 min', difficulty: '基础', completed: false },
      { title: '神经网络基础', description: '感知机、激活函数、反向传播', duration: '90 min', difficulty: '基础', completed: false },
      { title: 'Keras Sequential API', description: '构建第一个神经网络、MNIST 手写数字', duration: '75 min', difficulty: '基础', completed: false },
      { title: '训练技巧与回调', description: 'EarlyStopping、LearningRateScheduler、TensorBoard', duration: '60 min', difficulty: '进阶', completed: false },
    ],
  },
  {
    id: 'tf-advanced',
    title: '第四阶段：TensorFlow 进阶',
    subtitle: 'CNN、RNN 与迁移学习',
    icon: '🚀',
    color: 'from-rose-500 to-pink-500',
    notebooks: [
      { title: 'CNN 图像分类', description: '卷积层、池化层、CIFAR-10 实战', duration: '120 min', difficulty: '进阶', completed: false },
      { title: 'RNN 序列建模', description: 'LSTM、GRU、时间序列预测', duration: '120 min', difficulty: '进阶', completed: false },
      { title: '迁移学习', description: '预训练模型、Fine-tuning、ImageNet', duration: '90 min', difficulty: '高级', completed: false },
      { title: '自定义训练循环', description: 'tf.GradientTape、自定义损失函数', duration: '90 min', difficulty: '高级', completed: false },
    ],
  },
  {
    id: 'deployment',
    title: '第五阶段：模型部署',
    subtitle: '从 Notebook 到生产环境',
    icon: '🌐',
    color: 'from-emerald-500 to-teal-500',
    notebooks: [
      { title: '模型保存与加载', description: 'joblib、pickle、SavedModel 格式', duration: '45 min', difficulty: '基础', completed: false },
      { title: 'FastAPI 入门', description: '路由、请求验证、Swagger 文档', duration: '90 min', difficulty: '基础', completed: false },
      { title: '模型 API 服务', description: '加载模型、预测接口、Docker 部署', duration: '120 min', difficulty: '进阶', completed: false },
    ],
  },
]

function DifficultyBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    '入门': 'bg-green-500/20 text-green-400 border-green-500/30',
    '基础': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    '进阶': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    '高级': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs border ${colors[level] || colors['基础']}`}>
      {level}
    </span>
  )
}

export default function LearningPath() {
  const totalNotebooks = modules.reduce((sum, m) => sum + m.notebooks.length, 0)
  const completedNotebooks = modules.reduce(
    (sum, m) => sum + m.notebooks.filter((n) => n.completed).length,
    0
  )
  const progress = Math.round((completedNotebooks / totalNotebooks) * 100)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">学习路径</h2>
        <p className="text-slate-400">
          从零基础到模型部署，共 {totalNotebooks} 个 Notebook，预计学习时长约 30+ 小时
        </p>
      </div>

      {/* Progress Bar */}
      <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <BarChart3 size={20} className="text-emerald-400" />
            <span className="text-sm font-medium text-white">总体进度</span>
          </div>
          <span className="text-sm text-emerald-400 font-semibold">
            {completedNotebooks}/{totalNotebooks} ({progress}%)
          </span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
          />
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-6">
        {modules.map((module, moduleIdx) => {
          const moduleCompleted = module.notebooks.filter((n) => n.completed).length
          const moduleTotal = module.notebooks.length

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: moduleIdx * 0.1 }}
              className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden"
            >
              {/* Module Header */}
              <div className={`p-5 bg-gradient-to-r ${module.color} bg-opacity-10`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{module.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                      <p className="text-sm text-white/70">{module.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-white/80">
                      {moduleCompleted}/{moduleTotal} 完成
                    </span>
                  </div>
                </div>
              </div>

              {/* Notebooks List */}
              <div className="p-4 space-y-2">
                {module.notebooks.map((notebook, nbIdx) => (
                  <div
                    key={nbIdx}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                      notebook.completed
                        ? 'bg-emerald-500/5 border border-emerald-500/20'
                        : 'bg-slate-700/20 border border-slate-700/30 hover:bg-slate-700/40'
                    }`}
                  >
                    {notebook.completed ? (
                      <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                    ) : (
                      <Circle size={20} className="text-slate-500 shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${notebook.completed ? 'text-emerald-300' : 'text-white'}`}>
                        {notebook.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{notebook.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <DifficultyBadge level={notebook.difficulty} />
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock size={12} />
                        {notebook.duration}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <BookOpen size={12} />
                        .ipynb
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
