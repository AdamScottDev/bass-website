// Shared by every page that talks to Supabase: connects, finds the member, guards pages.
(function () {
  var C = window.BASS_CONFIG;
  var sb = window.supabase.createClient(C.url, C.key);
  window.bassSb = sb;
  var cached;
  window.bassProfile = function () {
    if (cached) return cached;
    cached = sb.auth.getSession().then(function (res) {
      var session = res.data.session;
      if (!session) return { session: null };
      return sb.from("profiles").select("*").eq("id", session.user.id).single()
        .then(function (p) { return { session: session, profile: p.data }; });
    });
    return cached;
  };
  var need = document.body.dataset.require;
  window.bassProfile().then(function (r) {
    var btn = document.querySelector(".bar-actions .btn");
    if (r.session && btn) { btn.textContent = "My account"; btn.href = "/account/"; }
    if (!need) return;
    var p = r.profile || {};
    if (!r.session) { location.replace("/join-our-community/?next=" + encodeURIComponent(location.pathname)); return; }
    if ((need === "approved" && !p.approved) || (need === "admin" && !p.is_admin)) { location.replace("/account/"); return; }
    document.body.classList.add("ok");
  });
})();
