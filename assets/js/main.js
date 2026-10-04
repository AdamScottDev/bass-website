// 1. Mobile menu: opens and closes the navigation on small screens.
var root = document.documentElement;
var btn = document.querySelector(".menu-btn");
var nav = document.getElementById("nav");
if (btn && nav) {
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      btn.focus();
    }
  });
}

// 2. Display options (footer): text size and light/dark colours.
//    Choices are remembered in this browser only.
function remember(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {}
}
function mark(group, value) {
  var buttons = document.querySelectorAll('[data-group="' + group + '"]');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].setAttribute("aria-pressed", buttons[i].getAttribute("data-value") === value ? "true" : "false");
  }
}
mark("size", root.dataset.size || "default");
mark("theme", root.dataset.theme || "dark");
var opts = document.querySelectorAll(".opt");
for (var i = 0; i < opts.length; i++) {
  opts[i].addEventListener("click", function () {
    var group = this.getAttribute("data-group");
    var value = this.getAttribute("data-value");
    if (group === "size") { root.dataset.size = value; remember("bass-size", value); }
    if (group === "theme") { root.dataset.theme = value; remember("bass-theme", value); }
    mark(group, value);
  });
}
