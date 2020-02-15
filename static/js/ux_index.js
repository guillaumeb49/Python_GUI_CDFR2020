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
  $("#index_homologation_selected").hide();
  $("#index_strategy1_selected").hide();
  $("#index_strategy2_selected").hide();
});

// On click selection of team color
$( "#index_btn_color_yellow" ).on( "click", function() {
    $("#index_btn_color_yellow").css('background-color','rgba(242, 198, 31,1)') ;
    $("#index_btn_color_blue").css('background-color','rgba(59, 131, 192,0.25)') ;
    
  });

  $( "#index_btn_color_blue" ).on( "click", function() {
    $("#index_btn_color_yellow").css('background-color','rgba(242, 198, 31,0.25)') ;
    $("#index_btn_color_blue").css('background-color','rgba(59, 131, 192,1)') ;
  });

// On Click Selection of Strategy
$( "#index_homologation_card" ).on( "click", function() {
  $("#index_homologation_selected").show();
  $("#index_strategy1_selected").hide();
  $("#index_strategy2_selected").hide();

  $( "#index_homologation_card" ).css('box-shadow', '12px 14px 5px -3px rgba(0,0,0,0.41)');
  $( "#index_strategy1_card" ).css('box-shadow', '0px 1px 3px 0px #D4D4D5, 0px 0px 0px 1px #D4D4D5');
  $( "#index_strategy2_card" ).css('box-shadow', '0px 1px 3px 0px #D4D4D5, 0px 0px 0px 1px #D4D4D5');
});

$( "#index_strategy1_card" ).on( "click", function() {
  $("#index_homologation_selected").hide();
  $("#index_strategy1_selected").show();
  $("#index_strategy2_selected").hide();

  $( "#index_homologation_card" ).css('box-shadow', '0px 1px 3px 0px #D4D4D5, 0px 0px 0px 1px #D4D4D5');
  $( "#index_strategy1_card" ).css('box-shadow', '12px 14px 5px -3px rgba(0,0,0,0.41)');
  $( "#index_strategy2_card" ).css('box-shadow', '0px 1px 3px 0px #D4D4D5, 0px 0px 0px 1px #D4D4D5');
});

$( "#index_strategy2_card" ).on( "click", function() {
  $("#index_homologation_selected").hide();
  $("#index_strategy1_selected").hide();
  $("#index_strategy2_selected").show();

  $( "#index_homologation_card" ).css('box-shadow', '0px 1px 3px 0px #D4D4D5, 0px 0px 0px 1px #D4D4D5');
  $( "#index_strategy1_card" ).css('box-shadow', '0px 1px 3px 0px #D4D4D5, 0px 0px 0px 1px #D4D4D5');
  $( "#index_strategy2_card" ).css('box-shadow', '12px 14px 5px -3px rgba(0,0,0,0.41)');
});

// Check the WebSocket Connection Status and update the UI accordingly
// try to connect if the connection is closed

async function checkSocketUI(){
  var socket_status = checkSocket();

  if(socket_status == "OPEN")
  {
    $("#connection_status_bubble").removeClass("red");
    $("#connection_status_bubble").addClass("green");
  }
  else if(socket_status == "CONNECTING")
  {

    $("#connection_status_bubble").removeClass("red");
    $("#connection_status_bubble").removeClass("green");
    $("#connection_status_bubble").addClass("orange");

    // Wait for 1000ms before rechecking
    await sleep(1000);
    if(socket_status == "OPEN")
    {
      // we are good to go!
      $("#connection_status_bubble").removeClass("red");
    $("#connection_status_bubble").addClass("green");
    }
    else
    {
      // very likely the server will never respond..
      $("#connection_status_bubble").removeClass("green");
      $("#connection_status_bubble").addClass("red");
    }

    $("#connection_status_bubble").removeClass("orange");

  }
  else if(socket_status == "CLOSED")
  {
    // try to open the connection
      // initialize the websockets
      initWebSocket();

      $("#connection_status_bubble").removeClass("red");
      $("#connection_status_bubble").removeClass("green");
      $("#connection_status_bubble").addClass("orange");
      // Wait for 1000ms before rechecking
      await sleep(1000);
      $("#connection_status_bubble").removeClass("orange");
      
      if(socket_status == "OPEN")
      {
        // if the WebSocket is up
        $("#connection_status_bubble").removeClass("red");
        $("#connection_status_bubble").addClass("green");
      }
      else
      {
        // The server is down
        $("#connection_status_bubble").removeClass("green");
        $("#connection_status_bubble").addClass("red");
      }
  }
  else
  {
    $("#connection_status_bubble").removeClass("green");
    $("#connection_status_bubble").addClass("red");
  }

}

// Click on Button Go to Initial Position Index
$( "#index_goToInitialPos" ).on( "click", function(){
  sendMessage("goToInit", 100,200,0.5);
});