//variable initiliazation
var gamePattern = [];
var userClickedPattern = [];
var userClickCounter = 0;
var started = false;
var level = 0;
var buttonColors = ["red", "blue", "green", "yellow"];

// nextSequence can only be called if started === false
// keydown version for desktop, click for mobile
$(document).keydown(function() {
  reset();
});

// play button works the same as keydown, but also hides before starting
$(".play-button").click(function() {
  reset();
});

function reset() {
  if (!started) {
    started = true;
    level = 0;
    nextSequence();
    $(".play-button").hide();
    $("p").hide();
  }
}

//generates a random number 0-3 that is used to select a colored button.
//the button animates for the user to follow the random game pattern
function nextSequence() {
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColor = buttonColors[randomNumber];
  $("h1").text("Level " + level);
  level++;


  //for the first round, plays the only color-animation & sound and adds the only color to the gamePattern array
  if (gamePattern.length === 0) {
    gamePattern.push(randomChosenColor);
    animateRandom(randomChosenColor);
    playSound(randomChosenColor);
  } else {
    var i = 0;
    oldLoop();
    //for subsequent rounds, plays back through the established pattern.  Originally used a for loop, but needed more control over behavior
    function oldLoop() {
      setTimeout(function() {
        //the loop that plays back the established pattern
        if (i < gamePattern.length) {
          animateRandom(gamePattern[i]);
          playSound(gamePattern[i]);
          i++;
          oldLoop();
        } else {
          //after playing established pattern, plays latest color/sounds
          setTimeout(function() {
            gamePattern.push(randomChosenColor);
            animateRandom(randomChosenColor);
            playSound(randomChosenColor);
          }, 100);
        }
      }, 400);
    }
  }
}

//event handler detects which button the user clicked on
// if (started) ensures that play doesn't get "game over" before starting
//increments a counter to determine where the user is in the sequence
//the user sequence gets stored in userClickedPattern
//the clicked button plays back the associated sound
$(".btn").click(function(e) {
  if (started) {
    userClickCounter++;
    var userChosenColor = e.target.id;
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePressed(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);

    //checks to see if the user clicked on the same color that's in the gamePattern
    //else, resets patterns, counter, and started state, plays "game over"
    function checkAnswer(CurrentLevel) {
      if (userChosenColor === gamePattern[CurrentLevel]) {
        //checks if counter matches length of gamePattern,
        //if so, resets user pattern & userClickCounter
        //and then after a 1 second delay, proceeds through nextSequence
        if (userClickCounter === (gamePattern.length)) {
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
  }
});

//function called from nextSequence or btn click event listener
//name gets passed to complete the filepath to the sound
function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

//adds pressed class
//after 100 ms delay, pressed class removed to animate button
function animatePressed(userChosenColor) {
  $("#" + userChosenColor).addClass("pressed");
  setTimeout(function() {
    $("#" + userChosenColor).removeClass("pressed");
  }, 100);
}

//animation for the random color
function animateRandom(randomChosenColor) {
  $("#" + randomChosenColor).fadeOut(100).fadeIn(100);
}