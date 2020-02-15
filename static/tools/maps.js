/**
 * 
 * @brief Manage the Canvas functions
 * 
 * @author Guillaume B.
 */



    // Padding
    var p_width = 38.5;
    var p_height = 39.3;

/**
 * Function to draw the background of the map
 */
function DrawMap()
{
    var canvas = document.getElementById("canvas_layer1_index");
    var ctx = canvas.getContext("2d");
    



canvas.width = 1002+p_width;
    canvas.height = 668+p_height;


    var background = new Image();
    background.src = "static/img/TableCDFR2020.png";

    background.onload = function(){ctx.drawImage(background,p_width,p_height)};
}


function drawBoard(){

    // Box width
var bw = 1002+p_width;
// Box height
var bh = 668+p_height;


var canvas = document.getElementById("canvas_layer3_index");
var context = canvas.getContext("2d");
canvas.width = bw;
    canvas.height = bh;
    for (var x = 0; x <= 26; x += 1) {
        context.moveTo(x*p_width+p_width, p_width);
        context.lineTo(x*p_width+p_width, bh + p_width);
        
    }

    for (var x = 0; x <= 17; x += 1) {
        context.moveTo(p_height, x*p_height+p_height);
        context.lineTo(bw + p_height,x*p_height+p_height);
    }
    context.strokeStyle = "black";


for(var i=0;i < 26; i++)
{
    context.fillText(String.fromCharCode('A'.charCodeAt(0) + i), p_width*1.5+p_width*i, 30); 
}

for(var i=0;i < 17; i++)
{
    context.fillText(1+i, 20, p_height*1.5+i*p_height); 
}

    context.stroke();
}

var g_offset_x = p_width;
var g_offset_y = p_height;

var bouee_green_color = '#006f3d';
var bouee_red_color = '#bb1e10';

function DrawInitialItems()
{
    var canvas = document.getElementById("canvas_layer2_index");
    var ctx = canvas.getContext("2d");
    canvas.width = 1002+p_width;;
    canvas.height = 668+p_height;
    // draw the colored region
    ctx.beginPath();
    ctx.arc(ConvertX(670), ConvertY(100), 18/2.0, 0, 2*Math.PI);
    ctx.fillStyle = bouee_red_color;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ConvertX(1005), ConvertY(400), 18/2.0, 0, 2*Math.PI);
    ctx.fillStyle = bouee_green_color;
    ctx.fill();
        

    ctx.beginPath();
    ctx.arc(ConvertX(1100), ConvertY(800), 18/2.0, 0, 2*Math.PI);
    ctx.fillStyle = bouee_red_color;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ConvertX(1730), ConvertY(1200), 18/2.0, 0, 2*Math.PI);
    ctx.fillStyle = bouee_red_color;
    ctx.fill();


    // draw the stroke
    ctx.lineWidth = 0;
    ctx.strokeStyle = '#FF0000';
    ctx.stroke();
}

function ConvertX(x)
{
    return (g_offset_x + x*1002/3000);
}

function ConvertY(y)
{
    return (g_offset_y + y*668/2000);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    var x = ((evt.clientX - rect.left) -g_offset_x)*3000/(1002+g_offset_x-34);
    var y = ((evt.clientY - rect.top) - g_offset_y)*2000/(668+g_offset_y-34); 
    return {x,y};
  }

var canvas_main = document.getElementById("canvas_layer2_index");
var context = canvas_main.getContext('2d');

canvas_main.addEventListener('mousemove', function(evt) {
    
    var mousePos = getMousePos(canvas_main, evt);
    
    $( "#x_on_map_index" ).text(Math.round(mousePos.x))
    $( "#y_on_map_index" ).text(Math.round(mousePos.y))
    
  }, false);

