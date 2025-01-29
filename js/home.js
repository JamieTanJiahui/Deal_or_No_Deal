// Function to handle the start button click event
function startGame() {
  // Redirect to game.html
  window.location.href = "html/game.html";
}

// Set up the event listener on the start button
const startButton = document.getElementById("startButton");
if (startButton) {
  startButton.addEventListener("click", startGame);
}

const guideButton = document.getElementById("guideButton");
if(guideButton){
  guideButton.addEventListener("click", function(){
    window.location.href = "html/guide.html";
  });
}
