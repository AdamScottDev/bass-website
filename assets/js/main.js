// Mobile menu: opens and closes the navigation on small screens.
var btn = document.querySelector(".menu-btn");
var nav = document.getElementById("nav");
if (btn && nav) {
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
}
