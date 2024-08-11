document.addEventListener("DOMContentLoaded", () => {
  const verDniButton = document.getElementById("verDniDigital");
  verDniButton.addEventListener("click", () => {
    window.location.href = "/Digitos/digitos.html";
  });

  const backButton = document.getElementById("backButton");
  backButton.addEventListener("click", () => {
    window.location.href = "/Inicio/incio.html";
  });
});