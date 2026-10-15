/* =========================================================
   OG WEB V2 - JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  const searchInput = document.getElementById("siteSearch");
  const clearSearch = document.getElementById("clearSearch");
  const searchResultText =
    document.getElementById("searchResultText");

  const scrollTopButton =
    document.getElementById("scrollTopButton");

  const projectCards = Array.from(
    document.querySelectorAll("[data-project]")
  );

  const noResourceResults =
    document.getElementById("noResourceResults");

  /* =======================================================
     MOBILE MENU
  ======================================================= */

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuToggle.setAttribute(
        "aria-label",
        isOpen
          ? "Close navigation"
          : "Open navigation"
      );
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        menuToggle.setAttribute(
          "aria-label",
          "Open navigation"
        );
      });
    });

    document.addEventListener("click", (event) => {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        mainNav.classList.remove("open");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        menuToggle.setAttribute(
          "aria-label",
          "Open navigation"
        );
      }
    });
  }

  /* =======================================================
     SEARCH
  ======================================================= */

  function performSearch() {
    if (!searchInput) return;

    const query =
      searchInput.value.trim().toLowerCase();

    if (clearSearch) {
      clearSearch.hidden = query.length === 0;
    }

    let visibleCount = 0;

    projectCards.forEach((card) => {
      const searchableText = (
        (card.dataset.search || "") +
        " " +
        (card.textContent || "")
      ).toLowerCase();

      const matches =
        query === "" ||
        searchableText.includes(query);

      card.style.display = matches
        ? ""
        : "none";

      if (matches) {
        visibleCount++;
      }
    });

    if (searchResultText) {
      if (query === "") {
        searchResultText.textContent = "";
      } else if (visibleCount === 0) {
        searchResultText.textContent =
          "No projects found.";
      } else {
        searchResultText.textContent =
          `${visibleCount} project${
            visibleCount === 1 ? "" : "s"
          } found.`;
      }
    }

    if (noResourceResults) {
      const resourceCards =
        projectCards.filter((card) => {
          return Boolean(
            card.closest("#resource-packs")
          );
        });

      const visibleResourceCards =
        resourceCards.filter((card) => {
          return card.style.display !== "none";
        });

      noResourceResults.hidden =
        query === "" ||
        visibleResourceCards.length !== 0;
    }
  }

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      performSearch
    );

    searchInput.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") {
          searchInput.value = "";
          performSearch();
          searchInput.blur();
        }
      }
    );
  }

  /* =======================================================
     CLEAR SEARCH
  ======================================================= */

  if (clearSearch) {
    clearSearch.addEventListener("click", () => {
      if (!searchInput) return;

      searchInput.value = "";
      performSearch();
      searchInput.focus();
    });
  }

  /* =======================================================
     BACK TO TOP
  ======================================================= */

  function updateScrollButton() {
    if (!scrollTopButton) return;

    scrollTopButton.hidden =
      window.scrollY < 500;
  }

  window.addEventListener(
    "scroll",
    updateScrollButton,
    {
      passive: true
    }
  );

  updateScrollButton();

  if (scrollTopButton) {
    scrollTopButton.addEventListener(
      "click",
      () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    );
  }

  
  }
/* =========================================================
   VERSION SELECTORS — OG CUSTOM POPUP
========================================================= */

const versionSelects = document.querySelectorAll(".version-select");

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
  </div>
`;
document.body.appendChild(versionOverlay);

const versionModal = versionOverlay.querySelector(".og-version-modal");
const versionModalTitle = versionOverlay.querySelector("#og-version-title");
const versionOptions = versionOverlay.querySelector(".og-version-options");
const versionClose = versionOverlay.querySelector(".og-version-close");

let activeVersionSelect = null;
let activeVersionTrigger = null;

function updateVersionTrigger(select, trigger) {
  const selectedOption = select.options[select.selectedIndex];
  const label = selectedOption && selectedOption.value
    ? selectedOption.textContent.trim()
    : "Select Version";

  trigger.querySelector(".popup-version-label").textContent = label;
  trigger.setAttribute("aria-expanded", "false");
}

function closeVersionPopup() {
  versionOverlay.hidden = true;

  if (activeVersionTrigger) {
    activeVersionTrigger.setAttribute("aria-expanded", "false");
    activeVersionTrigger.focus();
  }

  activeVersionSelect = null;
  activeVersionTrigger = null;
}

function openVersionPopup(select, trigger) {
  activeVersionSelect = select;
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
      updateVersionTrigger(select, trigger);
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
    <span class="popup-arrow" aria-hidden="true">⌄</span>
  `;

  select.insertAdjacentElement("afterend", trigger);
  select.classList.add("custom-version-ready");

  trigger.addEventListener("click", () => {
    openVersionPopup(select, trigger);
  });

  select.addEventListener("change", () => {
    updateVersionTrigger(select, trigger);
  });

  updateVersionTrigger(select, trigger);
});

versionClose.addEventListener("click", closeVersionPopup);

versionOverlay.addEventListener("click", (event) => {
  if (event.target === versionOverlay) {
    closeVersionPopup();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !versionOverlay.hidden) {
    closeVersionPopup();
  }
});

  /* =======================================================
     DOWNLOAD BUTTON FEEDBACK
  ======================================================= */

  document
    .querySelectorAll(".download-button")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const originalText =
            button.textContent;

          button.textContent =
            "Starting...";

          window.setTimeout(() => {

            button.textContent =
              originalText;

          }, 1200);
        }
      );
    });

  /* =======================================================
     CLOSE MOBILE MENU ON DESKTOP
  ======================================================= */

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth > 700 &&
        mainNav &&
        menuToggle
      ) {

        mainNav.classList.remove(
          "open"
        );

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        menuToggle.setAttribute(
          "aria-label",
          "Open navigation"
        );
      }
    }
  );

  /* =======================================================
     IMAGE ERROR HANDLING
  ======================================================= */

  document
    .querySelectorAll(
      ".project-image, .brand-logo, .hero-logo"
    )
    .forEach((image) => {

      image.addEventListener(
        "error",
        () => {

          image.classList.add(
            "image-error"
          );

        }
      );
    });

  /* =======================================================
     ACTIVE NAVIGATION
  ======================================================= */

  const navLinks = Array.from(
    document.querySelectorAll(
      ".main-nav a"
    )
  );

  const sections = Array.from(
    document.querySelectorAll(
      "main section[id]"
    )
  );

  if (
    "IntersectionObserver" in window &&
    navLinks.length &&
    sections.length
  ) {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }

              navLinks.forEach(
                (link) => {

                  const matches =
                    link.getAttribute(
                      "href"
                    ) ===
                    `#${entry.target.id}`;

                  link.classList.toggle(
                    "active",
                    matches
                  );

                }
              );

            }
          );

        },
        {
          rootMargin:
            "-25% 0px -65% 0px",

          threshold: 0
        }
      );

    sections.forEach(
      (section) => {
        observer.observe(section);
      }
    );
  }

  /* =======================================================
     INITIALIZE
  ======================================================= */

  performSearch();

});
