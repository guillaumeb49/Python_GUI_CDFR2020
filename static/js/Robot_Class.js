/**
 * 
 * @brief Javascript Robot Class
 * 
 * @author Guillaume B.
 */

class Robot{
  current_position        = {'x':0,'y':0,'theta':0};
  vecteurDeplacement      = {'x':0,'y':0,'theta':0};
  next_position           = {'x':0,'y':0,'theta':0};
  asservissement_status   = 0;
  ready_to_start          = 0;
  distances               = [0,0,0,0];
  tirette_status          = 0;
  leds                    = [0,0,0,0,0,0,0,0];
  servos_position         = [0,0,0,0,0,0];

  setInfo(new_current_position, new_vecteurDeplacement,new_next_position,new_asservissement_status,new_ready_to_start,new_distances,new_tirette_status, new_leds, new_servos_position)
  {
    this.current_position = new_current_position;
    this.vecteurDeplacement = new_vecteurDeplacement;
    this.next_position = new_next_position;
    this.asservissement_status = new_asservissement_status;
    this.ready_to_start = new_ready_to_start;
    this.distances = new_distances;
    this.tirette_status = new_tirette_status;
    this.leds = new_leds;
    this.servos_position = new_servos_position;
  }

  setDistances(new_distances)
  {
    this.distances = new_distances;
  }

  MoveFoward()
  {
    sendMessage("forward");
  }

  MoveBackward()
  {
    sendMessage("backward");
  }

  MoveLeft()
  {
    sendMessage("left");
  }

  MoveRight()
  {
    sendMessage("right");
  }

  MoveStop()
  {
    sendMessage("stop");
  }

  getDistances()
  {
    return this.distances;
  }
  
}

robot = new Robot();

// Every 500ms ask current status of Robot
window.setInterval(function(){
  sendMessage("getInfo");
}, 500);
