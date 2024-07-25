window.onload = function () {
  var date = new Date();
  var hour = date.getHours();
  var greetingDiv = document.getElementById("greeting");

  if (hour >= 0 && hour < 12) {
    greetingDiv.textContent = "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    greetingDiv.textContent = "Good Afternoon";
  } else if (hour >= 17 && hour < 20) {
    greetingDiv.textContent = "Good Evening";
  } else {
    greetingDiv.textContent = "Welcome again";
  }
};

//
