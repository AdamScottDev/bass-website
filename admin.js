(function () {
  var sb = window.bassSb;
  var $ = function (i) { return document.getElementById(i); };
  function row(m) {
    var li = document.createElement("li");
    li.className = "member-row";
    var t = document.createElement("span");
    t.textContent = m.display_name + " (" + m.email + "), joined " + new Date(m.created_at).toLocaleDateString("en-AU");
    var b = document.createElement("button");
    b.type = "button"; b.className = "btn";
    b.textContent = m.approved ? "Remove access" : "Approve";
    b.onclick = function () {
      b.disabled = true;
      sb.rpc("set_approval", { target: m.id, ok: !m.approved }).then(load);
    };
    li.appendChild(t); li.appendChild(b);
    return li;
  }
  function load() {
    sb.rpc("admin_members").then(function (res) {
      if (res.error) { $("amsg").textContent = "Could not load members."; return; }
      var pend = $("pending"), appr = $("approved");
      pend.textContent = ""; appr.textContent = "";
      var np = 0;
      res.data.forEach(function (m) { if (m.approved) appr.appendChild(row(m)); else { np++; pend.appendChild(row(m)); } });
      $("amsg").textContent = np ? "" : "No one is waiting for approval.";
    });
  }
  window.bassProfile().then(function (r) { if (r.profile && r.profile.is_admin) load(); });
})();
