import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, FileCode, Database } from 'lucide-react'

interface TreeNode {
  name: string
  type: 'folder' | 'file' | 'notebook' | 'data'
  description?: string
  children?: TreeNode[]
}

const projectTree: TreeNode = {
  name: 'ml-library-practice/',
  type: 'folder',
  children: [
    {
      name: 'notebooks/',
      type: 'folder',
      description: 'Jupyter 学习笔记本',
      children: [
        {
          name: '01_sklearn_basics/',
          type: 'folder',
          description: 'scikit-learn 基础',
          children: [
            { name: '01_introduction.ipynb', type: 'notebook', description: 'ML 概念与 sklearn 概览' },
            { name: '02_data_preprocessing.ipynb', type: 'notebook', description: '数据加载与预处理' },
            { name: '03_linear_regression.ipynb', type: 'notebook', description: '线性回归实战' },
            { name: '04_logistic_regression.ipynb', type: 'notebook', description: '逻辑回归与分类' },
            { name: '05_decision_trees.ipynb', type: 'notebook', description: '决策树与随机森林' },
            { name: '06_svm.ipynb', type: 'notebook', description: '支持向量机' },
            { name: '07_model_evaluation.ipynb', type: 'notebook', description: '模型评估与交叉验证' },
          ],
        },
        {
          name: '02_sklearn_advanced/',
          type: 'folder',
          description: 'scikit-learn 进阶',
          children: [
            { name: '01_feature_engineering.ipynb', type: 'notebook', description: '特征工程技巧' },
            { name: '02_pipelines.ipynb', type: 'notebook', description: 'Pipeline 与 ColumnTransformer' },
            { name: '03_ensemble_methods.ipynb', type: 'notebook', description: '集成学习方法' },
            { name: '04_hyperparameter_tuning.ipynb', type: 'notebook', description: '超参数调优' },
            { name: '05_clustering.ipynb', type: 'notebook', description: '聚类算法' },
            { name: '06_dimensionality_reduction.ipynb', type: 'notebook', description: '降维与 PCA' },
          ],
        },
        {
          name: '03_tensorflow_basics/',
          type: 'folder',
          description: 'TensorFlow 基础',
          children: [
            { name: '01_tensorflow_intro.ipynb', type: 'notebook', description: 'TF 基础与张量操作' },
            { name: '02_neural_network_basics.ipynb', type: 'notebook', description: '神经网络基础' },
            { name: '03_keras_sequential.ipynb', type: 'notebook', description: 'Keras Sequential API' },
            { name: '04_training_techniques.ipynb', type: 'notebook', description: '训练技巧与回调' },
          ],
        },
        {
          name: '04_tensorflow_advanced/',
          type: 'folder',
          description: 'TensorFlow 进阶',
          children: [
            { name: '01_cnn_image_classification.ipynb', type: 'notebook', description: 'CNN 图像分类' },
            { name: '02_rnn_sequence.ipynb', type: 'notebook', description: 'RNN 序列建模' },
            { name: '03_transfer_learning.ipynb', type: 'notebook', description: '迁移学习' },
            { name: '04_custom_training.ipynb', type: 'notebook', description: '自定义训练循环' },
          ],
        },
        {
          name: '05_deployment/',
          type: 'folder',
          description: '模型部署',
          children: [
            { name: '01_model_saving.ipynb', type: 'notebook', description: '模型保存与加载' },
            { name: '02_fastapi_basics.ipynb', type: 'notebook', description: 'FastAPI 入门' },
            { name: '03_model_serving.ipynb', type: 'notebook', description: '模型 API 服务' },
          ],
        },
      ],
    },
    {
      name: 'src/',
      type: 'folder',
      description: 'Python 源代码',
      children: [
        { name: 'preprocessing/', type: 'folder', description: '数据预处理模块', children: [
          { name: '__init__.py', type: 'file' },
          { name: 'data_loader.py', type: 'file', description: '数据加载工具' },
          { name: 'feature_engineer.py', type: 'file', description: '特征工程' },
        ]},
        { name: 'models/', type: 'folder', description: '模型定义', children: [
          { name: '__init__.py', type: 'file' },
          { name: 'sklearn_models.py', type: 'file', description: 'sklearn 模型封装' },
          { name: 'tf_models.py', type: 'file', description: 'TensorFlow 模型' },
        ]},
        { name: 'api/', type: 'folder', description: 'FastAPI 接口', children: [
          { name: 'main.py', type: 'file', description: 'API 入口' },
          { name: 'schemas.py', type: 'file', description: '数据模型' },
          { name: 'routers/', type: 'folder', description: '路由', children: [
            { name: 'predict.py', type: 'file', description: '预测接口' },
            { name: 'train.py', type: 'file', description: '训练接口' },
          ]},
        ]},
        { name: 'utils/', type: 'folder', description: '工具函数', children: [
          { name: '__init__.py', type: 'file' },
          { name: 'metrics.py', type: 'file', description: '评估指标' },
          { name: 'visualization.py', type: 'file', description: '可视化工具' },
        ]},
      ],
    },
    {
      name: 'data/',
      type: 'folder',
      description: '数据集',
      children: [
        { name: 'raw/', type: 'folder', description: '原始数据', children: [
          { name: 'housing.csv', type: 'data', description: '加州房价数据' },
          { name: 'iris.csv', type: 'data', description: '鸢尾花数据' },
        ]},
        { name: 'processed/', type: 'folder', description: '处理后数据' },
      ],
    },
    {
      name: 'models_saved/',
      type: 'folder',
      description: '保存的模型文件',
      children: [
        { name: 'sklearn/', type: 'folder', description: 'sklearn 模型 (.pkl)' },
        { name: 'tensorflow/', type: 'folder', description: 'TF 模型 (.h5)' },
      ],
    },
    { name: 'requirements.txt', type: 'file', description: 'Python 依赖' },
    { name: 'README.md', type: 'file', description: '项目说明文档' },
    { name: 'setup.py', type: 'file', description: '项目安装配置' },
    { name: '.gitignore', type: 'file', description: 'Git 忽略规则' },
    { name: 'docker-compose.yml', type: 'file', description: 'Docker 编排' },
  ],
}

function FileIcon({ type }: { type: string }) {
  switch (type) {
    case 'notebook':
      return <FileCode size={16} className="text-orange-400" />
    case 'data':
      return <Database size={16} className="text-emerald-400" />
    case 'file':
      return <FileText size={16} className="text-slate-400" />
    default:
      return null
  }
}

function TreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [isOpen, setIsOpen] = useState(depth < 2)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-700/30 cursor-pointer transition-colors group`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown size={14} className="text-slate-500 shrink-0" />
          ) : (
            <ChevronRight size={14} className="text-slate-500 shrink-0" />
          )
        ) : (
          <span className="w-3.5 shrink-0" />
        )}

        {hasChildren ? (
          isOpen ? (
            <FolderOpen size={16} className="text-amber-400 shrink-0" />
          ) : (
            <Folder size={16} className="text-amber-400 shrink-0" />
          )
        ) : (
          <FileIcon type={node.type} />
        )}

        <span className={`text-sm ${hasChildren ? 'text-white font-medium' : 'text-slate-300'}`}>
          {node.name}
        </span>

        {node.description && (
          <span className="text-xs text-slate-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {node.description}
          </span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children!.map((child, i) => (
              <TreeItem key={`${child.name}-${i}`} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProjectStructure() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">项目结构</h2>
        <p className="text-slate-400">
          清晰的项目组织，按照学习路径和功能模块划分目录
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File Tree */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-xs text-slate-500 ml-2">ml-library-practice/</span>
          </div>
          <div className="max-h-[600px] overflow-y-auto pr-2">
            <TreeItem node={projectTree} />
          </div>
        </div>

        {/* Legend & Info */}
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <h3 className="text-sm font-semibold text-white mb-3">图例说明</h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm">
                <Folder size={16} className="text-amber-400" />
                <span className="text-slate-300">目录</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <FileCode size={16} className="text-orange-400" />
                <span className="text-slate-300">Jupyter Notebook</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <FileText size={16} className="text-slate-400" />
                <span className="text-slate-300">Python 文件</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Database size={16} className="text-emerald-400" />
                <span className="text-slate-300">数据文件</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <h3 className="text-sm font-semibold text-white mb-3">设计原则</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>Notebooks 按主题和难度分级</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>src/ 包含可复用的模块代码</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>数据与代码分离管理</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>模型文件独立存储</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>API 层与训练层解耦</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
            <h3 className="text-sm font-semibold text-emerald-400 mb-2">💡 提示</h3>
            <p className="text-sm text-slate-400">
              点击左侧目录树可以展开/折叠文件夹。将鼠标悬停在文件上可以查看描述信息。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
