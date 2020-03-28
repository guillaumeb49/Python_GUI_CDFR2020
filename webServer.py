from flask import Flask, render_template, Response
from flask_socketio import SocketIO, emit
import datetime

import sys  
sys.path.append("/home/pi/CDFR2020/RobotManager/")  

from Vision import VisionCamera

app = Flask(__name__)
socketio = SocketIO(app)

#Start vision

@app.route("/")
def index():
   now = datetime.datetime.now()
   timeString = now.strftime("%Y-%m-%d %H:%M")
   templateData = {
      'title' : 'HELLO!',
      'time': timeString
      }
   return render_template('index.html', **templateData)

@app.route('/map/')
def map():
    return render_template('map.html')

@app.route('/tests/')
def tests():
    return render_template('tests.html')

def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route("/video_feed")
def video_feed():
	# return the response generated along with the specific media
	# type (mime type)
   return Response(gen(VisionCamera()),mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
   socketio.run(app, host='0.0.0.0',port=80, debug=True)