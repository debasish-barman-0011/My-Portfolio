let tablinks = document.getElementsByClassName("tabLinks");
let tabContents = document.getElementsByClassName("tabContents");

function opentab(tabname) {
  for (tablink of tablinks) {
    tablink.classList.remove("activeLink");
  }
  for (tabContent of tabContents) {
    tabContent.classList.remove("activeTab");
  }

  event.currentTarget.classList.add("activeLink");
  document.getElementById(tabname).classList.add("activeTab");
}

// From here open close menu

let sideMenu = document.getElementById("sideMenu");
function openMenu() {
  sideMenu.style.right = "0";
}

function closeMenu() {
  sideMenu.style.right = "-100%";
}




