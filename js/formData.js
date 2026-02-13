// Script for taking userinputs to the google sheets //

// Google Sheet New API Key from Mail4Barman //
const scriptURL =
  "https://script.google.com/macros/s/AKfycbzf584e1lTw82kdjbv9H861VaWYBTi7F5M7SYmtsjw9Nl2bIKutdUSmxCvlzFS_MWthZg/exec";

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
    title: "Confirm Submission",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#21da65ff",
    cancelButtonColor: "#d33",
    confirmButtonText: "Click to Submit",
  }).then((result) => {
    if (result.isConfirmed) {
      submitForm();
    }
  });
}

function showSuccessAlert() {
  Swal.fire({
    title: "Thank You",
    text: "I'll will get back to you shortly.",
    icon: "success",
    timer: 4000,
    showConfirmButton: false,
  });
}

function showErrorAlert(errorMessage) {
  Swal.fire({
    title: "Failed",
    text: errorMessage,
    icon: "error",
    confirmButtonText: "Check your connection and try again",
  });
}
