const scriptURL =
  "https://script.google.com/macros/s/AKfycbw_rJxnMaZyOj09IIit0x_66lU3mljZ8Krj919yu2CiRCL8XdbMBSi9r9x6Pmbdr-4/exec";
const form = document.forms["submit-to-google-sheet"];
const msg = document.getElementById("msg");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      // msg.innerHTML = "Thank You. I will reach out to you very soon.";
      setTimeout(function () {
        msg.innerHTML = "";
      }, 4000);
      form.reset();
    })
    .catch((error) => console.error("Error!", error.message));
});

document.getElementById("btnSubmit").addEventListener("click", function() {

  alert("Resume Download Request Has Been Processed. Click OK To Continue.");

}); 