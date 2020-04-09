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
$( document ).ready(function() {
  checkSocketUI();
});

// Every 250ms ask current status of Robot
window.setInterval(function(){
  var distances_VL53L1X = robot.getDistances();

  $("#distance_cm_sensor1").text(distances_VL53L1X[0]/10.0);
  $("#distance_cm_sensor2").text(distances_VL53L1X[1]/10.0);
  $("#distance_cm_sensor3").text(distances_VL53L1X[2]/10.0);
  $("#distance_cm_sensor4").text(distances_VL53L1X[3]/10.0);

}, 250);

$("#robot_up").on("mousedown", function(){
  robot.MoveFoward();
}).on('mouseup mouseleave', function(){
  robot.MoveStop();
});

$("#robot_down").on("mousedown", function(){
  robot.MoveBackward();
}).on('mouseup mouseleave', function(){
  robot.MoveStop();
});

$("#robot_left").on("mousedown", function(){
  robot.MoveLeft();
}).on('mouseup mouseleave', function(){
  robot.MoveStop();
});

$("#robot_right").on("mousedown", function(){
  robot.MoveRight();
}).on('mouseup mouseleave', function(){
  robot.MoveStop();
});