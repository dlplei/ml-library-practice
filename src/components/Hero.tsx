import { motion } from 'framer-motion'
import { Brain, Database, Cpu, Rocket, BookOpen, Terminal } from 'lucide-react'

const features = [
  {
    icon: <Brain className="text-purple-400" size={24} />,
    title: 'scikit-learn 完整路径',
    description: '从数据预处理到模型评估，系统掌握传统机器学习算法',
    color: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-500/30',
  },
  {
    icon: <Cpu className="text-cyan-400" size={24} />,
    title: 'TensorFlow/Keras 深度学习',
    description: '构建神经网络，实践 CNN、RNN、Transformer 等架构',
    color: 'from-cyan-500/20 to-cyan-600/10',
    border: 'border-cyan-500/30',
  },
  {
    icon: <Database className="text-emerald-400" size={24} />,
    title: '真实 ML 工作流',
    description: '数据预处理 → 特征工程 → 模型训练 → 评估 → 部署',
    color: 'from-emerald-500/20 to-emerald-600/10',
    border: 'border-emerald-500/30',
  },
  {
    icon: <Terminal className="text-amber-400" size={24} />,
    title: 'Jupyter Notebooks',
    description: '交互式学习环境，边学边练，即时反馈',
    color: 'from-amber-500/20 to-amber-600/10',
    border: 'border-amber-500/30',
  },
  {
    icon: <Rocket className="text-rose-400" size={24} />,
    title: 'FastAPI 部署',
    description: '将训练好的模型封装为 REST API，实现模型服务化',
    color: 'from-rose-500/20 to-rose-600/10',
    border: 'border-rose-500/30',
  },
  {
    icon: <BookOpen className="text-indigo-400" size={24} />,
    title: '渐进式学习',
    description: '从基础概念到高级应用，循序渐进的学习路径',
    color: 'from-indigo-500/20 to-indigo-600/10',
    border: 'border-indigo-500/30',
  },
]

const techStack = [
  { name: 'Python', version: '3.10+', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { name: 'scikit-learn', version: '1.3+', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { name: 'TensorFlow', version: '2.x', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { name: 'FastAPI', version: '0.100+', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { name: 'Jupyter', version: 'Lab', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { name: 'NumPy', version: '1.24+', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
  { name: 'Pandas', version: '2.0+', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { name: 'Matplotlib', version: '3.7+', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
]

export default function Hero() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          实战导向 · 从零到部署
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            机器学习实战学习
          </span>
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          一个完整的 ML 学习项目，涵盖 scikit-learn 传统机器学习与 TensorFlow 深度学习，
          通过 Jupyter Notebooks 交互式学习，最终用 FastAPI 部署模型。
        </p>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">
          技术栈
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className={`px-4 py-2 rounded-xl border ${tech.color} text-sm font-medium flex items-center gap-2`}
            >
              {tech.name}
              <span className="text-xs opacity-70">{tech.version}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${feature.color} border ${feature.border} backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200`}
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Start */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Terminal size={20} className="text-emerald-400" />
          快速开始
        </h3>
        <div className="bg-slate-900 rounded-xl p-5 font-mono text-sm space-y-2 overflow-x-auto">
          <p className="text-slate-500"># 克隆项目</p>
          <p className="text-emerald-400">$ git clone https://github.com/your-username/ml-library-practice.git</p>
          <p className="text-emerald-400">$ cd ml-library-practice</p>
          <p className="text-slate-500 mt-3"># 创建虚拟环境</p>
          <p className="text-emerald-400">$ python -m venv venv</p>
          <p className="text-emerald-400">$ source venv/bin/activate  <span className="text-slate-500"># Windows: venv\Scripts\activate</span></p>
          <p className="text-slate-500 mt-3"># 安装依赖</p>
          <p className="text-emerald-400">$ pip install -r requirements.txt</p>
          <p className="text-slate-500 mt-3"># 启动 Jupyter Lab</p>
          <p className="text-emerald-400">$ jupyter lab</p>
        </div>
      </motion.div>
    </div>
  )
}
