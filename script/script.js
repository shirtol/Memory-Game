const timerCount = document.querySelector(".timer .count");

function timer(updatedElement) {
  let seconds = 0;
  let mins = 0;
  setInterval(() => {
    seconds++;
    let total = mins < 10 ? "0" + mins : mins;
    updatedElement.innerText =
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
timer(timerCount);
