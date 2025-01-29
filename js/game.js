// List of values that can be in the briefcases
const values = [-10, -5, -1, +1, +2, +5, +10, +15, +20, +25, +40, +45, +50];

// Shuffle function
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
  }
  return arr;
}

// Game Initialization
function startGameOnPageLoad() {
  let shuffledValues = shuffleArray([...values]).slice(0, 13); // Shuffle values
  const sortedValues = [...shuffledValues].sort((a, b) => a - b); // Sidebar should show values in ascending order

  const briefcasesContainer = document.getElementById("briefcases");
  const instruction = document.getElementById("instruction");
  const valueList = document.getElementById("valueList");
  const selectedBriefcaseSection = document.getElementById("selectedBriefcaseSection");
  const modal = document.getElementById("dealModal");
  const dealBtn = document.getElementById("deal");
  const noDealBtn = document.getElementById("noDeal");
  const swapModal = document.getElementById("swapModal");
  const swapYesBtn = document.getElementById("swapYes");
  const swapNoBtn = document.getElementById("swapNo");
  const playAgainBtn = document.getElementById("playAgain");

  if (!briefcasesContainer || !instruction || !valueList || !modal || !dealBtn || !noDealBtn || !playAgainBtn) {
    console.error("Missing necessary elements in HTML.");
    return;
  }

  playAgainBtn.style.display = "none";  // Hide the Play Again button initially
  briefcasesContainer.innerHTML = "";
  valueList.innerHTML = "";

  sortedValues.forEach((value) => {
    const listItem = document.createElement("li");
    listItem.textContent = value;
    valueList.appendChild(listItem);
  });

  let selectedBriefcase = null;
  let clickCount = 0;
  let currentSelection = 0;
  const selectionSequence = [5, 3, 2, 1]; // Steps before swap
  let swapOption = false;

  shuffledValues.forEach((value, index) => {
    const briefcase = document.createElement("div");
    briefcase.classList.add("briefcase");
    briefcase.setAttribute("data-value", value);

    briefcase.addEventListener("click", () => {
      if (instruction.textContent === "Pick a briefcase!" && !selectedBriefcase) {
        selectedBriefcase = briefcase;
        briefcase.classList.add("selected-briefcase");
        selectedBriefcaseSection.appendChild(briefcase);
        instruction.textContent = `Select ${selectionSequence[currentSelection]} briefcases`;
        enableBriefcases();
      } else if (instruction.textContent.includes("Select") && briefcase !== selectedBriefcase) {
        briefcase.classList.add("revealed");
        briefcase.textContent = briefcase.getAttribute("data-value");
        markValueAsRevealed(value);
        clickCount++;

        if (clickCount >= selectionSequence[currentSelection]) {
          disableBriefcases();
          setTimeout(() => modal.style.display = "block", 500);
        }
      }
    });

    briefcasesContainer.appendChild(briefcase);
  });

  // Deal Button Click
  dealBtn.addEventListener("click", () => {
    revealAllBriefcases();
    modal.style.display = "none";
    instruction.textContent = "Game Over!";
    playAgainBtn.style.display = "block";  // Show "Play Again" button
  });

  // No Deal Button Click
  noDealBtn.addEventListener("click", () => {
    modal.style.display = "none";

    if (currentSelection < selectionSequence.length - 1) {
      currentSelection++;
      instruction.textContent = `Select ${selectionSequence[currentSelection]} briefcases`;
    } else {
      // Last stage: Show Swap Option
      swapOption = true;
      instruction.textContent = "Do you want to swap your briefcase?";
      swapModal.style.display = "block";
    }

    enableBriefcases();
    clickCount = 0;
  });

  // Swap Yes Button
  swapYesBtn.addEventListener("click", () => {
    swapBriefcase(selectedBriefcase);
    swapModal.style.display = "none";
    revealAllBriefcases();
    instruction.textContent = "Game Over!";
    playAgainBtn.style.display = "block";  // Show "Play Again" button
  });

  // Swap No Button
  swapNoBtn.addEventListener("click", () => {
    swapModal.style.display = "none";
    revealAllBriefcases();
    instruction.textContent = "Game Over!";
    playAgainBtn.style.display = "block";  // Show "Play Again" button
  });

  // Play Again Button Click
  playAgainBtn.addEventListener("click", () => {
    playAgainBtn.style.display = "none"; // Hide the "Play Again" button
    instruction.textContent = "Pick a briefcase!";
    selectedBriefcaseSection.innerHTML = ""; // Clear selected briefcase
    shuffledValues = shuffleArray([...values]).slice(0, 13); // Shuffle values

    // Reset game variables
    selectedBriefcase = null;
    clickCount = 0;
    currentSelection = 0;  // Reset the selection stage
    swapOption = false;    // Reset swap option flag

    startGameOnPageLoad(); // Start the game again
  });

}

// Enable Clicking on Briefcases
function enableBriefcases() {
  const briefcases = document.querySelectorAll(".briefcase");
  briefcases.forEach(briefcase => {
    if (!briefcase.classList.contains("selected-briefcase") && !briefcase.classList.contains("revealed")) {
      briefcase.style.pointerEvents = "auto";
    }
  });
}

// Disable Clicking on Briefcases
function disableBriefcases() {
  const briefcases = document.querySelectorAll(".briefcase");
  briefcases.forEach(b => b.style.pointerEvents = "none");
}

// Mark Sidebar Values as Revealed
function markValueAsRevealed(value) {
  const valueItems = document.querySelectorAll("#valueList li");
  valueItems.forEach(item => {
    if (item.textContent === value.toString()) {
      item.classList.add("revealed");
      item.style.textDecoration = "line-through";
    }
  });
}

// Reveal All Briefcases
function revealAllBriefcases() {
  const briefcases = document.querySelectorAll(".briefcase");
  briefcases.forEach(briefcase => {
    briefcase.classList.add("revealed");
    briefcase.textContent = briefcase.getAttribute("data-value");
  });
}

// Swap Briefcase Logic
function swapBriefcase(selectedBriefcase) {
  const remainingBriefcases = [...document.querySelectorAll(".briefcase")].filter(b => !b.classList.contains("selected-briefcase") && !b.classList.contains("revealed"));

  if (remainingBriefcases.length > 0) {
    const newBriefcase = remainingBriefcases[Math.floor(Math.random() * remainingBriefcases.length)];
    const tempValue = selectedBriefcase.getAttribute("data-value");

    selectedBriefcase.setAttribute("data-value", newBriefcase.getAttribute("data-value"));
    selectedBriefcase.textContent = newBriefcase.getAttribute("data-value");

    newBriefcase.setAttribute("data-value", tempValue);
    newBriefcase.textContent = tempValue;

    selectedBriefcase.classList.add("swapped");
    newBriefcase.classList.add("swapped");
  }
}

window.addEventListener('load', startGameOnPageLoad);
