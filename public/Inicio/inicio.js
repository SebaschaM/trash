// Verifica si el usuario está logueado
function checkLoginStatus() {
  const isLogged = localStorage.getItem("isLogged");
  const username = localStorage.getItem("username");

  if (!isLogged || !username) {
    window.location.href = "../Login/index.html";
  }
}

// Llama a la función cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();

  // Agrega el evento click al ícono de "Mis documentos"
  const misDocumentos = document.getElementById("misDocumentos");
  misDocumentos.addEventListener("click", () => {
    window.location.href = "/public/misdocumentos/misdocumentos.html";
  });

  // Agrega el evento click al ícono de "Cerrar Sesión"
  const logout = document.getElementById("loggout");
  logout.addEventListener("click", () => {
    localStorage.clear(); // Limpiar el localStorage
    window.location.href = "../Login/index.html"; // Redirigir a la página de inicio de sesión
  });
});