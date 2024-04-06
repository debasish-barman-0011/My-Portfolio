const scriptURL =
  "https://script.google.com/macros/s/AKfycbyRzJrRVLwecLbAB6tNRvNUiWRwKgoLL2S6Wv3tQW8iSt645zYBd3b8NJ3XOc6Ym7Kf5g/exec";
const form = document.forms["submit-to-google-sheet"];
const msg = document.getElementById("msg");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      msg.innerHTML = "Thank You. I will reach out to you very soon.";
      setTimeout(function () {
        msg.innerHTML = "";
      }, 6000);
      form.reset();
    })
    .catch((error) => console.error("Error!", error.message));
});
