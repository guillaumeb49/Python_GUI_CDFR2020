from flask import Flask, render_template
import datetime
app = Flask(__name__)
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

if __name__ == "__main__":
   app.run(host='localhost', port=80, debug=True)