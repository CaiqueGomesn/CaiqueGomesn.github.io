document.addEventListener("DOMContentLoaded", () => {
  const footerYear = document.querySelector("#current-year");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});
