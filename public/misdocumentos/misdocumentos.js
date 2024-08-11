document.addEventListener("DOMContentLoaded", () => {
  const verDniButton = document.getElementById("verDniDigital");
  verDniButton.addEventListener("click", () => {
    window.location.href = "/public/Digitos/digitos.html";
  });

  const backButton = document.getElementById("backButton");
  backButton.addEventListener("click", () => {
    window.location.href = "/public/Inicio/incio.html";
  });
});