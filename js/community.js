document.addEventListener("DOMContentLoaded", function() {
    const popup = document.querySelector(".popup");
    const closeBtn = document.querySelector(".close-btn");

    document.querySelectorAll(".know-more").forEach(button => {
        button.addEventListener("click", function() {
            const profileBox = this.closest(".profile-box");
            const name = profileBox.querySelector("h3").textContent;
            const degree = profileBox.querySelector("span").textContent;
            const bio = profileBox.getAttribute("data-bio");
            const description = profileBox.getAttribute("data-description");

            document.querySelector(".popup-name").textContent = name;
            document.querySelector(".popup-degree").textContent = degree;
            document.querySelector(".popup-bio").textContent = bio;
            document.querySelector(".popup-description").textContent = description;

            popup.style.display = "flex";
        });
    });

    closeBtn.addEventListener("click", function() {
        popup.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });
});
