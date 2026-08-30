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

  /* =======================================================
     VERSION SELECTORS
  ======================================================= */

  document
    .querySelectorAll(".version-select")
    .forEach((select) => {

      const card =
        select.closest(".project-card");

      if (!card) return;

      const downloadButton =
        card.querySelector(
          "[data-download-button]"
        );

      if (!downloadButton) return;

      const baseFile =
        select.dataset.baseFile || "";

      const releaseUrl =
        select.dataset.releaseUrl || "";

      /*
        The download button starts disabled
        until a version is selected.
      */

      downloadButton.classList.add(
        "version-required"
      );

      downloadButton.setAttribute(
        "aria-disabled",
        "true"
      );

      downloadButton.title =
        "Select a Minecraft version first.";

      select.addEventListener(
        "change",
        () => {

          const version =
            select.value;

          if (!version) {

            downloadButton.classList.add(
              "version-required"
            );

            downloadButton.setAttribute(
              "aria-disabled",
              "true"
            );

            downloadButton.title =
              "Select a Minecraft version first.";

            return;
          }

          downloadButton.classList.remove(
            "version-required"
          );

          downloadButton.removeAttribute(
            "aria-disabled"
          );

          downloadButton.removeAttribute(
            "title"
          );

          /*
            Versioned files use this format:

            OG-Pack-1.21.11.zip
            OG-Pack-1.21.10.zip
            OG-Pack-1.21.1.zip
          */

          if (releaseUrl) {

  if (version === "all") {
    downloadButton.href = releaseUrl;
    return;
  }

  downloadButton.href = releaseUrl;
  return;
}

if (version === "all") {

  downloadButton.href =
    baseFile;

  return;
}
          const dot =
            baseFile.lastIndexOf(".");

          const extension =
            dot >= 0
              ? baseFile.slice(dot)
              : "";

          const name =
            dot >= 0
              ? baseFile.slice(0, dot)
              : baseFile;

          downloadButton.href =
            `${name}-${version}${extension}`;
        }
      );

      /*
        Prevent download when no version
        has been selected.
      */

      downloadButton.addEventListener(
        "click",
        (event) => {

          if (!select.value) {

            event.preventDefault();

            select.focus();

            select.setCustomValidity(
              "Please select a Minecraft version first."
            );

            select.reportValidity();

            window.setTimeout(() => {
              select.setCustomValidity("");
            }, 1200);
          }
        }
      );
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
