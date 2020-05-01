/**
 * @brief Manage the WebSocket interface which exchanges data between local WebServer and Qt
 * 
 * 
 * @author Guillaume B.
 */

 var socket = null;
 var robot = new Robot();

$(document).ready(function(){
    socket = io.connect('http://' + document.domain + ':' + location.port);
    
    socket.on( 'connect', function() {
        socket.emit( 'connected', {
          data: 'User Connected'
        } )
        
      } )

      // Every 500ms ask current status of Robot
    window.setInterval(function(){
        if(socket != null)
        {
            //if soketIO is active
        socket.emit( 'my event', {cmd: 'getInfo'} )
        
        }
    }, 250);

      socket.on( 'my response', function( msg ) {
        console.log( msg )
            // If response if answering a getInfo request
            if(msg.cmd == "getInfo")
            {
                // Update the robotUI
                robot.setInfo(msg.current_position, msg.vecteurDeplacement,msg.next_position,msg.asservissement_status,msg.ready_to_start,msg.distances,msg.tirette_status, msg.leds, msg.servos_position)
            }    
    
    })
    
});



var id_cmd = 0;

function debug(message) {
    var dt = new Date();
    var time = dt.getDate() +"/"+(dt.getMonth()+1)+"/"+dt.getFullYear()+" - " +dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

    $( "#debugTextArea" ).append("<p><i>"+time+"</i> → "+message+"</p>");
    
}

function sendMessage(cmd, param1,param2,param3) {
    
    var msg = {
        type: "cmd",
        cmd: cmd,
        param1: param1,
        param2: param2,
        param3: param3,
        id:   id_cmd,
        date: Date.now()
      };
    
    if ( websocket != null )
    {
        websocket.send( JSON.stringify(msg));
        id_cmd++;
    }
}

var wsUri = "ws://robot.local:1234";
var websocket = null;

function initWebSocket() {
    try {
        if (typeof MozWebSocket == 'function')
            WebSocket = MozWebSocket;
        if ( websocket && websocket.readyState == 1 )
            websocket.close();
        websocket = new WebSocket( wsUri );
        websocket.onopen = function (evt) {$(document).ready(function(){
    var socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
    socket.on('my response', function(msg) {
        $('#log').append('<p>Received: ' + msg.data + '</p>');
    });
    $('form#emit').submit(function(event) {
        socket.emit('my event', {data: $('#emit_data').val()});
        return false;
    });
    $('form#broadcast').submit(function(event) {
        socket.emit('my broadcast event', {data: $('#broadcast_data').val()});
        return false;
    });
});
            debug("CONNECTED");
        };
        websocket.onclose = function (evt) {
            debug("DISCONNECTED");
        };
        websocket.onmessage = function (evt) {
            console.log( "Message received :", evt.data );
            debug(evt.data);
            var data_received = JSON.parse(evt.data)
            if(data_received["cmd"] == "getInfo")
            {
                robot.setDistances(data_received["answer"]);
            }

            console.log(robot.getDistances());

            
        };
        websocket.onerror = function (evt) {
            debug('ERROR: ' + evt.data);
        };
    } catch (exception) {
        debug('ERROR: ' + exception);
    }
}

function stopWebSocket() {
    if (websocket)
        websocket.close();
}

function checkSocket() {
    if (websocket != null) {
        var stateStr;
        switch (websocket.readyState) {
            case 0: {
                stateStr = "CONNECTING";
                break;
            }
            case 1: {
                stateStr = "OPEN";
                break;
            }
            case 2: {
                stateStr = "CLOSING";
                break;
            }
            case 3: {
                stateStr = "CLOSED";
                break;
            }
            default: {
                stateStr = "UNKNOW";
                break;
            }
        }
        debug("WebSocket state = " + websocket.readyState + " ( " + stateStr + " )");
    } else {
        debug("WebSocket is null");
        stateStr = "NULL"
        initWebSocket();
        console.log("WebSocket is null we re-init it")
    }
    return stateStr;
}

