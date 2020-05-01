/**
 * 
 * @brief Javascript user Interface functions
 * 
 * @author Guillaume B.
 */

// Interaction with the menu (base.html)
$("#menu_debug").on("click", function(){

  // Display the debug modal window
  $('#modal_debug_menu').modal('show');

});


// Initialize items at start-up
/*$( document ).ready(function() {
  checkSocketUI();
});*/

// Every 250ms update GUI based on RobotUI
window.setInterval(function(){
  var distances_VL53L1X = robot.getDistances();
  var position = robot.getPosition(); 

  $("#test_pos_x").text(position.x);
  $("#test_pos_y").text(position.y);
  $("#test_pos_theta").text(position.theta);

  $("#distance_cm_sensor1").text(distances_VL53L1X[0]/10.0);
  $("#distance_cm_sensor2").text(distances_VL53L1X[1]/10.0);
  $("#distance_cm_sensor3").text(distances_VL53L1X[2]/10.0);
  $("#distance_cm_sensor4").text(distances_VL53L1X[3]/10.0);


  var leds = [0,0,0,0,0,0,0,0];
  leds = robot.getLeds();
  if(leds[3] == 1)
  {
    $("#LED_1").addClass("red").removeClass("outline");
  }
  else
  {
    $("#LED_1").removeClass("red").addClass("outline");
  }

  if(leds[0] == 1)
  {
    $("#LED_2").addClass("blue").removeClass("outline");
  }
  else
  {
    $("#LED_2").removeClass("blue").addClass("outline");
  }
  if(leds[1] == 1)
  {
    $("#LED_3").addClass("green").removeClass("outline");
  }
  else
  {
    $("#LED_3").removeClass("green").addClass("outline");
  }


}, 500);


$("#robot_up").on("mousedown ", function(){
  socket.emit( 'my event', {cmd: 'MoveFoward'} );
}).on('mouseup mouseleave', function(){
  socket.emit( 'my event', {cmd: 'MoveStop'} );
});

$("#robot_up").on("mousedown ", function(){
  socket.emit( 'my event', {cmd: 'MoveFoward'} );
}).on('mouseup mouseleave', function(){
  socket.emit( 'my event', {cmd: 'MoveStop'} );
});

$("#robot_down").on("mousedown", function(){
  socket.emit( 'my event', {cmd: 'MoveBackward'} );
}).on('mouseup mouseleave', function(){
  socket.emit( 'my event', {cmd: 'MoveStop'} );
});

$("#robot_left").on("mousedown", function(){
  socket.emit( 'my event', {cmd: 'MoveLeft'} );
}).on('mouseup mouseleave', function(){
  socket.emit( 'my event', {cmd: 'MoveStop'} );
});

$("#robot_right").on("mousedown", function(){
  socket.emit( 'my event', {cmd: 'MoveRight'} );
}).on('mouseup mouseleave', function(){
  socket.emit( 'my event', {cmd: 'MoveStop'} );
});