/* Mail link fix — opens the visitor's default email client. */
(() => {
  const EMAIL = "ambersaxenaa@gmail.com";

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="mailto:"]');
    if (!link) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    window.location.href =
      "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent("Portfolio Contact");
  }, true);
})();
