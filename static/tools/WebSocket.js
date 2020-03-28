/**
 * @brief Manage the WebSocket interface which exchanges data between local WebServer and Qt
 * 
 * 
 * @author Guillaume B.
 */

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

var wsUri = "ws://raspberrypi.local:1234";
var websocket = null;

function initWebSocket() {
    try {
        if (typeof MozWebSocket == 'function')
            WebSocket = MozWebSocket;
        if ( websocket && websocket.readyState == 1 )
            websocket.close();
        websocket = new WebSocket( wsUri );
        websocket.onopen = function (evt) {
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
    }
    return stateStr;
}

