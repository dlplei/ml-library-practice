"""
TensorFlow/Keras 模型构建工具
提供常用的深度学习模型构建、训练、评估接口
"""

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, callbacks, optimizers
from pathlib import Path
from typing import Dict, Any, Optional, Tuple, List


class TFModelBuilder:
    """
    TensorFlow 模型构建器

    Example
    -------
    >>> builder = TFModelBuilder()
    >>> model = builder.build_mlp(input_shape=(784,), num_classes=10)
    >>> history = builder.train(model, x_train, y_train, x_val, y_val)
    >>> builder.evaluate(model, x_test, y_test)
    >>> builder.save(model, 'models_saved/tf/my_model')
    """

    def __init__(self):
        self.history = None

    def build_mlp(
        self,
        input_shape: Tuple[int, ...],
        num_classes: int,
        hidden_layers: List[int] = [256, 128],
        dropout_rate: float = 0.3,
        activation: str = "relu",
        output_activation: str = "softmax",
    ) -> keras.Model:
        """
        构建多层感知机 (MLP)

        Parameters
        ----------
        input_shape : tuple
            输入形状
        num_classes : int
            输出类别数
        hidden_layers : list
            隐藏层神经元数量
        dropout_rate : float
            Dropout 比率
        """
        model = keras.Sequential(name="MLP")

        model.add(layers.Flatten(input_shape=input_shape))

        for i, units in enumerate(hidden_layers):
            model.add(layers.Dense(units, activation=activation, name=f"dense_{i+1}"))
            if dropout_rate > 0:
                model.add(layers.Dropout(dropout_rate, name=f"dropout_{i+1}"))

        model.add(layers.Dense(num_classes, activation=output_activation, name="output"))

        return model

    def build_cnn(
        self,
        input_shape: Tuple[int, ...],
        num_classes: int,
        conv_filters: List[int] = [32, 64, 128],
        kernel_size: int = 3,
        pool_size: int = 2,
        dropout_rate: float = 0.3,
    ) -> keras.Model:
        """
        构建卷积神经网络 (CNN)

        Parameters
        ----------
        input_shape : tuple
            输入形状 (H, W, C)
        num_classes : int
            输出类别数
        conv_filters : list
            各卷积层滤波器数量
        """
        model = keras.Sequential(name="CNN")

        for i, filters in enumerate(conv_filters):
            if i == 0:
                model.add(
                    layers.Conv2D(
                        filters, kernel_size, padding="same",
                        activation="relu", input_shape=input_shape,
                        name=f"conv_{i+1}"
                    )
                )
            else:
                model.add(
                    layers.Conv2D(
                        filters, kernel_size, padding="same",
                        activation="relu", name=f"conv_{i+1}"
                    )
                )
            model.add(layers.MaxPooling2D(pool_size, name=f"pool_{i+1}"))
            if dropout_rate > 0:
                model.add(layers.Dropout(0.25, name=f"conv_dropout_{i+1}"))

        model.add(layers.Flatten())
        model.add(layers.Dense(256, activation="relu", name="fc1"))
        if dropout_rate > 0:
            model.add(layers.Dropout(dropout_rate, name="fc_dropout"))
        model.add(layers.Dense(num_classes, activation="softmax", name="output"))

        return model

    def build_rnn(
        self,
        input_shape: Tuple[int, ...],
        num_classes: int,
        rnn_units: int = 128,
        rnn_type: str = "lstm",
        num_layers: int = 2,
        dropout_rate: float = 0.2,
        bidirectional: bool = True,
    ) -> keras.Model:
        """
        构建循环神经网络 (RNN/LSTM/GRU)

        Parameters
        ----------
        input_shape : tuple
            输入形状 (timesteps, features)
        rnn_type : str
            'lstm' 或 'gru'
        bidirectional : bool
            是否使用双向 RNN
        """
        model = keras.Sequential(name=rnn_type.upper())

        rnn_layer = layers.LSTM if rnn_type.lower() == "lstm" else layers.GRU

        for i in range(num_layers):
            return_seq = i < num_layers - 1  # 最后一层不返回序列

            layer = rnn_layer(
                rnn_units,
                return_sequences=return_seq,
                input_shape=input_shape if i == 0 else None,
                name=f"{rnn_type}_{i+1}",
            )

            if bidirectional:
                model.add(layers.Bidirectional(layer, name=f"bidirectional_{i+1}"))
            else:
                model.add(layer)

            if dropout_rate > 0 and i < num_layers - 1:
                model.add(layers.Dropout(dropout_rate))

        model.add(layers.Dense(64, activation="relu", name="fc"))
        model.add(layers.Dropout(dropout_rate))
        model.add(layers.Dense(num_classes, activation="softmax", name="output"))

        return model

    def compile_model(
        self,
        model: keras.Model,
        optimizer: str = "adam",
        loss: str = "sparse_categorical_crossentropy",
        metrics: Optional[List[str]] = None,
        learning_rate: float = 0.001,
    ) -> keras.Model:
        """编译模型"""
        if metrics is None:
            metrics = ["accuracy"]

        if optimizer == "adam":
            opt = optimizers.Adam(learning_rate=learning_rate)
        elif optimizer == "sgd":
            opt = optimizers.SGD(learning_rate=learning_rate, momentum=0.9)
        else:
            opt = optimizer

        model.compile(optimizer=opt, loss=loss, metrics=metrics)
        return model

    def get_callbacks(
        self,
        patience: int = 10,
        reduce_lr: bool = True,
        tensorboard: bool = False,
        log_dir: str = "logs",
    ) -> List[callbacks.Callback]:
        """获取训练回调"""
        cb_list = [
            callbacks.EarlyStopping(
                patience=patience,
                restore_best_weights=True,
                verbose=1,
            ),
        ]

        if reduce_lr:
            cb_list.append(
                callbacks.ReduceLROnPlateau(
                    factor=0.5,
                    patience=patience // 2,
                    min_lr=1e-6,
                    verbose=1,
                )
            )

        if tensorboard:
            cb_list.append(
                callbacks.TensorBoard(log_dir=log_dir, histogram_freq=1)
            )

        return cb_list

    def train(
        self,
        model: keras.Model,
        x_train: np.ndarray,
        y_train: np.ndarray,
        x_val: Optional[np.ndarray] = None,
        y_val: Optional[np.ndarray] = None,
        epochs: int = 50,
        batch_size: int = 32,
        callbacks_list: Optional[List] = None,
    ) -> keras.callbacks.History:
        """
        训练模型

        Returns
        -------
        History
            训练历史
        """
        if callbacks_list is None:
            callbacks_list = self.get_callbacks()

        validation_data = None
        if x_val is not None and y_val is not None:
            validation_data = (x_val, y_val)

        print(f"开始训练 (epochs={epochs}, batch_size={batch_size})")
        print(f"训练集: {x_train.shape}, 验证集: {x_val.shape if x_val is not None else 'N/A'}")

        self.history = model.fit(
            x_train, y_train,
            validation_data=validation_data,
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks_list,
            verbose=1,
        )

        return self.history

    def evaluate(
        self,
        model: keras.Model,
        x_test: np.ndarray,
        y_test: np.ndarray,
    ) -> Dict[str, float]:
        """评估模型"""
        results = model.evaluate(x_test, y_test, verbose=0)

        if isinstance(results, list):
            metrics = dict(zip(model.metrics_names, results))
        else:
            metrics = {"loss": float(results)}

        print(f"\n===== 评估结果 =====")
        for name, value in metrics.items():
            print(f"  {name}: {value:.4f}")

        return metrics

    def save(self, model: keras.Model, filepath: str):
        """保存模型"""
        path = Path(filepath)
        path.parent.mkdir(parents=True, exist_ok=True)

        if filepath.endswith(".h5"):
            model.save(filepath)
        else:
            model.save(filepath)

        print(f"✓ 模型已保存到 {filepath}")

    @staticmethod
    def load(filepath: str) -> keras.Model:
        """加载模型"""
        model = keras.models.load_model(filepath)
        print(f"✓ 模型已从 {filepath} 加载")
        return model

    def plot_history(self, history: Optional[keras.callbacks.History] = None):
        """绘制训练曲线"""
        import matplotlib.pyplot as plt

        if history is None:
            history = self.history

        if history is None:
            print("没有训练历史可绘制")
            return

        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

        # 准确率
        if "accuracy" in history.history:
            ax1.plot(history.history["accuracy"], label="训练准确率")
            ax1.plot(history.history["val_accuracy"], label="验证准确率")
        ax1.set_title("模型准确率")
        ax1.set_xlabel("Epoch")
        ax1.legend()

        # 损失
        ax2.plot(history.history["loss"], label="训练损失")
        if "val_loss" in history.history:
            ax2.plot(history.history["val_loss"], label="验证损失")
        ax2.set_title("模型损失")
        ax2.set_xlabel("Epoch")
        ax2.legend()

        plt.tight_layout()
        plt.show()


# ============================================
# 便捷函数
# ============================================

def build_and_train_mnist() -> Tuple[keras.Model, Dict]:
    """快速构建并训练 MNIST 模型"""
    builder = TFModelBuilder()

    # 加载数据
    (x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()
    x_train = x_train.astype("float32") / 255.0
    x_test = x_test.astype("float32") / 255.0

    # 构建模型
    model = builder.build_mlp(
        input_shape=(28, 28),
        num_classes=10,
        hidden_layers=[256, 128],
    )

    builder.compile_model(model)
    model.summary()

    # 训练
    history = builder.train(
        model, x_train, y_train,
        epochs=20,
        batch_size=128,
    )

    # 评估
    metrics = builder.evaluate(model, x_test, y_test)

    return model, metrics


if __name__ == "__main__":
    print("=" * 50)
    print("测试 TensorFlow 模型构建器")
    print("=" * 50)

    builder = TFModelBuilder()

    # 测试 MLP
    print("\n--- MLP ---")
    mlp = builder.build_mlp((784,), 10)
    builder.compile_model(mlp)
    mlp.summary()

    # 测试 CNN
    print("\n--- CNN ---")
    cnn = builder.build_cnn((28, 28, 1), 10)
    builder.compile_model(cnn)
    cnn.summary()

    # 测试 RNN
    print("\n--- LSTM ---")
    rnn = builder.build_rnn((100, 10), 5)
    builder.compile_model(rnn)
    rnn.summary()
