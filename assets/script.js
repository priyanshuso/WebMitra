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



/* =========================================================
   WEBMITRA - SERVICES PAGE ANIMATIONS
   ========================================================= */


/* ================= SCROLL REVEAL ================= */

const serviceRevealElements =
  document.querySelectorAll(".reveal-new");

if(serviceRevealElements.length){

  const serviceRevealObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if(entry.isIntersecting){

            entry.target.classList.add("show");

            serviceRevealObserver.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold:0.12
      }
    );


  serviceRevealElements.forEach((element) => {

    serviceRevealObserver.observe(element);

  });

}


/* ================= PROCESS TIMELINE ================= */

const process =
  document.querySelector(".process");

const processProgress =
  document.getElementById("processProgress");

const processSteps =
  document.querySelectorAll(".process-step");


function updateProcessTimeline(){

  if(!process || !processProgress){
    return;
  }


  const processRect =
    process.getBoundingClientRect();

  const screenPoint =
    window.innerHeight * 0.55;


  let progressHeight =
    screenPoint - processRect.top;


  progressHeight =
    Math.max(
      0,
      Math.min(
        progressHeight,
        process.offsetHeight
      )
    );


  processProgress.style.height =
    progressHeight + "px";


  processSteps.forEach((step) => {

    const stepRect =
      step.getBoundingClientRect();

    if(
      stepRect.top <
      screenPoint - 20
    ){

      step.classList.add("active");

    }else{

      step.classList.remove("active");

    }

  });

}


window.addEventListener(
  "scroll",
  updateProcessTimeline,
  {
    passive:true
  }
);


window.addEventListener(
  "resize",
  updateProcessTimeline
);


updateProcessTimeline();


/* ================= CURRENT YEAR ================= */

const currentYear =
  document.getElementById("yr");

if(currentYear){

  currentYear.textContent =
    new Date().getFullYear();

}





/* =========================================================
   WEBMITRA HOME PAGE — JAVASCRIPT
   Add this at the END of script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- SCROLL REVEAL ---------- */

  const revealItems = document.querySelectorAll(
    ".home-benefit-card, .home-business-card, .home-process-step, .home-stat, .home-cta-box"
  );

  if (revealItems.length) {
    revealItems.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(30px)";
      item.style.transition =
        `opacity 0.6s ease ${index * 0.08}s,
         transform 0.6s ease ${index * 0.08}s`;
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12
      }
    );

    revealItems.forEach(item => revealObserver.observe(item));
  }


  /* ---------- HERO DASHBOARD ANIMATION ---------- */

  const dashboard = document.querySelector(".home-dashboard");

  if (dashboard) {
    dashboard.addEventListener("mousemove", (e) => {
      const rect = dashboard.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = ((y / rect.height) - 0.5) * -5;
      const rotateY = ((x / rect.width) - 0.5) * 5;

      dashboard.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    dashboard.addEventListener("mouseleave", () => {
      dashboard.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg)";
    });
  }


  /* ---------- PROCESS LINE ANIMATION ---------- */

  const processSection = document.querySelector(".home-process");
  const processLine = document.querySelector(".home-process-line");

  if (processSection && processLine) {

    const updateProcessLine = () => {

      const rect = processSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const progress =
        1 - ((rect.bottom - windowHeight) /
        (rect.height + windowHeight));

      const percentage = Math.max(
        0,
        Math.min(100, progress * 100)
      );

      processLine.style.background =
        `linear-gradient(
          to bottom,
          #2563eb ${percentage}%,
          #dbeafe ${percentage}%
        )`;
    };

    window.addEventListener("scroll", updateProcessLine);
    updateProcessLine();
  }


  /* ---------- STATS COUNTER ---------- */

  const counters = document.querySelectorAll(
    ".home-stat strong[data-count]"
  );

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const target = Number(counter.dataset.count);

        if (isNaN(target)) return;

        let current = 0;
        const duration = 1500;
        const startTime = performance.now();

        const animateCounter = (currentTime) => {

          const progress = Math.min(
            (currentTime - startTime) / duration,
            1
          );

          const ease =
            1 - Math.pow(1 - progress, 3);

          current = Math.floor(target * ease);

          counter.textContent = current + "+";

          if (progress < 1) {
            requestAnimationFrame(animateCounter);
          } else {
            counter.textContent = target + "+";
          }
        };

        requestAnimationFrame(animateCounter);

        observer.unobserve(counter);
      });

    },
    {
      threshold: 0.6
    }
  );

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });


  /* ---------- BUSINESS CARD HOVER ---------- */

  const businessCards = document.querySelectorAll(
    ".home-business-card"
  );

  businessCards.forEach(card => {

    card.addEventListener("mouseenter", () => {
      card.style.transition = "all 0.35s ease";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });

  });


  /* ---------- SMOOTH SCROLL ---------- */

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (e) {

      const targetId = this.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


  /* ---------- HERO LOAD ANIMATION ---------- */

  const heroContent = document.querySelector(".home-hero-content");
  const heroVisual = document.querySelector(".home-hero-visual");

  if (heroContent) {
    heroContent.style.opacity = "0";
    heroContent.style.transform = "translateY(25px)";
    heroContent.style.transition =
      "opacity 0.8s ease, transform 0.8s ease";
  }

  if (heroVisual) {
    heroVisual.style.opacity = "0";
    heroVisual.style.transform = "translateY(30px)";
    heroVisual.style.transition =
      "opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s";
  }

  setTimeout(() => {

    if (heroContent) {
      heroContent.style.opacity = "1";
      heroContent.style.transform = "translateY(0)";
    }

    if (heroVisual) {
      heroVisual.style.opacity = "1";
      heroVisual.style.transform = "translateY(0)";
    }

  }, 100);


  /* ---------- ACTIVE NAV LINK ---------- */

  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav a").forEach(link => {

    const href = link.getAttribute("href");

    if (
      href === currentPage ||
      (currentPage === "" && href === "index.html")
    ) {
      link.classList.add("active");
    }

  });

});

/* =========================================================
   WHY US PAGE — JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- FAQ ---------- */

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {

    item.addEventListener("toggle", () => {

      if (!item.open) return;

      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.removeAttribute("open");
        }
      });

    });

  });


  /* ---------- SCROLL REVEAL ---------- */

  const revealElements = document.querySelectorAll(
    ".service-card, .process-step, .stat, .faq-item, .cta-box"
  );

  if (revealElements.length) {

    revealElements.forEach((element, index) => {

      element.style.opacity = "0";
      element.style.transform = "translateY(25px)";
      element.style.transition =
        `opacity 0.6s ease ${index * 0.06}s,
         transform 0.6s ease ${index * 0.06}s`;

    });


    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";

          observer.unobserve(entry.target);

        });

      },
      {
        threshold: 0.12
      }
    );


    revealElements.forEach(element => {
      revealObserver.observe(element);
    });

  }


  /* ---------- PROCESS PROGRESS ---------- */

  const process = document.querySelector(".process");
  const progress = document.querySelector(".process-progress");

  if (process && progress) {

    const updateProgress = () => {

      const rect = process.getBoundingClientRect();

      const viewportCenter = window.innerHeight * 0.65;

      let percentage =
        (viewportCenter - rect.top) / rect.height;

      percentage = Math.max(
        0,
        Math.min(1, percentage)
      );

      progress.style.height =
        `${percentage * 100}%`;

    };


    window.addEventListener(
      "scroll",
      updateProgress,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateProgress
    );

    updateProgress();

  }


  /* ---------- HERO CARD TILT ---------- */

  const heroCard = document.querySelector(
    ".hero-card-main"
  );

  if (heroCard) {

    heroCard.addEventListener("mousemove", event => {

      const rect =
        heroCard.getBoundingClientRect();

      const x =
        event.clientX - rect.left;

      const y =
        event.clientY - rect.top;

      const rotateX =
        ((y / rect.height) - 0.5) * -5;

      const rotateY =
        ((x / rect.width) - 0.5) * 5;

      heroCard.style.transform =
        `perspective(800px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)
         translateY(-4px)`;

    });


    heroCard.addEventListener("mouseleave", () => {

      heroCard.style.transform =
        "perspective(800px) rotateX(0deg) rotateY(0deg)";

    });

  }


  /* ---------- YEAR ---------- */

  const year = document.getElementById("yr");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

});

/* =========================================================
   DEMOS PAGE — PREMIUM UI
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const demoButtons = document.querySelectorAll(
    ".demo-modern-btn"
  );

  const stage = document.getElementById("stage");

  const demoUrl = document.getElementById("demoUrl");


  if (!demoButtons.length || !stage) {
    return;
  }


  /* ---------- ACTIVE DEMO BUTTON ---------- */

  demoButtons.forEach(button => {

    button.addEventListener("click", () => {

      demoButtons.forEach(btn => {

        btn.classList.remove("active");
        btn.setAttribute("aria-selected", "false");

      });


      button.classList.add("active");
      button.setAttribute("aria-selected", "true");


      /* Preview animation */

      stage.classList.remove("demo-changing");

      void stage.offsetWidth;

      stage.classList.add("demo-changing");


      /* URL update */

      const demo = button.dataset.demo;

      const urls = {
        retail: "https://sharmaelectronics.in",
        school: "https://vidyapublicschool.in",
        service: "https://coolcareacservices.in",
        clinic: "https://dranjalidental.in"
      };

      if (demoUrl && urls[demo]) {
        demoUrl.textContent = urls[demo];
      }

    });

  });


  /* ---------- KEYBOARD ACCESSIBILITY ---------- */

  demoButtons.forEach((button, index) => {

    button.addEventListener("keydown", event => {

      let nextIndex = index;

      if (event.key === "ArrowDown" ||
          event.key === "ArrowRight") {

        nextIndex =
          (index + 1) % demoButtons.length;

      }

      if (event.key === "ArrowUp" ||
          event.key === "ArrowLeft") {

        nextIndex =
          (index - 1 + demoButtons.length) %
          demoButtons.length;

      }

      if (nextIndex !== index) {

        event.preventDefault();

        demoButtons[nextIndex].focus();

        demoButtons[nextIndex].click();

      }

    });

  });


  /* ---------- SCROLL REVEAL ---------- */

  const revealElements = document.querySelectorAll(
    ".demo-modern-btn, .demo-browser, .demo-features-section .service-card, .process-step, .cta-box"
  );


  if (revealElements.length) {

    revealElements.forEach((element, index) => {

      element.style.opacity = "0";
      element.style.transform = "translateY(22px)";

      element.style.transition =
        `opacity 0.55s ease ${index * 0.05}s,
         transform 0.55s ease ${index * 0.05}s`;

    });


    const observer = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.style.opacity = "1";
          entry.target.style.transform =
            "translateY(0)";

          observer.unobserve(entry.target);

        });

      },
      {
        threshold: 0.1
      }
    );


    revealElements.forEach(element => {
      observer.observe(element);
    });

  }


  /* ---------- PROCESS LINE ---------- */

  const process = document.querySelector(".process");
  const progress = document.querySelector(".process-progress");


  if (process && progress) {

    const updateProcess = () => {

      const rect =
        process.getBoundingClientRect();

      const triggerPoint =
        window.innerHeight * 0.65;

      let percentage =
        (triggerPoint - rect.top) / rect.height;

      percentage =
        Math.max(0, Math.min(1, percentage));


      progress.style.height =
        `${percentage * 100}%`;

    };


    window.addEventListener(
      "scroll",
      updateProcess,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateProcess
    );

    updateProcess();

  }


  /* ---------- YEAR ---------- */

  const year =
    document.getElementById("yr");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }

});

/* =========================================================
   PRICING PAGE JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- FAQ ---------- */

  const pricingFaqs = document.querySelectorAll(
    ".pricing-faq .faq-item"
  );

  pricingFaqs.forEach((faq) => {

    faq.addEventListener("toggle", () => {

      if (!faq.open) return;

      pricingFaqs.forEach((otherFaq) => {

        if (otherFaq !== faq) {
          otherFaq.removeAttribute("open");
        }

      });

    });

  });


  /* ---------- Scroll Reveal ---------- */

  const revealItems = document.querySelectorAll(
    ".pricing-modern-card, .pricing-modern-table, .pricing-faq .faq-item, .pricing-process-section .process-step"
  );

  if ("IntersectionObserver" in window) {

    const pricingObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          entry.target.classList.add("pricing-visible");

          observer.unobserve(entry.target);

        });

      },
      {
        threshold: 0.12
      }
    );

    revealItems.forEach((item) => {
      item.classList.add("pricing-reveal");
      pricingObserver.observe(item);
    });

  }


  /* ---------- Pricing Card Tilt ---------- */

  const pricingCards = document.querySelectorAll(
    ".pricing-modern-card"
  );

  pricingCards.forEach((card) => {

    card.addEventListener("mousemove", (event) => {

      if (window.innerWidth <= 1000) return;

      const rect = card.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - 0.5;

      const y =
        (event.clientY - rect.top) / rect.height - 0.5;

      card.style.transform =
        `translateY(-9px) perspective(1000px)
         rotateX(${y * -2}deg)
         rotateY(${x * 2}deg)`;

    });

    card.addEventListener("mouseleave", () => {

      if (card.classList.contains("pricing-featured")) {
        card.style.transform = "translateY(-12px)";
      } else {
        card.style.transform = "translateY(0)";
      }

    });

  });


  /* ---------- Smooth Scroll ---------- */

  document.querySelectorAll(
    '.pricing-hero a[href^="#"]'
  ).forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId = link.getAttribute("href");

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


  /* ---------- Current Year ---------- */

  const yearElement = document.getElementById("yr");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* ---------- Pricing CTA Button Animation ---------- */

  document.querySelectorAll(
    ".pricing-btn, .pricing-hero .hero-btn"
  ).forEach((button) => {

    button.addEventListener("mouseenter", () => {

      const arrow = button.querySelector("span:last-child");

      if (arrow) {
        arrow.style.transform = "translateX(4px)";
      }

    });

    button.addEventListener("mouseleave", () => {

      const arrow = button.querySelector("span:last-child");

      if (arrow) {
        arrow.style.transform = "";
      }

    });

  });

});


/* =========================================================
   CONTACT PAGE — UI / ANIMATIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------------------------------
     CONTACT PAGE CHECK
  ------------------------------------------------------- */

  const contactForm = document.getElementById("leadForm");

  if (!contactForm) return;


  /* -------------------------------------------------------
     SCROLL REVEAL
  ------------------------------------------------------- */

  const revealElements = document.querySelectorAll(
    ".contact-info-card, .contact-form-card, .contact-process-section .process-step"
  );

  if ("IntersectionObserver" in window) {

    const contactObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          entry.target.classList.add("contact-visible");

          observer.unobserve(entry.target);

        });

      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element, index) => {

      element.classList.add("contact-reveal");

      element.style.transitionDelay =
        `${Math.min(index * 80, 320)}ms`;

      contactObserver.observe(element);

    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("contact-visible");
    });

  }


  /* -------------------------------------------------------
     HERO CARD TILT
  ------------------------------------------------------- */

  const heroCard = document.querySelector(
    ".contact-preview-card"
  );

  if (heroCard) {

    heroCard.addEventListener("mousemove", (event) => {

      if (window.innerWidth <= 950) return;

      const rect = heroCard.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - 0.5;

      const y =
        (event.clientY - rect.top) / rect.height - 0.5;

      heroCard.style.transform =
        `perspective(1000px)
         rotateX(${y * -2}deg)
         rotateY(${x * 2}deg)`;

    });

    heroCard.addEventListener("mouseleave", () => {

      heroCard.style.transform = "";

    });

  }


  /* -------------------------------------------------------
     INPUT FOCUS ANIMATION
  ------------------------------------------------------- */

  const fields = contactForm.querySelectorAll(
    "input, select, textarea"
  );

  fields.forEach((field) => {

    field.addEventListener("focus", () => {

      field.closest(".contact-field")
        ?.classList.add("field-focused");

    });

    field.addEventListener("blur", () => {

      field.closest(".contact-field")
        ?.classList.remove("field-focused");

    });

  });


  /* -------------------------------------------------------
     SUBMIT BUTTON LOADING UI
     
     IMPORTANT:
     This does NOT handle the WhatsApp submission.
     Your existing form logic remains responsible for that.
  ------------------------------------------------------- */

  contactForm.addEventListener("submit", () => {

    const submitButton =
      contactForm.querySelector(
        ".contact-submit-btn"
      );

    if (!submitButton) return;

    submitButton.classList.add("is-sending");

    submitButton.dataset.originalText =
      submitButton.innerHTML;

    submitButton.innerHTML =
      `Sending enquiry <span>→</span>`;

    /*
      Restore button after a short delay.
      If your existing JS redirects immediately
      to WhatsApp, this won't interfere.
    */

    setTimeout(() => {

      if (
        document.body.contains(submitButton) &&
        submitButton.classList.contains("is-sending")
      ) {

        submitButton.classList.remove("is-sending");

        if (submitButton.dataset.originalText) {
          submitButton.innerHTML =
            submitButton.dataset.originalText;
        }

      }

    }, 3500);

  });


  /* -------------------------------------------------------
     SMOOTH SCROLL
  ------------------------------------------------------- */

  document.querySelectorAll(
    '.contact-hero a[href^="#"]'
  ).forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId =
        link.getAttribute("href");

      const target =
        document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


  /* -------------------------------------------------------
     CTA / INFO LINK HOVER
  ------------------------------------------------------- */

  document.querySelectorAll(
    ".contact-info-item"
  ).forEach((item) => {

    item.addEventListener("mouseenter", () => {

      const arrow = item.querySelector("b");

      if (arrow) {
        arrow.style.transform =
          "translateX(4px)";
      }

    });

    item.addEventListener("mouseleave", () => {

      const arrow = item.querySelector("b");

      if (arrow) {
        arrow.style.transform = "";
      }

    });

  });

});

