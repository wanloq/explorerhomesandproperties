/**
 * Explorer Homes & Properties — main.js
 * ----------------------------------------------------------------------
 * Vanilla ES6+. No dependencies, no build step. Each feature is a small
 * self-contained module with an `init()` guarded by a DOM check, so this
 * single file can be safely included on every page.
 *
 * Modules:
 *  - ScrollProgress      top progress bar
 *  - Navbar              glass-on-scroll + mobile menu + scroll spy
 *  - Reveal              IntersectionObserver scroll reveal
 *  - Counters             animated number counters
 *  - Accordion           FAQ accordion
 *  - Testimonials        slider
 *  - Calculator          investment / mortgage calculator
 *  - ContactForm         client-side validation
 *  - Wishlist            saved-properties (localStorage)
 *  - BackToTop
 *  - RippleAndMagnetic    button micro-interactions
 *  - ThemeToggle          dark mode architecture
 *  - ImageFade            fade images in once loaded
 *  - PropertyFilter       client-side listing filter (properties.html)
 * ---------------------------------------------------------------------- */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- */
  /* Scroll progress bar                                               */
  /* ---------------------------------------------------------------- */
  const ScrollProgress = {
    init() {
      this.bar = document.querySelector("[data-scroll-progress]");
      if (!this.bar) return;
      window.addEventListener("scroll", () => this.update(), { passive: true });
      this.update();
    },
    update() {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      this.bar.style.width = pct + "%";
    },
  };

  /* ---------------------------------------------------------------- */
  /* Navbar: glass-on-scroll, mobile menu, scroll spy                  */
  /* ---------------------------------------------------------------- */
  const Navbar = {
    init() {
      this.nav = document.querySelector("[data-navbar]");
      if (!this.nav) return;
      this.toggleBtn = document.querySelector("[data-menu-toggle]");
      this.menu = document.querySelector("[data-mobile-menu]");
      this.closeBtn = document.querySelector("[data-menu-close]");
      this.overlay = document.querySelector("[data-menu-overlay]");
      this.links = document.querySelectorAll("[data-menu-link]");

      window.addEventListener("scroll", () => this.onScroll(), { passive: true });
      this.onScroll();

      if (this.toggleBtn) this.toggleBtn.addEventListener("click", () => this.openMenu());
      if (this.closeBtn) this.closeBtn.addEventListener("click", () => this.closeMenu());
      if (this.overlay) this.overlay.addEventListener("click", () => this.closeMenu());
      this.links.forEach((l) => l.addEventListener("click", () => this.closeMenu()));

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.closeMenu();
      });
    },
    onScroll() {
      if (window.scrollY > 24) {
        this.nav.classList.add("is-scrolled");
      } else {
        this.nav.classList.remove("is-scrolled");
      }
    },
    openMenu() {
      if (!this.menu) return;
      this.menu.classList.add("is-open");
      this.menu.removeAttribute("inert");
      document.body.classList.add("overflow-hidden");
      this.toggleBtn.setAttribute("aria-expanded", "true");
      const firstLink = this.menu.querySelector("a, button");
      if (firstLink) firstLink.focus();
    },
    closeMenu() {
      if (!this.menu) return;
      this.menu.classList.remove("is-open");
      this.menu.setAttribute("inert", "");
      document.body.classList.remove("overflow-hidden");
      if (this.toggleBtn) this.toggleBtn.setAttribute("aria-expanded", "false");
    },
  };

  /* ---------------------------------------------------------------- */
  /* Scroll reveal                                                     */
  /* ---------------------------------------------------------------- */
  const Reveal = {
    init() {
      const items = document.querySelectorAll("[data-reveal]");
      if (!items.length) return;

      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        items.forEach((el) => el.classList.add("is-visible"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );

      items.forEach((el, i) => {
        el.style.setProperty("--delay", (i % 6) * 70 + "ms");
        observer.observe(el);
      });
    },
  };

  /* ---------------------------------------------------------------- */
  /* Animated counters                                                  */
  /* ---------------------------------------------------------------- */
  const Counters = {
    init() {
      const counters = document.querySelectorAll("[data-counter]");
      if (!counters.length) return;

      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        counters.forEach((el) => (el.textContent = this.format(el)));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.animate(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((el) => observer.observe(el));
    },
    format(el) {
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || "";
      return target.toLocaleString() + suffix;
    },
    animate(el) {
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || "";
      const duration = 1800;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString() + suffix;
      };
      requestAnimationFrame(step);
    },
  };

  /* ---------------------------------------------------------------- */
  /* FAQ Accordion                                                      */
  /* ---------------------------------------------------------------- */
  const Accordion = {
    init() {
      const items = document.querySelectorAll("[data-accordion-item]");
      items.forEach((item) => {
        const trigger = item.querySelector("[data-accordion-trigger]");
        if (!trigger) return;
        trigger.addEventListener("click", () => {
          const isOpen = item.getAttribute("data-open") === "true";
          items.forEach((i) => {
            i.setAttribute("data-open", "false");
            const t = i.querySelector("[data-accordion-trigger]");
            if (t) t.setAttribute("aria-expanded", "false");
          });
          item.setAttribute("data-open", isOpen ? "false" : "true");
          trigger.setAttribute("aria-expanded", isOpen ? "false" : "true");
        });
      });
    },
  };

  /* ---------------------------------------------------------------- */
  /* Testimonials slider                                                */
  /* ---------------------------------------------------------------- */
  const Testimonials = {
    init() {
      this.root = document.querySelector("[data-testimonial-slider]");
      if (!this.root) return;
      this.track = this.root.querySelector("[data-testimonial-track]");
      this.slides = [...this.root.querySelectorAll("[data-testimonial-slide]")];
      this.dotsWrap = this.root.querySelector("[data-testimonial-dots]");
      this.prevBtn = this.root.querySelector("[data-testimonial-prev]");
      this.nextBtn = this.root.querySelector("[data-testimonial-next]");
      this.index = 0;
      this.timer = null;

      if (this.dotsWrap) {
        this.slides.forEach((_, i) => {
          const dot = document.createElement("button");
          dot.className = "testimonial-dot";
          dot.type = "button";
          dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
          dot.addEventListener("click", () => this.go(i));
          this.dotsWrap.appendChild(dot);
        });
        this.dots = [...this.dotsWrap.children];
      }

      if (this.prevBtn) this.prevBtn.addEventListener("click", () => this.go(this.index - 1));
      if (this.nextBtn) this.nextBtn.addEventListener("click", () => this.go(this.index + 1));

      this.root.addEventListener("mouseenter", () => this.stopAuto());
      this.root.addEventListener("mouseleave", () => this.startAuto());
      this.root.addEventListener("focusin", () => this.stopAuto());
      this.root.addEventListener("focusout", () => this.startAuto());

      this.render();
      this.startAuto();
    },
    go(i) {
      const len = this.slides.length;
      this.index = (i + len) % len;
      this.render();
    },
    render() {
      if (this.track) this.track.style.transform = `translateX(-${this.index * 100}%)`;
      if (this.dots) {
        this.dots.forEach((d, i) => d.classList.toggle("is-active", i === this.index));
      }
    },
    startAuto() {
      if (prefersReducedMotion) return;
      this.stopAuto();
      this.timer = setInterval(() => this.go(this.index + 1), 6000);
    },
    stopAuto() {
      if (this.timer) clearInterval(this.timer);
    },
  };

  /* ---------------------------------------------------------------- */
  /* Investment / mortgage calculator                                   */
  /* ---------------------------------------------------------------- */
  const Calculator = {
    init() {
      this.form = document.querySelector("[data-calculator]");
      if (!this.form) return;

      this.priceInput = this.form.querySelector("[data-calc-price]");
      this.depositInput = this.form.querySelector("[data-calc-deposit]");
      this.yearsInput = this.form.querySelector("[data-calc-years]");
      this.rateInput = this.form.querySelector("[data-calc-rate]");

      this.depositOut = this.form.querySelector("[data-calc-deposit-amount]");
      this.monthlyOut = this.form.querySelector("[data-calc-monthly]");
      this.totalOut = this.form.querySelector("[data-calc-total]");
      this.roiOut = this.form.querySelector("[data-calc-roi]");

      [this.priceInput, this.depositInput, this.yearsInput, this.rateInput].forEach((input) => {
        if (!input) return;
        input.addEventListener("input", () => {
          this.updateRangeFill(input);
          this.calculate();
        });
        this.updateRangeFill(input);
      });

      this.calculate();
    },
    updateRangeFill(input) {
      if (input.type !== "range") return;
      const min = parseFloat(input.min) || 0;
      const max = parseFloat(input.max) || 100;
      const val = parseFloat(input.value);
      const pct = ((val - min) / (max - min)) * 100;
      input.style.setProperty("--fill", pct + "%");
      const label = this.form.querySelector(`[data-calc-label-for="${input.dataset.calcName}"]`);
      if (label) label.textContent = input.dataset.calcDisplay ? input.dataset.calcDisplay(val) : val;
    },
    formatNaira(n) {
      return "₦" + Math.round(n).toLocaleString("en-NG");
    },
    calculate() {
      const price = parseFloat(this.priceInput?.value || 0);
      const depositPct = parseFloat(this.depositInput?.value || 0);
      const years = parseFloat(this.yearsInput?.value || 1);
      const annualRate = parseFloat(this.rateInput?.value || 0) / 100;

      const depositAmount = price * (depositPct / 100);
      const principal = price - depositAmount;
      const monthlyRate = annualRate / 12;
      const numPayments = years * 12;

      let monthly;
      if (monthlyRate === 0) {
        monthly = principal / numPayments;
      } else {
        monthly =
          (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1);
      }
      const total = monthly * numPayments + depositAmount;

      // Simple projected appreciation-based ROI assumption (8% p.a.) for illustration
      const projectedValue = price * Math.pow(1.08, years);
      const roi = ((projectedValue - price) / price) * 100;

      if (this.depositOut) this.depositOut.textContent = this.formatNaira(depositAmount);
      if (this.monthlyOut) this.monthlyOut.textContent = this.formatNaira(monthly);
      if (this.totalOut) this.totalOut.textContent = this.formatNaira(total);
      if (this.roiOut) this.roiOut.textContent = roi.toFixed(1) + "%";

      // Labels for the sliders themselves
      const priceLabel = this.form.querySelector("[data-calc-price-label]");
      if (priceLabel) priceLabel.textContent = this.formatNaira(price);
      const depositLabel = this.form.querySelector("[data-calc-deposit-label]");
      if (depositLabel) depositLabel.textContent = depositPct + "%";
      const yearsLabel = this.form.querySelector("[data-calc-years-label]");
      if (yearsLabel) yearsLabel.textContent = years + (years == 1 ? " year" : " years");
      const rateLabel = this.form.querySelector("[data-calc-rate-label]");
      if (rateLabel) rateLabel.textContent = (annualRate * 100).toFixed(1) + "%";
    },
  };

  /* ---------------------------------------------------------------- */
  /* Contact / inquiry form validation                                  */
  /* ---------------------------------------------------------------- */
  const ContactForm = {
    init() {
      const forms = document.querySelectorAll("[data-validate-form]");
      forms.forEach((form) => this.bind(form));
    },
    bind(form) {
      form.setAttribute("novalidate", "true");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        let valid = true;
        const fields = form.querySelectorAll("[data-field]");

        fields.forEach((field) => {
          const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);
          const value = field.value.trim();
          let fieldValid = true;
          let message = "";

          if (field.hasAttribute("required") && !value) {
            fieldValid = false;
            message = "This field is required.";
          } else if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            fieldValid = false;
            message = "Enter a valid email address.";
          } else if (field.type === "tel" && value && !/^[+\d][\d\s-]{6,}$/.test(value)) {
            fieldValid = false;
            message = "Enter a valid phone number.";
          }

          field.classList.toggle("border-red-400", !fieldValid);
          field.setAttribute("aria-invalid", fieldValid ? "false" : "true");
          if (errorEl) errorEl.textContent = fieldValid ? "" : message;
          if (!fieldValid) valid = false;
        });

        const successEl = form.querySelector("[data-form-success]");
        if (valid) {
          form.reset();
          fields.forEach((f) => f.classList.remove("border-red-400"));
          if (successEl) {
            successEl.classList.remove("hidden");
            successEl.setAttribute("tabindex", "-1");
            successEl.focus();
          }
        } else if (successEl) {
          successEl.classList.add("hidden");
          const firstInvalid = form.querySelector('[aria-invalid="true"]');
          if (firstInvalid) firstInvalid.focus();
        }
      });
    },
  };

  /* ---------------------------------------------------------------- */
  /* Wishlist (saved properties) — localStorage                        */
  /* ---------------------------------------------------------------- */
  const Wishlist = {
    KEY: "eh_saved_properties",
    init() {
      this.buttons = document.querySelectorAll("[data-wishlist-btn]");
      if (!this.buttons.length) return;
      const saved = this.getSaved();
      this.buttons.forEach((btn) => {
        const id = btn.dataset.wishlistBtn;
        const isSaved = saved.includes(id);
        btn.setAttribute("aria-pressed", isSaved ? "true" : "false");
        btn.addEventListener("click", () => this.toggle(btn, id));
      });
      this.updateCount();
    },
    getSaved() {
      try {
        return JSON.parse(localStorage.getItem(this.KEY)) || [];
      } catch {
        return [];
      }
    },
    toggle(btn, id) {
      let saved = this.getSaved();
      const isSaved = saved.includes(id);
      saved = isSaved ? saved.filter((x) => x !== id) : [...saved, id];
      localStorage.setItem(this.KEY, JSON.stringify(saved));
      btn.setAttribute("aria-pressed", isSaved ? "false" : "true");
      this.updateCount();
    },
    updateCount() {
      const countEls = document.querySelectorAll("[data-saved-count]");
      const count = this.getSaved().length;
      countEls.forEach((el) => (el.textContent = count));
    },
  };

  /* ---------------------------------------------------------------- */
  /* Back to top                                                        */
  /* ---------------------------------------------------------------- */
  const BackToTop = {
    init() {
      this.btn = document.querySelector("[data-back-to-top]");
      if (!this.btn) return;
      window.addEventListener(
        "scroll",
        () => this.btn.classList.toggle("is-visible", window.scrollY > 640),
        { passive: true }
      );
      this.btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
    },
  };

  /* ---------------------------------------------------------------- */
  /* Ripple + magnetic buttons                                         */
  /* ---------------------------------------------------------------- */
  const RippleAndMagnetic = {
    init() {
      document.querySelectorAll(".btn").forEach((btn) => {
        btn.addEventListener("click", (e) => this.ripple(e, btn));
      });

      if (window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion) {
        document.querySelectorAll(".btn-magnetic").forEach((btn) => this.magnetic(btn));
      }
    },
    ripple(e, btn) {
      const rect = btn.getBoundingClientRect();
      const span = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      span.className = "btn-ripple";
      span.style.width = span.style.height = size + "px";
      span.style.left = e.clientX - rect.left - size / 2 + "px";
      span.style.top = e.clientY - rect.top - size / 2 + "px";
      btn.appendChild(span);
      span.addEventListener("animationend", () => span.remove());
    },
    magnetic(btn) {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.28}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0, 0)";
      });
    },
  };

  /* ---------------------------------------------------------------- */
  /* Dark mode architecture                                             */
  /* ---------------------------------------------------------------- */
  const ThemeToggle = {
    KEY: "eh_theme",
    init() {
      this.toggles = document.querySelectorAll("[data-theme-toggle]");
      const stored = localStorage.getItem(this.KEY);
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDark = stored ? stored === "dark" : prefersDark;
      this.apply(isDark);

      this.toggles.forEach((btn) =>
        btn.addEventListener("click", () => {
          const nowDark = !document.documentElement.classList.contains("dark");
          this.apply(nowDark);
          localStorage.setItem(this.KEY, nowDark ? "dark" : "light");
        })
      );
    },
    apply(isDark) {
      document.documentElement.classList.toggle("dark", isDark);
      this.toggles.forEach((btn) => btn.setAttribute("aria-pressed", isDark ? "true" : "false"));
    },
  };

  /* ---------------------------------------------------------------- */
  /* Image fade-in once loaded                                          */
  /* ---------------------------------------------------------------- */
  const ImageFade = {
    init() {
      document.querySelectorAll("img.img-fade").forEach((img) => {
        if (img.complete) img.classList.add("is-loaded");
        else img.addEventListener("load", () => img.classList.add("is-loaded"));
      });
    },
  };

  /* ---------------------------------------------------------------- */
  /* Property listing filter (properties.html)                         */
  /* ---------------------------------------------------------------- */
  const PropertyFilter = {
    init() {
      this.form = document.querySelector("[data-filter-form]");
      this.cards = document.querySelectorAll("[data-property-item]");
      this.emptyState = document.querySelector("[data-filter-empty]");
      if (!this.form || !this.cards.length) return;

      this.form.addEventListener("input", () => this.apply());
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.apply();
      });
      this.apply();
    },
    apply() {
      const data = new FormData(this.form);
      const location = (data.get("location") || "").toString().toLowerCase();
      const type = (data.get("type") || "").toString().toLowerCase();
      const budget = parseFloat(data.get("budget")) || Infinity;

      let visibleCount = 0;
      this.cards.forEach((card) => {
        const cardLocation = (card.dataset.location || "").toLowerCase();
        const cardType = (card.dataset.type || "").toLowerCase();
        const cardPrice = parseFloat(card.dataset.price) || 0;

        const matchLocation = !location || cardLocation.includes(location);
        const matchType = !type || cardType === type;
        const matchBudget = cardPrice <= budget;

        const visible = matchLocation && matchType && matchBudget;
        card.classList.toggle("hidden", !visible);
        if (visible) visibleCount++;
      });

      if (this.emptyState) this.emptyState.classList.toggle("hidden", visibleCount !== 0);
    },
  };

  /* ---------------------------------------------------------------- */
  /* Boot                                                                */
  /* ---------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    ScrollProgress.init();
    Navbar.init();
    Reveal.init();
    Counters.init();
    Accordion.init();
    Testimonials.init();
    Calculator.init();
    ContactForm.init();
    Wishlist.init();
    BackToTop.init();
    RippleAndMagnetic.init();
    ThemeToggle.init();
    ImageFade.init();
    PropertyFilter.init();
  });
})();
