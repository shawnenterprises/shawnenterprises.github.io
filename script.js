document.querySelectorAll("a, button").forEach(el => {
  el.addEventListener("mouseover", () => {
    el.style.letterSpacing = "2px";
    setTimeout(() => {
      el.style.letterSpacing = "0px";
    }, 100);
  });
});

window.onload = () => {
  setTimeout(() => {
    document.getElementById("intro").style.display = "none";
  }, 1200);
};

let user = localStorage.getItem("citizen");

if(user){
  document.body.insertAdjacentHTML("afterbegin",
  "<div style='position:fixed; top:0; right:0; font-size:10px; padding:5px;'>STATUS: CITIZEN</div>");
}

function register() {
  localStorage.setItem("citizen", "true");

  document.getElementById("status").innerText =
  "STATUS: REGISTERED CITIZEN";
}
