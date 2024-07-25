const scriptURL =
  "https://script.google.com/macros/s/AKfycbyRzJrRVLwecLbAB6tNRvNUiWRwKgoLL2S6Wv3tQW8iSt645zYBd3b8NJ3XOc6Ym7Kf5g/exec";
const form = document.forms["submit-to-google-sheet"];
const msg = document.getElementById("msg");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      setTimeout(function () {
        msg.innerHTML = "";
      }, 4000);
      form.reset();
    })
    .catch((error) => console.error("Error!", error.message));
});

document.getElementById("btnSubmit").addEventListener("click", function () {
  alert(
    "Thank you for reaching out! Click OK to post your message. I'll reply you as soon as possible :)"
  );
});
