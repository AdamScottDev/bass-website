(function () {
  var sb = window.bassSb, mode = "signup";
  var $ = function (i) { return document.getElementById(i); };
  function next() {
    var n = new URLSearchParams(location.search).get("next");
    return n && n.charAt(0) === "/" && n.charAt(1) !== "/" ? n : "/account/";
  }
  window.bassProfile().then(function (r) { if (r.session) location.replace(next()); });
  function setMode(m) {
    mode = m;
    var up = m === "signup";
    $("form-title").textContent = up ? "Create your free account" : "Log in";
    $("submit").textContent = up ? "Create account" : "Log in";
    $("switch").textContent = up ? "I already have an account" : "I need to create an account";
    $("adult-row").hidden = !up;
    $("forgot").hidden = up;
    $("password").autocomplete = up ? "new-password" : "current-password";
    $("msg").textContent = "";
  }
  $("switch").onclick = function () { setMode(mode === "signup" ? "login" : "signup"); };
  $("forgot").onclick = function () {
    var email = $("email").value.trim();
    if (!email) { $("msg").textContent = "Type your email address first, then select Forgot password."; return; }
    sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + "/account/" }).then(function () {
      $("msg").textContent = "If that email has an account, we have sent a link to reset the password.";
    });
  };
  $("auth-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = $("email").value.trim(), pw = $("password").value, msg = $("msg");
    if (!email || pw.length < 8) { msg.textContent = "Enter your email and a password of at least 8 characters."; return; }
    if (mode === "signup") {
      if (!$("adult").checked) { msg.textContent = "BASS is for adults. Tick the box to confirm you are 18 or older."; return; }
      sb.auth.signUp({ email: email, password: pw, options: { emailRedirectTo: location.origin + "/account/" } }).then(function (res) {
        if (res.error) { msg.textContent = res.error.message; return; }
        if (res.data.session) { location.replace("/account/"); return; }
        $("auth-form").hidden = true;
        $("form-title").textContent = "Check your email";
        msg.hidden = false;
        $("done").hidden = false;
      });
    } else {
      sb.auth.signInWithPassword({ email: email, password: pw }).then(function (res) {
        if (res.error) {
          msg.textContent = /confirm/i.test(res.error.message) ? "Please verify your email first. Check your inbox for our link." : "That email or password is not right.";
          return;
        }
        location.replace(next());
      });
    }
  });
})();
