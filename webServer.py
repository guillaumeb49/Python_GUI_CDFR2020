import eventlet
eventlet.monkey_patch()


from flask import Flask, render_template, Response
from flask_socketio import SocketIO, emit
from flask import current_app 
import datetime
from queue import Queue
import threading
import socket
from time import sleep
import json
import pickle
from flask import g


raspberry  = 1
try:
   import sys  
   sys.path.append("/home/pi/CDFR2020/RobotManager/")  
   from Vision import VisionCamera
except ImportError as e:
    raspberry = 0
    pass  # module doesn't exist, deal with it.

app = Flask(__name__)


class RobotUI:
   id                      = 0
   time_update             = 0
   current_position        = {'x':0,'y':0,'theta':0};
   vecteurDeplacement      = {'x':0,'y':0,'theta':0};
   next_position           = {'x':0,'y':0,'theta':0};
   asservissement_status   = 0;
   ready_to_start          = 0;
   distances               = [0,0,0,0];
   tirette_status          = 0;
   leds                    = [0,0,0,0,0,0,0,0];
   servos_position         = [0,0,0,0,0,0];  

   _sentinel               = object() 
   q                       = 0
   stop_thread_comm        = 0
   s = None
   running = False

   def GetDistances(self):
      return self.distances

   def DecodeFrame(self,frame):   
      # If received frame is about getting the latests info on physical robot status
      if(frame['cmd'] == "UpdateRobotUI"):
         self.current_position = frame['answer']['current_position']
         self.vecteurDeplacement = frame['answer']['vecteurDeplacement'] 
         self.next_position = frame['answer']['next_position'] 
         self.asservissement_status = frame['answer']['asservissement_status'] 
         self.ready_to_start = frame['answer']['ready_to_start'] 
         
         self.distances = frame['answer']['distances'] 
         self.tirette_status = frame['answer']['tirette_status']
         self.leds = frame['answer']['leds'] 
         self.servos_position = frame['answer']['servos_position'] 
         

   def ConnectionToStrategy(self):  
      #Start TCP client
      TCP_IP = 'localhost'
      TCP_PORT = 50007
      
      self.q = Queue()
      self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

      while True:
         try:
            self.s.connect((TCP_IP, TCP_PORT))
            print("Connected")
            break;
         except socket.error as msg:
            print("Caught exception socket.error : %s" % msg)
            sleep(1000) #Wait 1sec before retry

      while ( self.stop_thread_comm != 1):
         #print("[WebServer] waiting for command to send")
         # Get a command from the FIFO (blocks while no command available)
         command =  self.q.get()
         
         # Check for termination 
         if command is self._sentinel: 
               self.stop_thread_comm = 1
               break   # We end the thread comm

         # Send the command
         self.s.sendall(pickle.dumps(command))
         #print("[WebServer] command sent")

         # Wait for the answer to be received
         answer = self.s.recv(1024)
         
         answer = pickle.loads(answer)

         # Decode the answer received from the Strategy
         answer = self.DecodeFrame(answer);    

   def UpdateRobotUI(self):
      while True:
         if((self.s) != None):
            command  =  { "type": "cmd", "cmd": "UpdateRobotUI" }
            self.q.put(command)
         #Wait for 0.5s
         sleep(0.5)
     
   def SendCommandToPhysicalRobot(self,command):
         if((self.s) != None):
            self.q.put(command)
            return 0
         else:
            return -1

   def run(self):
      if (self.running == False):
         self.running = True
         t0 = threading.Thread(target=self.ConnectionToStrategy)
         t0.start()
         t1 = threading.Thread(target=self.UpdateRobotUI)
         t1.start()


def create_app():
    app = Flask(__name__)
    return app

app = create_app()
socketio = SocketIO(app)

app.app_context().push()

thread = None

robot = None

@app.route("/")
def index():
   now = datetime.datetime.now()
   timeString = now.strftime("%Y-%m-%d %H:%M")
   templateData = {
      'title' : 'HELLO!',
      'time': timeString
      }
   global thread
   if thread is None:
      global robot
      robot = RobotUI()
      robot.run() 
      thread = 1
      print("Robot after initialization : "+str(robot))


   return render_template('index.html', **templateData)

def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')

@socketio.on('connect')
def test_connect():
   global robotui
   # need visibility of the global thread object
   #global thread
   #if thread is None:
   #   thread = socketio.start_background_task(target=ConnectionToStrategy)
   #   thread = socketio.start_background_task(target=UpdateRobotUI)
   print('Client connected')
   

@socketio.on('my event')
def handle_my_custom_event(msg, methods=['GET', 'POST']):
   #print('received my event: ' + str(msg))
   #print('Robot myevent: '+str(robot))
   #print("distance :"+str(robot.distances))
      #msg = json.loads(msg)
   if(msg['cmd'] == "getInfo"):
      #robotui.emitUpdateGUI()
      socketio.emit('my response', {"cmd":"getInfo","data":0, "current_position":robot.current_position, "leds":robot.leds, "distances":robot.distances})
   if(msg['cmd'] == "MoveFoward"):
      robot.SendCommandToPhysicalRobot(msg)
   if(msg['cmd'] == "MoveStop"):
      robot.SendCommandToPhysicalRobot(msg)
   if(msg['cmd'] == "MoveBackward"):
      robot.SendCommandToPhysicalRobot(msg)
   if(msg['cmd'] == "MoveLeft"):
      robot.SendCommandToPhysicalRobot(msg)
   if(msg['cmd'] == "MoveRight"):
      robot.SendCommandToPhysicalRobot(msg)

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

@app.route("/video_feed/")
def video_feed():
	# return the response generated along with the specific media
	# type (mime type)
   if raspberry == 1:
      return Response(gen(VisionCamera()),mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == "__main__":
   
   #socketio.start_background_task(ConnectionToStrategy)
   #socketio.start_background_task(UpdateRobotUI)    
  
   

   socketio.run(app, host='0.0.0.0',port=80, debug=True)