// Meet Our Community page: shows approved member posts from data/community-posts.json.
// Posts are added as plain text only, so nothing from Discord can run as code.
(function () {
  var list = document.getElementById("posts-list");
  var toggle = document.getElementById("posts-toggle");
  var grid = document.getElementById("post-grid");
  var status = document.getElementById("posts-status");
  if (!list || !toggle || !grid) return;
  var KEY = "bass-posts-hidden";

  function show(hidden) {
    list.hidden = hidden;
    toggle.setAttribute("aria-expanded", hidden ? "false" : "true");
    toggle.textContent = hidden ? "Show community posts" : "Hide community posts";
  }
  var hidden = false;
  try { hidden = localStorage.getItem(KEY) === "1"; } catch (e) {}
  show(hidden);
  toggle.addEventListener("click", function () {
    var h = !list.hidden;
    show(h);
    try { localStorage.setItem(KEY, h ? "1" : "0"); } catch (e) {}
  });

  function monthYear(d) {
    var p = String(d || "").split("-");
    if (p.length < 2) return "";
    return new Date(+p[0], +p[1] - 1, 1).toLocaleDateString("en-AU", { month: "long", year: "numeric" });
  }

  function card(post) {
    var el = document.createElement("article");
    el.className = "post-card";
    var meta = document.createElement("p");
    meta.className = "post-meta";
    meta.textContent = "A BASS member" + (post.date ? " \u00B7 " + monthYear(post.date) : "");
    el.appendChild(meta);
    if (post.tags && post.tags.length) {
      var ul = document.createElement("ul");
      ul.className = "tag-list";
      ul.setAttribute("aria-label", "Topics");
      post.tags.forEach(function (t) {
        var li = document.createElement("li");
        li.textContent = t;
        ul.appendChild(li);
      });
      el.appendChild(ul);
    }
    var body = document.createElement("p");
    body.className = "post-text";
    body.id = "post-" + Math.random().toString(36).slice(2, 8);
    body.textContent = post.text;
    el.appendChild(body);
    if (post.text.length > 220 || post.text.split("\n").length > 4) {
      body.classList.add("clamp");
      var more = document.createElement("button");
      more.type = "button";
      more.className = "opt more";
      more.setAttribute("aria-expanded", "false");
      more.setAttribute("aria-controls", body.id);
      more.textContent = "Read the whole post";
      more.addEventListener("click", function () {
        var open = body.classList.toggle("clamp") === false;
        more.setAttribute("aria-expanded", open ? "true" : "false");
        more.textContent = open ? "Show less" : "Read the whole post";
      });
      el.appendChild(more);
    }
    return el;
  }

  fetch("/data/community-posts.json", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      var posts = (data && data.posts) || [];
      if (!posts.length) {
        status.textContent = "There are no community posts to show here yet. You can meet everyone by joining our Discord.";
        return;
      }
      posts.forEach(function (p) { grid.appendChild(card(p)); });
    })
    .catch(function () {
      status.textContent = "Sorry, the community posts could not be loaded. You can meet everyone by joining our Discord.";
    });
})();
