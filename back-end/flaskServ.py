import json
import os
import logging
import flask
import requests
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
from main import testPhoto
from PIL import Image
import pyrebase

logging.basicConfig(level=logging.INFO, filename='out.log')
UPLOAD_FOLDER = '/uploads'
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)
known = {}
nr = 0
filenames = {}
firebaseConfig = {"apiKey": "AIzaSyDcl4rZg82keOGQ2p5UgFSYuEVW9hD7BoA",
                  "authDomain": "aestheticexpert-1fb0c.firebaseapp.com",
                  "databaseURL": "https://aestheticexpert-1fb0c-default-rtdb.firebaseio.com",
                  "projectId": "aestheticexpert-1fb0c",
                  "storageBucket": "aestheticexpert-1fb0c.appspot.com",
                  "messagingSenderId": "731682357887",
                  "appId": "1:731682357887:web:d3e4b37beaa02d0daab54a",
                  "serviceAccount": "aestheticexpert-1fb0c-firebase-adminsdk-pnz4e-86a94af0f6.json"
                  }
firebase = pyrebase.initialize_app(firebaseConfig)
db = firebase.database()
auth = firebase.auth()
storage = firebase.storage()


@app.route('/')
def hello():
    return "Hi"


@app.route('/one')
def hello_one():
    return "Hi you"


@app.route('/two', methods=['POST'])
def hello_two():
    data = dict(request.form)
    print(data.get("mykey"))
    print("hi you two")
    return "Hi you"


@app.route('/upload', methods=['POST'])
def upload_file():
    print(request.files)
    # check if the post request has the file part
    if 'image' not in request.files:
        print('no file in request')
        return ""
    file = request.files['image']
    if file.filename == '':
        print('no selected image')
        return ""
    if file:


        email = request.form.get('email')
        os.makedirs(os.path.join(app.instance_path, 'htmlfi'), exist_ok=True)

        file.save(os.path.join(app.instance_path, 'htmlfi', secure_filename(file.filename)))

        result = testPhoto(os.path.join(app.instance_path, 'htmlfi', secure_filename(file.filename)))
        storage.child(email + "/" + secure_filename(file.filename)).put("instance/htmlfi/" + secure_filename(file.filename))
        os.remove("instance/htmlfi/" + secure_filename(file.filename))
        photo = storage.child(email + "/" + secure_filename(file.filename)).get_url(None)

        if(result < 0.0001):
            resultRounded = 0
        else:
            resultRounded=round(result,4)

        result2 = str(resultRounded)
        photoResult = {'email': email, 'photo': photo, 'result': result2}

        photoResults = db.child("photoResults").order_by_child("result").get()
        exists = False
        if photoResults is not None and photoResults.each() is not None:
            for photoResulti in photoResults.each():
                if photoResulti.val()['photo'] == photo and photoResulti.val()['email'] == email:
                    exists = True
            if exists == False:
                db.child("photoResults").push(photoResult)
        else:
            db.child("photoResults").push(photoResult)
        return result2

    return "error"

# storage.child("user").put()

@app.route('/top10', methods=['GET'])
def top_10_photos():
    photoResults = db.child("photoResults").order_by_child("result").limit_to_last(10).get()
    dict = {}
    dict2 = {}
    listUrl = []
    listEmail = []
    listResults = []
    for photoResult in photoResults.each():
        listUrl.append(photoResult.val()['photo'])
        listEmail.append(photoResult.val()['email'])
        listResults.append(photoResult.val()['result'])

    dict["urls"] = listUrl
    dict["emails"] = listEmail
    dict["result"] = listResults

    return jsonify(dict)


def examples():
    paths = []
    for line in reversed(list(open("console\consoleFileExamplesBestFinalDataset.txt"))):
        # print(line.rstrip())
        paths.append(line.rstrip())
        break

    Dict = eval(paths[0])

    i = 0
    for s in range(len(Dict) - 1, 0, -1):
        # print(Dict[s]['path'][26:])
        storage.child("examplesNew2/" + Dict[s]['path'][26:]).put(
            Dict[s]['path'])

        photo = storage.child("examplesNew2/" + Dict[s]['path'][26:]).get_url(None)
        # print(photo)
        examples = {'result': Dict[s]['result'], 'photo': photo}
        db.child("examplesNew2").push(examples)

        if i > 50:
            break
        i += 1


@app.route('/examples', methods=['GET'])
def getExamples():
    exampleResults = db.child("examplesNew2").order_by_child("result").limit_to_last(30).get()
    dict = {}
    dict2 = {}
    listUrl = []
    listEmail = []
    listResults = []
    for exampleResult in exampleResults.each():
        listUrl.append(exampleResult.val()['photo'])

        listResults.append(exampleResult.val()['result'])

    dict["urls"] = listUrl
    dict["result"] = listResults

    return jsonify(dict)



@app.route('/signup', methods=['POST'])
def signup():
    logging.info("sign-up method")
    request_data = request.get_json()
    email = request_data['email']
    password = request_data['password']
    try:
        var = auth.create_user_with_email_and_password(email, password)
    except requests.HTTPError as e:
        error = e.args[1]
        er = json.loads(error)['error']['message']
        if er == "EMAIL_EXISTS":
            return "Email already exists", json.loads(error)['error']['code']
        else:
            return er, json.loads(error)['error']['code']

    auth.send_email_verification(var['idToken'])
    robot = request_data['robot']
    name = request_data['name']
    userRobot = {'email': email, 'robot': robot, 'name': name}
    db.child("usersRobots").push(userRobot)
    try:
        var = auth.sign_in_with_email_and_password(email, password)
    except requests.HTTPError as e:
        error = e.args[1]
        er = json.loads(error)['error']['message']
        if er == "EMAIL_NOT_FOUND":
            return "This email is not signed up yet", json.loads(error)['error']['code']
        elif er == "INVALID_PASSWORD":
            return "The password is not correct", json.loads(error)['error']['code']
        else:
            return er, json.loads(error)['error']['code']
    # auth.current_user['displayName']=name
    return "Successfully signed-up"


@app.route('/login', methods=['POST'])
def login():
    print("login")
    request_data = request.get_json()
    email = request_data['email']
    password = request_data['password']

    try:
        var = auth.sign_in_with_email_and_password(email, password)
    except requests.HTTPError as e:
        error = e.args[1]
        er = json.loads(error)['error']['message']
        if er == "EMAIL_NOT_FOUND":
            return "This email is not signed up yet", json.loads(error)['error']['code']
        elif er == "INVALID_PASSWORD":
            return "The password is not correct", json.loads(error)['error']['code']
        else:
            print(er)
            return er, json.loads(error)['error']['code']

    return "logged in"


def isUserVerified():
    email = request.args.get('email')

    pass


@app.route('/displayName/', methods=['GET'])
def getDisplayName():
    logging.info("display name: ")
    email = request.args.get('email')

    logging.info(email)
    userRobots = db.child("usersRobots").order_by_child("email").equal_to(email).get()
    if userRobots == {}:
        return "no name"
    for userRobot in userRobots.each():
        return userRobot.val()['name']


@app.route('/robot/', methods=['GET'])
def getRobot():
    logging.info("robot: ")
    email = request.args.get('email')

    logging.info(email)
    userRobots = db.child("usersRobots").order_by_child("email").equal_to(email).get()
    if len(userRobots.each())==0:
        return "no robot"
    for userRobot in userRobots.each():
        return userRobot.val()['robot']


if __name__ == "__main__":
    #examples()
    app.run(host='0.0.0.0', port=2021, debug=True)

