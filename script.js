
/* =========================================================
   OG WEB V2 - JAVASCRIPT
   Navigation, search, version popup, downloads and particles
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const searchInput = document.getElementById("siteSearch");
  const clearSearch = document.getElementById("clearSearch");
  const searchResultText = document.getElementById("searchResultText");
  const scrollTopButton = document.getElementById("scrollTopButton");
  const projectCards = Array.from(document.querySelectorAll("[data-project]"));
  const noResourceResults = document.getElementById("noResourceResults");

  /* MOBILE MENU */
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });

    document.addEventListener("click", (event) => {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      }
    });
  }

  /* SEARCH */
  function performSearch() {
    if (!searchInput) return;

    const query = searchInput.value.trim().toLowerCase();
    if (clearSearch) clearSearch.hidden = query.length === 0;

    let visibleCount = 0;

    projectCards.forEach((card) => {
      const searchableText = (
        (card.dataset.search || "") + " " + (card.textContent || "")
      ).toLowerCase();

      const matches = query === "" || searchableText.includes(query);
      card.style.display = matches ? "" : "none";
      if (matches) visibleCount++;
    });

    if (searchResultText) {
      if (query === "") {
        searchResultText.textContent = "";
      } else if (visibleCount === 0) {
        searchResultText.textContent = "No projects found.";
      } else {
        searchResultText.textContent =
          `${visibleCount} project${visibleCount === 1 ? "" : "s"} found.`;
      }
    }

    if (noResourceResults) {
      const resourceCards = projectCards.filter((card) =>
        Boolean(card.closest("#resource-packs"))
      );

      const visibleResourceCards = resourceCards.filter(
        (card) => card.style.display !== "none"
      );

      noResourceResults.hidden =
        query === "" || visibleResourceCards.length !== 0;
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", performSearch);

    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        searchInput.value = "";
        performSearch();
        searchInput.blur();
      }
    });
  }

  if (clearSearch) {
    clearSearch.addEventListener("click", () => {
      if (!searchInput) return;
      searchInput.value = "";
      performSearch();
      searchInput.focus();
    });
  }

  /* BACK TO TOP */
  function updateScrollButton() {
    if (scrollTopButton) {
      scrollTopButton.hidden = window.scrollY < 500;
    }
  }

  window.addEventListener("scroll", updateScrollButton, { passive: true });
  updateScrollButton();

  if (scrollTopButton) {
    scrollTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* VERSION SELECTOR POPUP */
  const versionSelects = document.querySelectorAll(".version-select");

  if (versionSelects.length) {
    const versionOverlay = document.createElement("div");
    versionOverlay.className = "og-version-overlay";
    versionOverlay.hidden = true;

    versionOverlay.innerHTML = `
      <div class="og-version-modal" role="dialog" aria-modal="true"
           aria-labelledby="og-version-title">
        <div class="og-version-modal-header">
          <div class="og-version-modal-title" id="og-version-title">
            Select Version
          </div>
          <button class="og-version-close" type="button"
                  aria-label="Close version selection">&times;</button>
        </div>
        <div class="og-version-modal-body">
          <span class="og-version-modal-label">Choose a Minecraft version</span>
          <div class="og-version-options"></div>
        </div>
      </div>`;

    document.body.appendChild(versionOverlay);

    const versionModalTitle =
      versionOverlay.querySelector("#og-version-title");
    const versionOptions =
      versionOverlay.querySelector(".og-version-options");
    const versionClose =
      versionOverlay.querySelector(".og-version-close");

    let activeVersionTrigger = null;

    function updateVersionTrigger(select, trigger) {
      const option = select.options[select.selectedIndex];
      const label =
        option && option.value
          ? option.textContent.trim()
          : "Select Version";

      const labelElement =
        trigger.querySelector(".popup-version-label");

      if (labelElement) labelElement.textContent = label;
      trigger.setAttribute("aria-expanded", "false");
    }

    function updateDownloadLink(select) {
      const card = select.closest(".project-card");
      const downloadButton =
        card?.querySelector("[data-download-button]");

      if (!downloadButton) return;

            // OG Pack: use the correct MediaFire link for each version.
      if (card.querySelector("h3")?.textContent.trim() === "OG Pack") {
        const version = select.value;

        if (version === "1.21.11") {
          downloadButton.href =
            "https://www.mediafire.com/file/or75dcje41qw2zy/OG-Pack-1.21.11.zip/file";
        } else if (version === "1.26.2" || version === "26.2") {
          downloadButton.href =
            "https://www.mediafire.com/file/8tgqlhnunc3xi3g/OG-Pack-26.2.zip/file";
        } else {
          downloadButton.removeAttribute("href");
          downloadButton.classList.add("version-required");
          return;
        }

        downloadButton.removeAttribute("download");
        downloadButton.classList.remove("version-required");
        downloadButton.removeAttribute("aria-disabled");
        return;
      }

      const baseFile = select.dataset.baseFile;
      const version = select.value;

      if (!baseFile || !version) {
        downloadButton.removeAttribute("href");
        downloadButton.removeAttribute("download");
        downloadButton.classList.add("version-required");
        return;
      }

      const extensionIndex = baseFile.lastIndexOf(".");

      if (extensionIndex <= 0) {
        downloadButton.removeAttribute("href");
        downloadButton.removeAttribute("download");
        downloadButton.classList.add("version-required");
        return;
      }

      const name = baseFile.slice(0, extensionIndex);
      const extension = baseFile.slice(extensionIndex);
      const fileName = `${name}-${version}${extension}`;

      downloadButton.href =
        `https://github.com/OGGamer-glitch/Resources-packs/raw/refs/heads/main/${encodeURIComponent(fileName)}`;

      downloadButton.setAttribute("download", fileName);
      downloadButton.classList.remove("version-required");
      downloadButton.removeAttribute("aria-disabled");
    }

    function closeVersionPopup() {
      versionOverlay.hidden = true;

      if (activeVersionTrigger) {
        activeVersionTrigger.setAttribute("aria-expanded", "false");
        activeVersionTrigger.focus();
      }

      activeVersionTrigger = null;
    }

    function openVersionPopup(select, trigger) {
      activeVersionTrigger = trigger;

      const card = select.closest(".project-card");
      const packTitle = card?.querySelector("h3")?.textContent.trim();

      versionModalTitle.textContent = packTitle || "Select Version";
      versionOptions.replaceChildren();

      Array.from(select.options).forEach((option) => {
        if (!option.value) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "og-version-option";
        button.textContent = option.textContent.trim();
        button.disabled = option.disabled;

        if (option.value === select.value) {
          button.classList.add("selected");
        }

        button.addEventListener("click", () => {
          select.value = option.value;
          select.dispatchEvent(new Event("change", { bubbles: true }));
          closeVersionPopup();
        });

        versionOptions.appendChild(button);
      });

      trigger.setAttribute("aria-expanded", "true");
      versionOverlay.hidden = false;
      versionClose.focus();
    }

    versionSelects.forEach((select) => {
      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "version-popup-trigger";
      trigger.setAttribute("aria-haspopup", "dialog");
      trigger.setAttribute("aria-expanded", "false");

      trigger.innerHTML = `
        <span class="popup-version-label">Select Version</span>
        <span class="popup-arrow" aria-hidden="true">⌄</span>`;

      select.insertAdjacentElement("afterend", trigger);
      select.classList.add("custom-version-ready");

      trigger.addEventListener("click", () => {
        openVersionPopup(select, trigger);
      });

      select.addEventListener("change", () => {
        updateVersionTrigger(select, trigger);
        updateDownloadLink(select);
      });

      updateVersionTrigger(select, trigger);

      // Disable versioned downloads until a version is selected.
      const card = select.closest(".project-card");
      const downloadButton =
        card?.querySelector("[data-download-button]");

      if (
        downloadButton &&
        card.querySelector("h3")?.textContent.trim() !== "OG Pack"
      ) {
        if (select.value) {
          updateDownloadLink(select);
        } else {
          downloadButton.removeAttribute("href");
          downloadButton.removeAttribute("download");
          downloadButton.classList.add("version-required");
        }
      }
    });

    versionClose.addEventListener("click", closeVersionPopup);

    versionOverlay.addEventListener("click", (event) => {
      if (event.target === versionOverlay) closeVersionPopup();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !versionOverlay.hidden) {
        closeVersionPopup();
      }
    });
  }

  /* DOWNLOAD BUTTON FEEDBACK */
  document.querySelectorAll(".download-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (!button.hasAttribute("href")) return;

      const originalText = button.textContent;
      button.textContent = "Starting...";

      window.setTimeout(() => {
        button.textContent = originalText;
      }, 1200);
    });
  });

  /* CLOSE MOBILE MENU ON DESKTOP */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 700 && mainNav && menuToggle) {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    }
  });

  /* IMAGE ERROR HANDLING */
  document
    .querySelectorAll(".project-image, .brand-logo, .hero-logo")
    .forEach((image) => {
      image.addEventListener("error", () => {
        image.classList.add("image-error");
      });
    });

  /* ACTIVE NAVIGATION */
  const navLinks = Array.from(document.querySelectorAll(".main-nav a"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  if ("IntersectionObserver" in window && navLinks.length && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const matches =
            link.getAttribute("href") === `#${entry.target.id}`;

          link.classList.toggle("active", matches);
        });
      });
    }, {
      rootMargin: "-25% 0px -65% 0px",
      threshold: 0
    });

    sections.forEach((section) => observer.observe(section));
  }

  /* OG WEB RED + WHITE CLICK/TAP PARTICLES */
  document.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const colors = ["red", "red", "red", "white", "white"];
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("span");

      particle.className =
        "og-click-particle " +
        colors[Math.floor(Math.random() * colors.length)];

      particle.style.left = `${event.clientX}px`;
      particle.style.top = `${event.clientY}px`;

      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 55;

      particle.style.setProperty(
        "--move-x",
        `${Math.cos(angle) * distance}px`
      );

      particle.style.setProperty(
        "--move-y",
        `${Math.sin(angle) * distance}px`
      );

      particle.addEventListener("animationend", () => {
        particle.remove();
      }, { once: true });

      fragment.appendChild(particle);
    }

    document.body.appendChild(fragment);
  });

  /* INITIALIZE */
  performSearch();
});
