const scriptURL =
  "https://script.google.com/macros/s/AKfycbyRzJrRVLwecLbAB6tNRvNUiWRwKgoLL2S6Wv3tQW8iSt645zYBd3b8NJ3XOc6Ym7Kf5g/exec";
const form = document.forms["submit-to-google-sheet"];
form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      if (response.ok) {
        showSuccessAlert();
      } else {
        showErrorAlert("Internal Server Error, Please try again.");
      }

      setTimeout(function () {
        msg.innerHTML = "";
      }, 4000);
      form.reset();
    })
    .catch((error) => {
      console.error("Error!", error.message);
      showErrorAlert("An error occurred. Please try again.");
    });
});

document.getElementById("btnSubmit").addEventListener("click", function (e) {
  e.preventDefault();
  showConfirmationAlert();
});
function showConfirmationAlert() {
  Swal.fire({
    title: "Send Your Message?",
    text: "",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Send",
  }).then((result) => {
    if (result.isConfirmed) {
      form.dispatchEvent(new Event("submit"));
    }
  });
}

function showSuccessAlert() {
  Swal.fire({
    title: "DONE",
    text: "Thank You.",
    icon: "success",
    timer: 2000,
    showConfirmButton: false,
  });
}

function showErrorAlert(errorMessage) {
  Swal.fire({
    title: "Failed!",
    text: "Internal Server Error!",
    icon: "error",
    confirmButtonText: "Try Again",
  });
}
