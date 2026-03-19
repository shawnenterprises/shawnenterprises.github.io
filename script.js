document.querySelectorAll("a, button").forEach(el => {
  el.addEventListener("mouseover", () => {
    el.style.letterSpacing = "2px";
    setTimeout(() => {
      el.style.letterSpacing = "0px";
    }, 100);
  });
});
