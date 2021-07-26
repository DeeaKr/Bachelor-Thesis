import datetime
import random

from keras.layers.pooling import MaxPool2D
from tensorflow.python.keras.applications.inception_v3 import InceptionV3
from tensorflow.python.keras.callbacks import EarlyStopping, ModelCheckpoint
from tensorflow.python.keras.layers import Conv2D
from tensorflow.python.keras.models import Model

from Properties import *
from Models import *
import os, cv2
import numpy as np
import matplotlib.pyplot as plt
#
from sklearn.utils import shuffle
from sklearn.model_selection import train_test_split, ParameterGrid
#
from keras import backend as K, regularizers
from imblearn.over_sampling import SMOTE
# K.set_image_dim_ordering('th')
#
from keras.utils import np_utils
from tensorflow.keras import layers
from tensorflow.keras import Sequential
# from keras.models import Sequential
from keras.layers.core import Dense, Dropout, Activation, Flatten
from keras.layers.convolutional import Convolution2D, MaxPooling2D
from sklearn.metrics import classification_report, confusion_matrix
import itertools
import torch.nn as nn
import torch.nn.functional as F

from keras.models import model_from_json
from keras.models import load_model
import Augmentor
from keras.preprocessing.image import ImageDataGenerator, array_to_img, img_to_array, load_img
# was adam before not Nadam
from tensorflow.keras.optimizers import SGD, RMSprop, Nadam


def downloadFromInsta(accountName):
    L = Instaloader(download_videos=False, download_video_thumbnails=False, download_comments=False,
                    download_geotags=False, save_metadata=False, compress_json=False, post_metadata_txt_pattern=None)
    L.login("licenta_insta3", "")
    # Obtain profile
    profile = Profile.from_username(L.context, accountName)

    posts_sorted_by_date = sorted(profile.get_posts(), key=lambda post: post.date, reverse=True)
    posts_sorted_by_date_in_half = []
    for i in range(int(len(posts_sorted_by_date) / 2)):
        posts_sorted_by_date_in_half.append(posts_sorted_by_date[i])

    # Get all posts and sort them by their number of likes
    posts_sorted_by_likes = sorted(posts_sorted_by_date_in_half, key=lambda post: post.likes, reverse=False)

    for i in range(len(posts_sorted_by_likes)):
        if i < len(posts_sorted_by_likes) / 3:

            L.download_post(posts_sorted_by_likes[i], "1")
        elif len(posts_sorted_by_likes) / 3 <= i and i < len(posts_sorted_by_likes) * 2 / 3:

            L.download_post(posts_sorted_by_likes[i], "2")
        else:

            L.download_post(posts_sorted_by_likes[i], "3")


# inital model
# model = Sequential([
#     Convolution2D(32, 3, 3, padding='same', activation='relu', input_shape=input_shape),
#     Convolution2D(32, 3, 3, activation='relu'),
#     MaxPooling2D(pool_size=(2, 2)),
#     Dropout(0.5),
#
#     Convolution2D(64, 3, 3, activation='relu'),
#     MaxPooling2D(pool_size=(2, 2)),
#     Dropout(0.5),
#
#
#     Flatten(),
#
#     Dense(64, activation='relu'),
#     Dropout(0.5),
#
#     Dense(num_classes, activation='softmax')
# ])
# {'dropout_rate': 0.7, 'epochs': 50, 'init_mode': 'uniform', 'kernel_size': 3, 'nb_channels_conv': 64, 'nb_channels_dense': 128, 'nb_conv_layers': 4, 'nb_dense_layers': 1, 'padding': 'same', 'pool_size': 2, 'pooling': 'maxP'}


# final model arhitecture, training and testing
def functionForBinary():
    path = os.getcwd()
    # path_to_dataset=path+'\\db'
    path_to_dataset = path + '\\db2'
    data_dir_list = os.listdir(path_to_dataset)

    image_rows = 128
    image_cols = 128
    num_channel = 1
    num_epoch = 50

    # Define number of classes
    num_classes = 2

    labels_name = {'bad': 0, 'good': 1}

    list_image_data = []
    labels_list = []
    for folder in data_dir_list:
        list_image = os.listdir(path_to_dataset + '\\' + folder)
        print('Loading the images of folder: ' + '{}\n'.format(folder))
        label = labels_name[folder]
        for image in list_image:
            try:
                input_image = cv2.imread(path_to_dataset + '\\' + folder + '\\' + image)
                input_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)
                input_image_resize = cv2.resize(input_image, (128, 128))
                list_image_data.append(input_image_resize)
                labels_list.append(label)
            except:
                pass

    image_data = np.array(list_image_data)
    image_data = image_data.astype('float32')
    image_data /= 255

    print(image_data.shape)

    labels = np.array(labels_list)

    # print the count of number of samples for different classes
    print(np.unique(labels, return_counts=True))

    if num_channel == 1:
        if K.image_data_format() == 'th':
            image_data = np.expand_dims(image_data, axis=1)  # 1 before
            print(image_data.shape)
        else:
            image_data = np.expand_dims(image_data, axis=3)  # it was 3 before
            print(image_data.shape)

    else:
        if K.image_data_format() == 'th':
            image_data = np.rollaxis(image_data, 2, 1)  # it was 3 before
            print(image_data.shape)

    # Convert class labels to on-hot encoding
    Y = np_utils.to_categorical(labels, num_classes)

    # Shuffle the dataset
    x, y = shuffle(image_data, Y, random_state=2)

    # Split the dataset
    X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=2)
    print("X_train shape = {}".format(X_train.shape))
    print("X_test shape = {}".format(X_test.shape))

    x_tr, y_tr = shuffle(X_train, y_train, random_state=2)

    X_train1, X_validation, y_train1, y_validation = train_test_split(x_tr, y_tr, test_size=0.2, random_state=2)

    # # Initializing the input shape
    input_shape = image_data[0].shape

    nb_conv_layers = 4
    nb_channels_conv = 64
    kernel_size = 3
    init_mode = 'uniform'
    pooling = 'maxP'
    pool_size = 2
    nb_dense_layers = 1
    nb_channels_dense = 128
    dropout_rate = 0.7
    model = Sequential()
    for i in range(nb_conv_layers):
        model.add(
            Convolution2D(nb_channels_conv, (kernel_size, kernel_size), kernel_initializer=init_mode, padding='same',
                          input_shape=input_shape))
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
    model.add(Activation("sigmoid"))

    # # Compiling the model

    model.compile(
        loss='binary_crossentropy',
        optimizer='Adamax',
        metrics=['accuracy'])

    earlyStop = EarlyStopping(monitor='val_loss', mode='min', verbose=1, patience=15)

    modelCheck = ModelCheckpoint('best_modelBinaryNewBest2.h5', monitor='val_accuracy', mode='max', verbose=1,
                                 save_best_only=True)
    model.summary()

    hist = model.fit(X_train1, y_train1,
                     batch_size=8,
                     epochs=num_epoch,
                     verbose=1,
                     validation_data=(X_test, y_test),
                     callbacks=[earlyStop, modelCheck]
                     )

    saved_model = load_model('best_modelBinaryNewBest2.h5')

    score = saved_model.evaluate(X_validation, y_validation, verbose=0)
    print('Test Loss:', score[0])
    print('Test Accuracy:', score[1])

    plt.subplot(1, 2, 1)
    plt.title('Training and test accuracy')
    plt.plot(hist.epoch, hist.history['accuracy'], label='Training accuracy')
    plt.plot(hist.epoch, hist.history['val_accuracy'], label='Test accuracy')
    plt.legend()

    plt.subplot(1, 2, 2)
    plt.title('Training and test loss')
    plt.plot(hist.epoch, hist.history['loss'], label='Training loss')
    plt.plot(hist.epoch, hist.history['val_loss'], label='Test loss')
    plt.legend()

    plt.show()
    # # confusion matrix
    # # Y_pred = model.predict(X_test)

    Y_pred = model.predict(X_validation)
    print(Y_pred)
    y_pred = np.argmax(Y_pred, axis=1)
    print(y_pred)
    target_names = ['Class 0 (bad)', 'Class 1 (good)']

    print(classification_report(np.argmax(y_validation, axis=1), y_pred, target_names=target_names))

    print(confusion_matrix(np.argmax(y_validation, axis=1), y_pred))
    cnf_matrix = (confusion_matrix(np.argmax(y_validation, axis=1), y_pred))

    np.set_printoptions(precision=2)
    #
    plt.figure()

    # Plot non-normalized confusion matrix
    plot_confusion_matrix(cnf_matrix, classes=target_names,
                          title='Confusion matrix')
    plt.figure()
    # Plot normalized confusion matrix
    plot_confusion_matrix(cnf_matrix, classes=target_names, normalize=True,
                          title='Normalized confusion matrix')
    plt.figure()
    plt.show()


'''implementation of random grid search over various parameters'''


def search_grid_model(X_train, y_train, num_epoch, X_test, y_test, input_shape, num_classes, X_validation,
                      y_validation):
    param_grid = dict(epochs=[50], dropout_rate=[0.7], nb_conv_layers=[4], nb_channels_conv=[64],
                      kernel_size=[3],
                      padding=['same'], nb_dense_layers=[1], nb_channels_dense=[64, 128],
                      pooling=['maxP'], pool_size=[2],
                      init_mode=['normal'])
    param_gridAllParameters = dict(epochs=[50], dropout_rate=[0.3, 0.5, 0.6, 0.7], nb_conv_layers=[1, 2, 3, 4],
                                   nb_channels_conv=[16, 32, 64],
                                   kernel_size=[2, 3],
                                   padding=['same'], nb_dense_layers=[1, 2], nb_channels_dense=[32, 64, 128],
                                   pooling=['maxP', 'avgP'], pool_size=[2, 3],
                                   init_mode=['uniform', 'normal', 'he_normal', 'he_uniform'])

    for parameters in ParameterGrid(param_grid):
        if random.random() > 0.3:
            print('skipped' + str(parameters))
            # skip some configs so we have a random grid search
            continue

        modelCheck = ModelCheckpoint(
            'best_modelBinaryParamGridSearch.h5',
            monitor='val_accuracy', verbose=1,
            save_best_only=True, mode='max')
        earlyStop = EarlyStopping(monitor='val_loss', mode='min', verbose=2, patience=10)
        print(parameters)
        model = define_model_grid_model(parameters['dropout_rate'], parameters['nb_conv_layers'],
                                        parameters['nb_channels_conv'],
                                        parameters['kernel_size'], parameters['padding'], input_shape,
                                        parameters['nb_dense_layers'], parameters['nb_channels_dense'],
                                        parameters['pooling'], parameters['pool_size'],
                                        parameters['init_mode'], num_classes)
        hist = model.fit(X_train, y_train,
                         batch_size=8,
                         epochs=num_epoch,
                         verbose=2,
                         validation_data=(X_test, y_test),
                         callbacks=[earlyStop, modelCheck]
                         )
        saved_model = load_model('best_modelBinaryParamGridSearch.h5')
        score = saved_model.evaluate(X_validation, y_validation, verbose=0)
        print('Test Loss:', score[0])
        print('Test Accuracy:', score[1])
        Y_pred = saved_model.predict(X_test)
        print(Y_pred)
        y_pred = np.argmax(Y_pred, axis=1)
        print(y_pred)
        target_names = ['Class 0 (bad)', 'Class 1 (good)'
                        ]
        print(classification_report(np.argmax(y_test, axis=1), y_pred, target_names=target_names))

        print(confusion_matrix(np.argmax(y_test, axis=1), y_pred))
        cnf_matrix = (confusion_matrix(np.argmax(y_test, axis=1), y_pred))

        np.set_printoptions(precision=2)


'''implementation of grid search over various batch sizes'''


def search_batch_size(X_train, y_train, num_epoch, X_test, y_test, input_shape, num_classes):
    param_grid = dict(epochs=[50], optimizer=['Adamax'],
                      loss=['binary_crossentropy'], metricsAc=['accuracy'], batch_size=[8, 16, 32, 64, 128, 256])
    for parameters in ParameterGrid(param_grid):
        modelCheck = ModelCheckpoint('best_modelBinary4.h5', monitor='val_accuracy', mode='max', verbose=1,
                                     save_best_only=True)
        print(parameters)
        print("---------------------------------------------------------------------------------------------")
        print(parameters['batch_size'])
        model = define_model_grid(parameters['optimizer'], parameters['loss'], parameters['metricsAc'], input_shape,
                                  num_classes)
        earlyStop = EarlyStopping(monitor='val_loss', mode='min', verbose=1, patience=15)

        hist = model.fit(X_train, y_train,
                         batch_size=parameters['batch_size'],
                         epochs=num_epoch,
                         verbose=1,
                         validation_data=(X_test, y_test),
                         callbacks=[earlyStop, modelCheck]
                         )
        saved_model = load_model('best_modelBinary4.h5')

        score = saved_model.evaluate(X_test, y_test, verbose=0)
        print('Test Loss:', score[0])
        print('Test Accuracy:', score[1])
        Y_pred = saved_model.predict(X_test)
        print(Y_pred)
        y_pred = np.argmax(Y_pred, axis=1)
        print(y_pred)
        target_names = ['Class 0 (bad)', 'Class 1 (good)'
                        ]
        print(classification_report(np.argmax(y_test, axis=1), y_pred, target_names=target_names))

        print(confusion_matrix(np.argmax(y_test, axis=1), y_pred))
        cnf_matrix = (confusion_matrix(np.argmax(y_test, axis=1), y_pred))

        np.set_printoptions(precision=2)

        plt.figure()

        # Plot non-normalized confusion matrix
        plot_confusion_matrix(cnf_matrix, classes=target_names,
                              title='Confusion matrix')
        plt.figure()
        # # Plot normalized confusion matrix
        # plot_confusion_matrix(cnf_matrix, classes=target_names, normalize=True,
        #                       title='Normalized confusion matrix')
        # plt.figure()
        plt.show()


'''implementation of grid search over various optimizers and losses'''


def search_grid_Optimizer_loss(X_train, y_train, num_epoch, X_test, y_test, input_shape, num_classes):
    param_grid = dict(epochs=[20], optimizer=['SGD', 'RMSprop', 'Adagrad', 'Adadelta', 'Adam', 'Adamax', 'Nadam'],
                      loss=['binary_crossentropy', 'categorical_crossentropy'], metricsAc=['accuracy'])
    for parameters in ParameterGrid(param_grid):
        modelCheck = ModelCheckpoint('best_modelBinary3.h5', monitor='val_accuracy', mode='max', verbose=1,
                                     save_best_only=True)
        print(parameters)
        model = define_model_grid(parameters['optimizer'], parameters['loss'], parameters['metricsAc'], input_shape,
                                  num_classes)
        earlyStop = EarlyStopping(monitor='val_loss', mode='min', verbose=1, patience=15)

        hist = model.fit(X_train, y_train,
                         batch_size=16,
                         epochs=num_epoch,
                         verbose=1,
                         validation_data=(X_test, y_test),
                         callbacks=[earlyStop, modelCheck]
                         )
        # model.summary()
        saved_model = load_model('best_modelBinary3.h5')

        score = saved_model.evaluate(X_test, y_test, verbose=0)
        print('Test Loss:', score[0])
        print('Test Accuracy:', score[1])
        Y_pred = saved_model.predict(X_test)
        print(Y_pred)
        y_pred = np.argmax(Y_pred, axis=1)
        print(y_pred)
        target_names = ['Class 0 (bad)', 'Class 1 (good)'
                        ]
        print(classification_report(np.argmax(y_test, axis=1), y_pred, target_names=target_names))

        print(confusion_matrix(np.argmax(y_test, axis=1), y_pred))
        cnf_matrix = (confusion_matrix(np.argmax(y_test, axis=1), y_pred))

        np.set_printoptions(precision=2)

        plt.figure()

        # Plot non-normalized confusion matrix
        plot_confusion_matrix(cnf_matrix, classes=target_names,
                              title='Confusion matrix')
        plt.figure()
        # Plot normalized confusion matrix
        # plot_confusion_matrix(cnf_matrix, classes=target_names, normalize=True,
        #                       title='Normalized confusion matrix')
        # plt.figure()
        plt.show()


def testPhoto(path):
    num_channel = 1
    list_image_data = []
    # saved_model = load_model('best_modelBinary1.h5')
    saved_model = load_model('best_modelBinaryNewBest2.h5')
    # from here
    input_image = cv2.imread(path)
    input_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)
    test_image_r = cv2.resize(input_image, (128, 128))
    list_image_data.append(test_image_r)
    image_data = np.array(list_image_data)
    image_data = image_data.astype('float32')
    image_data /= 255
    if num_channel == 1:
        if K.image_data_format() == 'th':
            image_data = np.expand_dims(image_data, axis=1)
            # print(image_data.shape)
        else:
            image_data = np.expand_dims(image_data, axis=3)
            # print(image_data.shape)

    else:
        if K.image_data_format() == 'th':
            image_data = np.rollaxis(image_data, 2, 1)
            # print(image_data.shape)

    # print(image_data.shape)

    test_image = image_data[0:1]
    # print(test_image.shape)

    predicted_proc = saved_model.predict(test_image)
    predicted_class = saved_model.predict_classes(test_image)
    # print(y_test[0:1])

    return predicted_proc[0][1]


def saveModel(model):
    model_json = model.to_json()
    with open("model.json", "w") as json_file:
        json_file.write(model_json)

    # serialize weights to HDF5
    model.save_weights("model.h5")
    print("Saved model to disk")


def plot_confusion_matrix(cm, classes,
                          normalize=False,
                          title='Confusion matrix',
                          cmap=plt.cm.Blues):
    """
    This function prints and plots the confusion matrix.
    Normalization can be applied by setting `normalize=True`.
    """
    plt.imshow(cm, interpolation='nearest', cmap=cmap)
    plt.title(title)
    plt.colorbar()
    tick_marks = np.arange(len(classes))
    plt.xticks(tick_marks, classes, rotation=45)
    plt.yticks(tick_marks, classes)

    if normalize:
        cm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
        print("Normalized confusion matrix")
    else:
        print('Confusion matrix, without normalization')

    print(cm)

    thresh = cm.max() / 2.
    for i, j in itertools.product(range(cm.shape[0]), range(cm.shape[1])):
        plt.text(j, i, cm[i, j],
                 horizontalalignment="center",
                 color="white" if cm[i, j] > thresh else "black")

    plt.tight_layout()
    plt.ylabel('True label')
    plt.xlabel('Predicted label')


def bestPhotosDataset():
    path = os.getcwd()
    path_to_dataset = path + '\\db2'
    data_dir_list = os.listdir(path_to_dataset)

    list_image_data = []
    labels_list = []
    lst = []
    #
    list_image = os.listdir(path_to_dataset + '\\' + "good")
    i = 0
    #
    for image in list_image:
        try:
            #
            #
            result = testPhoto(path_to_dataset + '\\good\\' + image)
            dictt = {"result": result, "path": path_to_dataset + '\\' + 'good' + '\\' + image}
            lst.append(dictt)
        #
        #
        #
        #
        except:
            pass
    #
    #
    print(sorted(lst, key=lambda i: i['result']))


if __name__ == '__main__':
    functionForBinary()
