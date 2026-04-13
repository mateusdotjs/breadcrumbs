// Minimal in-browser SDK for tracking recent user actions.
(function () {
  var events = [];
  var MAX_EVENTS = 20;
  var BASE_ORIGIN = "http://localhost:3000";
  var INGEST_URL = BASE_ORIGIN + "/api/v1/log";
  var STORAGE_KEY = "breadcrumbs_events";

  // Extract projectId from the script tag
  var script = document.currentScript;
  var projectId = script ? script.getAttribute("projectId") : null;

  if (!projectId) {
    console.error(
      "[breadcrumbs-sdk] projectId attribute is required on the script tag",
    );
    return;
  }

  // Generate a unique session ID for this page load
  var sessionId = crypto.randomUUID();

  // Load events from localStorage on initialization
  function loadEventsFromStorage() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        events = JSON.parse(stored);
        console.log(
          "[breadcrumbs-sdk] loaded",
          events.length,
          "events from localStorage",
        );
      }
    } catch (err) {
      console.log("[breadcrumbs-sdk] failed to load from localStorage:", err);
      events = [];
    }
  }

  // Save events to localStorage
  function saveEventsToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (err) {
      console.log("[breadcrumbs-sdk] failed to save to localStorage:", err);
    }
  }

  // Adds an event to memory and keeps only the latest 20 (FIFO).
  function addEvent(type, data) {
    events.push({
      type: type,
      timestamp: Date.now(),
      data: data || {},
    });

    if (events.length > MAX_EVENTS) {
      events.shift();
    }

    saveEventsToStorage();

    console.log(
      "[breadcrumbs-sdk] event added:",
      type,
      data,
      "total:",
      events.length,
    );
  }

  // Clean text by removing newlines and normalizing spaces
  function cleanText(text) {
    if (!text || typeof text !== "string") return "";
    return text
      .replace(/\n+/g, " ") // Replace newlines with spaces
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim(); // Remove leading/trailing spaces
  }

  // Get enhanced description for input elements
  function getInputDescription(el) {
    if (!el || el.tagName.toLowerCase() !== "input") return null;

    var description = [];

    // Priority: aria-label > placeholder > name > id > type
    if (el.getAttribute("aria-label")) {
      description.push(
        "aria-label '" + cleanText(el.getAttribute("aria-label")) + "'",
      );
    }
    if (el.getAttribute("aria-placeholder")) {
      description.push(
        "aria-placeholder '" +
          cleanText(el.getAttribute("aria-placeholder")) +
          "'",
      );
    }
    if (el.placeholder) {
      description.push("placeholder '" + cleanText(el.placeholder) + "'");
    }
    if (el.name) {
      description.push("name '" + el.name + "'");
    }
    if (el.id) {
      description.push("id '" + el.id + "'");
    }
    if (el.type && el.type !== "text") {
      description.push("type '" + el.type + "'");
    }

    return description.length > 0 ? description.join(" ") : null;
  }

  // Get enhanced description for list items
  function getListItemDescription(el) {
    if (!el || el.tagName.toLowerCase() !== "li") return null;

    var description = [];

    // Priority: aria-label > role > id > class
    if (el.getAttribute("aria-label")) {
      description.push(
        "aria-label '" + cleanText(el.getAttribute("aria-label")) + "'",
      );
    }
    if (el.getAttribute("role")) {
      description.push("role '" + el.getAttribute("role") + "'");
    }
    if (el.id) {
      description.push("id '" + el.id + "'");
    }
    if (el.className && typeof el.className === "string") {
      var classes = el.className.trim().split(/\s+/);
      if (classes.length > 0) {
        description.push("class '" + classes[0] + "'");
      }
    }

    return description.length > 0 ? description.join(" ") : null;
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
  document.addEventListener(
    "click",
    function (e) {
      var el = e.target;
      if (!el) return;
      var tag = (el.tagName || "").toLowerCase();
      if (tag === "html" || tag === "body") return;

      var text = cleanText(el.innerText || "").slice(0, 30);
      var clickData = {
        tag: tag,
        text: text,
        selector: getSelector(el),
      };

      // Add enhanced descriptions for specific elements
      if (tag === "input") {
        var inputDesc = getInputDescription(el);
        if (inputDesc) {
          clickData.inputDescription = inputDesc;
        }
      } else if (tag === "li") {
        var listDesc = getListItemDescription(el);
        if (listDesc) {
          clickData.listItemDescription = listDesc;
        }
      }

      addEvent("click", clickData);
    },
    true,
  );

  // Capture route changes using location.pathname.
  function trackRoute() {
    var path = window.location.pathname;
    addEvent("route", { path: path });
    console.log("[breadcrumbs-sdk] route tracked:", path);
  }

  // Initialize events from localStorage
  loadEventsFromStorage();

  // Track first route when page loads.
  trackRoute();

  // Patch pushState so SPA navigations are captured.
  var originalPushState = history.pushState;
  history.pushState = function () {
    console.log("[breadcrumbs-sdk] pushState called");
    var result = originalPushState.apply(this, arguments);
    trackRoute();
    return result;
  };

  // Track browser back/forward navigation.
  window.addEventListener("popstate", trackRoute);

  function sendErrorToBackend(errorInfo) {
    var payload = {
      projectId: projectId,
      sessionId: sessionId,
      error: {
        message: String(errorInfo.message || ""),
        stack: String(errorInfo.stack || ""),
      },
      events: events.slice(),
    };

    console.log("[breadcrumbs-sdk] sending payload to", INGEST_URL, payload);
    fetch(INGEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        console.log("[breadcrumbs-sdk] ingest response status:", res.status);
      })
      .catch(function (err) {
        // Ignore network errors to avoid breaking the app.
        console.log("[breadcrumbs-sdk] failed to send payload:", err);
      });
  }

  // Synchronous errors and classic script errors (not promise rejections).
  window.onerror = function (message, source, lineno, colno, error) {
    console.log("[breadcrumbs-sdk] window.onerror triggered:", message);
    sendErrorToBackend({
      message: message || (error && error.message) || "",
      stack: error && error.stack ? error.stack : "",
    });
  };

  // Uncaught rejections: throws inside .then(), async/await without try/catch, etc.
  // window.onerror does not run for these in modern browsers.
  window.addEventListener("unhandledrejection", function (event) {
    var reason = event.reason;
    var message = "";
    var stack = "";
    if (reason != null) {
      if (typeof reason === "string") {
        message = reason;
      } else if (reason instanceof Error) {
        message = reason.message || String(reason);
        stack = reason.stack || "";
      } else {
        try {
          message = String(reason);
        } catch (e) {
          message = "unhandledrejection";
        }
      }
    } else {
      message = "unhandledrejection";
    }
    console.log("[breadcrumbs-sdk] unhandledrejection:", message);
    sendErrorToBackend({ message: message, stack: stack });
  });
})();
