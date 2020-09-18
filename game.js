var gamePattern = [];
var userClickedPattern = [];
var userClickCounter = 0;
var started = false;
var level = 0;

var buttonColors = ["red", "blue", "green", "yellow"];

//nextSequence can only be called if started === false
//keydown version for desktop, click for mobile
$(document).keydown(function() {
  if (!started) {
    level = 0;
    nextSequence();
    started = true;
    $(".play-button").hide();
    $("p").hide();
  }
});

//play button works the same as keydown, but also hides before starting
$(".play-button").click(function() {
  if (!started) {
    level = 0;
    nextSequence();
    started = true;
    $(".play-button").hide();
    $("p").hide();
  }
});


//generates a random number 0-3 that is used to select a colored button.
//the button animates for the user to follow the random game pattern
//a unique sound plays for each of the randomly selected button
//the gamePattern array stores the sequence
function nextSequence() {

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColor = buttonColors[randomNumber];
  $("#" + randomChosenColor).fadeOut(100).fadeIn(100);
  playSound(randomChosenColor);
  gamePattern.push(randomChosenColor);
  $("h1").text("Level " + level);
  level++;
}

//event handler detects which button the user clicked on
//increments a counter to determine where the user is in the sequence
//the user sequence gets stored in userClickedPattern
//the clicked button plays back the associated sound
//the pressed class is added
//after 100 ms delay, pressed class removed to animate button
$(".btn").click(function(e) {
  userClickCounter++;
  var userChosenColor = e.target.id;
  userClickedPattern.push(userChosenColor);
  playSound(userChosenColor);
  $("#" + userChosenColor).addClass("pressed");
  setTimeout(function() {
    $("#" + userChosenColor).removeClass("pressed");
  }, 100);

  //checks to see if the user clicked on the same color that's in the gamePattern
  //else, resets patterns, counter, and started state, plays "game over"
  function checkAnswer(level) {
    if (userChosenColor === gamePattern[userClickCounter - 1]) {
      //checks if counter matches length of gamePattern,
      //if so, resets user pattern & userClickCounter
      //and then after a 1 second delay, proceeds through nextSequence
      if (userClickCounter === gamePattern.length) {
        setTimeout(function() {
          userClickedPattern = [];
          userClickCounter = 0;
          nextSequence();
        }, 1000);
      }
    } else {
      gamePattern = [];
      userClickedPattern = [];
      userClickCounter = 0;
      started = false;
      $(".desktop").text("Game Over, Press Any Key to Restart");
      $("#mobile-title").text("Game Over");
      $(".play-button").show();
      playSound("wrong");
      $("body").addClass("game-over");
      setTimeout(function() {
        $("body").removeClass("game-over");
      }, 200);
      $("p").show();
    }
  }
  checkAnswer(userClickedPattern.length);
});

//function called from nextSequence or btn click event listener
//name gets passed to complete the filepath to the sound
function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}