/* WebMitra - shared site script
   Edit PHONE below; everything else picks it up automatically. */
(function () {
  "use strict";

  var PHONE = "919555964902";           // country code + number, digits only
  var GREETING = "Hi WebMitra, I'd like to know more about getting a website built.";
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- current year in footer ---------- */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- floating WhatsApp button ---------- */
  var waBtn = document.getElementById("waBtn");
  if (waBtn) {
    waBtn.href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(GREETING);
  }

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById("burger");
  var panel = document.getElementById("mobilePanel");
  if (burger && panel) {
    burger.addEventListener("click", function () {
      var open = panel.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("open")) {
        panel.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.focus();
      }
    });
  }

  /* ---------- hero before/after toggle (index.html only) ---------- */
  var rig = document.getElementById("rig");
  var rigBadge = document.getElementById("rigBadge");
  var tabOld = document.getElementById("tabOld");
  var tabNew = document.getElementById("tabNew");
  if (rig && tabOld && tabNew) {
    var setRigState = function (state) {
      rig.classList.toggle("old", state === "old");
      tabOld.classList.toggle("active", state === "old");
      tabNew.classList.toggle("active", state === "new");
      tabOld.setAttribute("aria-selected", state === "old" ? "true" : "false");
      tabNew.setAttribute("aria-selected", state === "new" ? "true" : "false");
      rigBadge.textContent = state === "old" ? "Old site" : "Your new site";
    };
    tabOld.addEventListener("click", function () { setRigState("old"); });
    tabNew.addEventListener("click", function () { setRigState("new"); });
  }

  /* ---------- scroll reveal (headings, card grids, etc.) ---------- */
  if (!prefersReduced && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal, .reveal-group, .reveal-item").forEach(function (el) {
    revealObserver.observe(el);
});
  } else {
    // reduced motion, or no IntersectionObserver support: show everything immediately
    document.querySelectorAll(".reveal, .reveal-group").forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---------- vertical timeline: scroll progress + active step ---------- */
  var timelines = Array.prototype.slice.call(document.querySelectorAll(".timeline"));
  if (timelines.length) {
    var updateTimeline = function (tl) {
      var fill = tl.querySelector(".timeline-track-fill");
      var steps = Array.prototype.slice.call(tl.querySelectorAll(".t-step"));
      if (!fill || !steps.length) return;
      var rect = tl.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var triggerLine = vh * 0.72;
      var progressPx = triggerLine - rect.top;
      var pct = Math.max(0, Math.min(1, progressPx / rect.height));
      fill.style.height = (pct * 100) + "%";

      var currentIndex = -1;
      steps.forEach(function (step, i) {
        var srect = step.getBoundingClientRect();
        var dotCenter = srect.top + 24;
        if (dotCenter < triggerLine) {
          step.classList.add("in-view");
          currentIndex = i;
        }
      });
      steps.forEach(function (step, i) {
        step.classList.toggle("t-current", i === currentIndex);
      });
    };
    var updateAllTimelines = function () { timelines.forEach(updateTimeline); };
    var ticking = false;
    var onScrollOrResize = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        updateAllTimelines();
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    updateAllTimelines();
  }

  /* ---------- demo previews (demos.html only) ---------- */
  var stage = document.getElementById("stage");
  var urlEl = document.getElementById("demoUrl");

  if (stage && urlEl) {
    var demos = {
      retail: {
        url: "https://sharmaelectronics.in", name: "Sharma Electronics", chip: "Retail",
        title: "Diwali offers are live",
        sub: "Browse 400+ appliances, check today's price, and order on WhatsApp.",
        tiles: [["Catalog", "Filter by brand and budget"], ["Offers", "Weekly price drops"], ["Visit us", "Map and store timings"]],
        tags: ["WhatsApp integrated", "Fast loading", "Mobile first", "Price list"]
      },
      school: {
        url: "https://vidyapublicschool.edu.in", name: "Vidya Public School", chip: "Education",
        title: "Admissions open for 2027-28",
        sub: "Download the prospectus, check fees, and submit an enquiry in two minutes.",
        tiles: [["Admissions", "Online enquiry form"], ["Fee structure", "Class-wise, downloadable"], ["Notices", "Updated by the office"]],
        tags: ["Admission portal", "Notice board", "Mobile first", "Parent friendly"]
      },
      service: {
        url: "https://coolcareservices.in", name: "CoolCare AC Services", chip: "Services",
        title: "AC service at home, same day",
        sub: "Book a technician for today, see upfront rates, and pay after the job.",
        tiles: [["Book now", "Pick a time slot"], ["Rate card", "No hidden charges"], ["Reviews", "Verified customers"]],
        tags: ["Booking requests", "WhatsApp integrated", "Fast loading", "Local SEO"]
      },
      clinic: {
        url: "https://dranjalidental.in", name: "Dr. Anjali Dental Care", chip: "Healthcare",
        title: "Appointments in under a minute",
        sub: "Pick a slot, see treatment costs upfront, and get a WhatsApp reminder.",
        tiles: [["Appointments", "Choose day and time"], ["Treatments", "Costs listed openly"], ["Doctors", "Qualifications and hours"]],
        tags: ["Appointment booking", "WhatsApp reminders", "Mobile first", "Local SEO"]
      }
    };

    var esc = function (s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    };

    var render = function (key) {
      var d = demos[key];
      if (!d) return;
      urlEl.textContent = d.url;
      stage.innerHTML =
        '<div class="mini-top"><b>' + esc(d.name) + '</b><span class="chip">' + esc(d.chip) + '</span></div>' +
        '<div class="mini-band"><h4>' + esc(d.title) + '</h4><p>' + esc(d.sub) + '</p></div>' +
        '<div class="mini-tiles">' + d.tiles.map(function (t) {
          return '<div><b>' + esc(t[0]) + '</b>' + esc(t[1]) + '</div>';
        }).join("") + '</div>' +
        '<div class="tags">' + d.tags.map(function (t) {
          return '<span class="tag">' + esc(t) + '</span>';
        }).join("") + '</div>';
    };

    var tabs = Array.prototype.slice.call(document.querySelectorAll(".demo-btn"));
    tabs.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        tabs.forEach(function (b) { b.setAttribute("aria-selected", "false"); });
        btn.setAttribute("aria-selected", "true");
        render(btn.dataset.demo);
      });
      btn.addEventListener("keydown", function (e) {
        var n = e.key === "ArrowDown" ? i + 1 : e.key === "ArrowUp" ? i - 1 : null;
        if (n === null) return;
        e.preventDefault();
        var t = tabs[(n + tabs.length) % tabs.length];
        t.focus();
        t.click();
      });
    });
    render("retail");
  }

  /* ---------- lead form (contact.html only) ---------- */
  var form = document.getElementById("leadForm");
  var status = document.getElementById("status");

  if (form && status) {
    var say = function (msg, ok) {
      status.textContent = msg;
      status.className = "status show " + (ok ? "ok" : "err");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var type = form.type.value;
      var budget = form.budget.value || "Not decided";
      var msg = form.message.value.trim();

      if (!name) { say("Add your name so we know who we're replying to.", false); form.name.focus(); return; }
      if (phone.replace(/\D/g, "").length < 10) { say("Enter a 10-digit WhatsApp number we can reach you on.", false); form.phone.focus(); return; }
      if (!type) { say("Pick a business type so we can send the right examples.", false); form.type.focus(); return; }

      var text = "New website enquiry\n\n" +
        "Name: " + name + "\n" +
        "WhatsApp: " + phone + "\n" +
        "Business type: " + type + "\n" +
        "Budget: " + budget + "\n" +
        "Requirement: " + (msg || "-");

      window.open("https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      say("Opening WhatsApp with your details. Send the message and we'll reply today.", true);
      form.reset();
    });
  }
})();
