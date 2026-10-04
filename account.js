(function () {
  var sb = window.bassSb;
  var $ = function (i) { return document.getElementById(i); };
  sb.auth.onAuthStateChange(function (ev) { if (ev === "PASSWORD_RECOVERY") $("pw-box").hidden = false; });
  window.bassProfile().then(function (r) {
    if (!r.session) { location.replace("/join-our-community/"); return; }
    var p = r.profile || {};
    $("state").textContent = p.approved
      ? "Your account is approved. Pods are coming soon."
      : "Your email is verified. A BASS team member will approve your account soon. You will be able to use the community once that is done.";
    $("display_name").value = p.display_name || "";
    $("pronouns").value = p.pronouns || "";
    $("status_line").value = p.status_line || "";
    $("bio").value = p.bio || "";
    if (p.is_admin) $("admin-link").hidden = false;
    $("profile-form").hidden = false;
    $("profile-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("display_name").value.trim();
      if (!name) { $("pmsg").textContent = "Choose a display name."; return; }
      sb.from("profiles").update({ display_name: name, pronouns: $("pronouns").value.trim(), status_line: $("status_line").value.trim(), bio: $("bio").value.trim() })
        .eq("id", r.session.user.id).then(function (res) {
          $("pmsg").textContent = res.error ? "Sorry, that did not save. Please try again." : "Saved.";
        });
    });
  });
  $("pw-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var pw = $("new-pw").value;
    if (pw.length < 8) { $("pwmsg").textContent = "Use at least 8 characters."; return; }
    sb.auth.updateUser({ password: pw }).then(function (res) {
      $("pwmsg").textContent = res.error ? res.error.message : "Password changed.";
    });
  });
  $("logout").onclick = function () { sb.auth.signOut().then(function () { location.replace("/"); }); };
})();
