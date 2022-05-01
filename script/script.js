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
