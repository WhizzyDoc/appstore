  //globle variables
  var stopwatch = document.getElementById('stopwatch');
  var mainButton = document.getElementById('main-btn');
  var startTime=0;
  var elapsedTime=0;
  var timeoutId=null;

  //method to operate start and stop function
  function main(){
    if (mainButton.innerHTML.trim() === 'Start') {
    startTime = Date.now();
      startStopwatch();
      mainButton.innerHTML = 'Stop';
    } else {
      elapsedTime += Date.now() - startTime;
      clearTimeout(timeoutId);
      mainButton.innerHTML = 'Start';
    }
  }

  //method to reset the stopwatch
  function reset() {
    elapsedTime = 0;
    startTime = Date.now();
    clearTimeout(timeoutId);
    mainButton.innerHTML = 'Start';
    displayTime(0, 0, 0, 0);  
  }

  //method to start the stopwatch
  function startStopwatch() {
    
    //run setTimeout() and save id
    timeoutId = setTimeout(function(){
      //calculate elapsed time
      const time = Date.now() - startTime + elapsedTime;
       
      //calculate different time measurements based on elapsed time
      const milliseconds = parseInt((time%1000)/10)
      const seconds = parseInt((time/1000)%60)
      const minutes = parseInt((time/(1000*60))%60)
      const hour = parseInt((time/(1000*60*60))%24);
       
      //display time
      displayTime(hour, minutes, seconds, milliseconds);
       
      //calling same method again recursivaly
      startStopwatch();
    }, 100);
  }

  //method to display time in '00:00:00:00' format
  function displayTime(hour, minutes, seconds, milliseconds) {
      hour = hour < 10 ? '0'+hour : hour ;
      minutes = minutes < 10 ? '0'+minutes : minutes ;
      seconds = seconds < 10 ? '0'+seconds : seconds ;
      milliseconds = milliseconds < 10 ? '0'+milliseconds : milliseconds ;
      stopwatch.innerHTML = hour+':'+minutes+':'+seconds+':'+milliseconds;
  }