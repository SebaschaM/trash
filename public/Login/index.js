document.addEventListener("DOMContentLoaded", () => {
  let container = document.getElementById("container");

  toggle = () => {
    container.classList.toggle("sign-in");
    container.classList.toggle("sign-up");
  };

  setTimeout(() => {
    container.classList.add("sign-in");
  }, 200);

  document
    .getElementById("loginForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const loginData = {
        usuario: username,
        contrasena: password,
      };

      try {
        const response = await fetch("https://server.miargentina.online/api/loginUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });

        const responseData = await response.json();

        console.log("Response data:", responseData);

        if (response.ok) {
          console.log("Login successful");
          localStorage.setItem("isLogged", "true");
          localStorage.setItem("username", responseData.nombreUsuario);
          localStorage.setItem("dni", responseData.dni);
          
          console.log("isLogged:", localStorage.getItem("isLogged"));
          console.log("username:", localStorage.getItem("username"));
          console.log("dni:", localStorage.getItem("dni"));

          window.location.href = responseData.urlRedirect;

          alert("Inicio de sesión exitoso");
        } else {
          alert("Error en login: " + (responseData.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        alert("Error en la conexión");
      }
    });
});
