document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-link").forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  const yearTarget = document.getElementById("current-year");
  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  window.registerReveal = (root = document) => {
    root.querySelectorAll("[data-reveal]").forEach((item) => {
      if (!item.classList.contains("is-visible")) {
        revealObserver.observe(item);
      }
    });
  };

  window.registerReveal();
});
