from setuptools import setup, find_packages

setup(
    name="ml-library-practice",
    version="1.0.0",
    description="机器学习实战学习项目",
    author="ML Practice",
    python_requires=">=3.10",
    packages=find_packages(where="python"),
    package_dir={"": "python"},
    install_requires=[
        "scikit-learn>=1.3.0",
        "tensorflow>=2.14.0",
        "numpy>=1.24.0",
        "pandas>=2.0.0",
        "matplotlib>=3.7.0",
        "seaborn>=0.12.0",
        "fastapi>=0.104.0",
        "uvicorn>=0.24.0",
        "joblib>=1.3.0",
    ],
)
