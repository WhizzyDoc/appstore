 var table = document.querySelector("table");
var output = document.querySelector("#output");
 tme = 0;
 function theme() {
     if(tme==0){
         table.style.backgroundColor = "white";
         output.style.backgroundColor = "black";
         output.style.color = "yellow";
         tme=1;
     }
     else {
         table.style.backgroundColor = "black";
         output.style.backgroundColor = "white";
         output.style.color = "black";
         tme=0;
     }
 }
 
 function currentTime() {
     let date = new Date();
     let hh = date.getHours();
     let mm = date.getMinutes();
     let ss = date.getSeconds();
     let dd = date.getDay();
     let session = "AM";
     if(hh===0) {
         hh = 12;
     }
     if(hh>12) {
         hh = hh-12;
         session = "PM";
     }
     if(dd === 1) {dd = "MON"}
     else if(dd === 2) {dd = "TUE"}
     else if(dd === 2) {dd = "WED"}
     else if(dd === 2) {dd = "THU"}
     else if(dd === 2) {dd = "FRI"}
     else if(dd === 2) {dd = "SAT"}
     else {dd = "SUN"}

     hh = (hh < 10) ? "0" + hh : hh;
     mm = (mm < 10) ? "0" + mm : mm;
     ss = (ss < 10) ? "0" + ss : ss;
     let time = hh + ":" + mm + ":" + ss + " " + session + " ";

     document.getElementById("clock").innerText = time;
     let t = setTimeout(function(){currentTime()}, 1000);
}
    currentTime();