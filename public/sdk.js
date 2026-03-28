// Minimal in-browser SDK for tracking recent user actions.
(function () {
  var events = [];
  var MAX_EVENTS = 20;

  // Adds an event to memory and keeps only the latest 20 (FIFO).
  function addEvent(type, data) {
    events.push({
      type: type,
      timestamp: Date.now(),
      data: data || {}
    });

    if (events.length > MAX_EVENTS) {
      events.shift();
    }

    console.log("[sdk] event added:", type, data, "total:", events.length);
  }

  // Builds a simple selector so we can identify where a click happened.
  function getSelector(el) {
    if (!el) return "";
    if (el.id) return "#" + el.id;
    if (el.className && typeof el.className === "string") {
      var firstClass = el.className.trim().split(/\s+/)[0];
      if (firstClass) return "." + firstClass;
    }
    return (el.tagName || "").toLowerCase();
  }

  // Capture click info early (capture phase) so we still log it
  // even if a click handler throws an error afterward.
  document.addEventListener("click", function (e) {
    var el = e.target;
    if (!el) return;
    var tag = (el.tagName || "").toLowerCase();
    if (tag === "html" || tag === "body") return;

    var text = (el.innerText || "").trim().slice(0, 30);
    addEvent("click", {
      tag: tag,
      text: text,
      selector: getSelector(el)
    });
  }, true);

  // Capture route changes using location.pathname.
  function trackRoute() {
    var path = window.location.pathname;
    addEvent("route", { path: path });
    console.log("[sdk] route tracked:", path);
  }

  // Track first route when page loads.
  trackRoute();

  // Patch pushState so SPA navigations are captured.
  var originalPushState = history.pushState;
  history.pushState = function () {
    console.log("[sdk] pushState called");
    var result = originalPushState.apply(this, arguments);
    trackRoute();
    return result;
  };

  // Track browser back/forward navigation.
  window.addEventListener("popstate", trackRoute);

  // Send error + recent events to backend when a JS error occurs.
  window.onerror = function (message, source, lineno, colno, error) {
    console.log("[sdk] window.onerror triggered:", message);
    var payload = {
      error: {
        message: String(message || ""),
        stack: error && error.stack ? String(error.stack) : ""
      },
      events: events.slice()
    };

    console.log("[sdk] sending payload to /api/log:", payload);
    fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        console.log("[sdk] /api/log response status:", res.status);
      })
      .catch(function (err) {
      // Ignore network errors to avoid breaking the app.
        console.log("[sdk] failed to send /api/log:", err);
      });
  };
})();
