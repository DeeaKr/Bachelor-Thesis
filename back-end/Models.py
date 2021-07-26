from tensorflow.keras import Sequential
from keras.layers.core import Dense, Dropout, Activation, Flatten
from keras.layers.convolutional import Convolution2D, MaxPooling2D,AveragePooling2D
from tensorflow.python.keras.optimizer_v1 import Adam


def define_model_grid_model(dropout_rate=0.5, nb_conv_layers=3, nb_channels_conv=64, kernel_size=3, padding='same',
                            input_shape=128,
                            nb_dense_layers=1, nb_channels_dense=64, pooling='maxP', pool_size=2, init_mode='uniform', num_classes=2):
    model = Sequential()
    for i in range(nb_conv_layers):
        model.add(Convolution2D(nb_channels_conv, (kernel_size, kernel_size), kernel_initializer=init_mode, padding=padding,input_shape=input_shape))
        model.add(Activation('relu'))
        if pooling == 'maxP':
            model.add(MaxPooling2D(pool_size=(pool_size, pool_size)))
        else:
            model.add(AveragePooling2D(pool_size=(pool_size, pool_size)))
    for i in range(nb_dense_layers):
        model.add(Flatten())
        model.add(Dense(nb_channels_dense))
        model.add(Activation('relu'))
        model.add(Dropout(dropout_rate))
    model.add(Dense(num_classes))
    model.add(Activation("softmax"))

    # # Compiling the model

    model.compile(
        loss='binary_crossentropy',
        optimizer='Adamax',
        metrics=['accuracy'])
    return model
def define_model_grid(optimizer, loss, metricsAcc, input_shape, num_classes):
    model = Sequential([
        Convolution2D(32, 3, 3, padding='same', activation='relu', input_shape=input_shape),
        Convolution2D(32, 3, 3, activation='relu'),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.5),

        Convolution2D(64, 3, 3, activation='relu'),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.5),

        Flatten(),
        # Dense(64, activation='relu'),
        Dense(64, activation='relu'),
        Dropout(0.5),

        Dense(num_classes, activation='softmax')
    ])

    # # Compiling the model

    model.compile(
        loss=loss,
        optimizer=optimizer,
        metrics=[metricsAcc])
    return model
