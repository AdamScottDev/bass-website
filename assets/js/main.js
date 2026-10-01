// 1. Mobile menu: opens and closes the navigation on small screens.
var root = document.documentElement;
var btn = document.querySelector(".menu-btn");
var nav = document.getElementById("nav");
if (btn && nav) {
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
}

// 2. Theme button: switches between the dark (default) and light look,
//    and remembers the choice in this browser.
var themeBtn = document.querySelector(".theme-btn");
function updateLabel() {
  if (themeBtn) themeBtn.textContent = root.dataset.theme === "light" ? "Dark mode" : "Light mode";
}
updateLabel();
if (themeBtn) {
  themeBtn.addEventListener("click", function () {
    var next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try { localStorage.setItem("bass-theme", next); } catch (e) {}
    updateLabel();
  });
}
