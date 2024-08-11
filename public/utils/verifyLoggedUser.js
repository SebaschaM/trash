function checkLoginStatus() {
  const isLogged = localStorage.getItem("isLogged");
  const username = localStorage.getItem("username");

  if (!isLogged || !username) {
    window.location.href = "../Login/index.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
});
