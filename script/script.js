function timer() {
  const timerCount = document.querySelector(".timer .count");
  let seconds = 0,
    mins = 0;
  setInterval(() => {
    let total = mins < 10 ? "0" + mins : mins;
    seconds++;
    timerCount.innerText =
      seconds < 10 ? total + ":0" + seconds : total + ":" + seconds;
    if (seconds === 59) {
      seconds = -1;
      mins++;
    }
    //! settimeout limit if needed to end game here.
    // if(mins === 60){

    // }
  }, 1000);
}
timer();

//! need to pass cards number of pairs and the counter of successes.
function gameOver(successCounter, cardsNum) {
  if (successCounter === cardsNum) {
    return true;
  }
  return false;
}

//! pass the guessesCount array from the game main obj
function updateCounters({ guessesCount }) {
  //! put flipCard func insted of true to see if second card flip is success or fail
  if (true) {
    document.querySelector(".correct-count").innerText = ++guessesCount[0];
  } else {
    document.querySelector(".incorrect-count").innerText = ++guessesCount[1];
  }
}

//! exmaple of main game obj, add here matrix, array of divs and other properties
const obj = { guessesCount: [0, 0] };
