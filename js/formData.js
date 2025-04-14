// Script for taking userinputs to the google sheets //

// Google Sheet API Key //
const scriptURL =
  "https://script.google.com/macros/s/AKfycbyRzJrRVLwecLbAB6tNRvNUiWRwKgoLL2S6Wv3tQW8iSt645zYBd3b8NJ3XOc6Ym7Kf5g/exec";

// Form Reference from HTML file //
const form = document.forms["submit-to-google-sheet"];

form.addEventListener("submit", handleSubmit);
// Ensure form is not empty //
function handleSubmit(e) {
  e.preventDefault();

  if (!isFormValid()) {
    showErrorAlert("Please fill out all required fields.");
    return;
  }

  showConfirmationAlert();
}
// validate the form as all the fields are required //
function isFormValid() {
  const requiredFields = form.querySelectorAll("[required]");
  return Array.from(requiredFields).every((field) => field.value.trim() !== "");
}
// Form Submission Logic //
function submitForm() {
  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      if (response.ok) {
        showSuccessAlert();
        form.reset();
      } else {
        throw new Error("Server error");
      }
    })
    .catch((error) => {
      console.error("Error!", error.message);
      showErrorAlert(" Please try again.");
    });
}

function showConfirmationAlert() {
  Swal.fire({
    title: "Agree to Submit?",
    text: "",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Send",
  }).then((result) => {
    if (result.isConfirmed) {
      submitForm();
    }
  });
}

function showSuccessAlert() {
  Swal.fire({
    title: "Submitted",
    text: "Thank You.",
    icon: "success",
    timer: 2000,
    showConfirmButton: false,
  });
}

function showErrorAlert(errorMessage) {
  Swal.fire({
    title: "😣 ..Failed.. 😣",
    text: errorMessage,
    icon: "error",
    confirmButtonText: "OK",
  });
}
