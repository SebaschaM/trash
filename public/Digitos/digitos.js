document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("login-button")
    .addEventListener("click", function () {
      var pin = document.getElementById("pin").value;
      if (pin) {
        const dni = localStorage.getItem("dni");

        console.log("DNI:", dni);

        if (dni) {
          window.location.href = `/public/MostrarDNI/mostrardni.html?dni=${dni}`;
        } else {
          alert("DNI no encontrado en el localStorage");
        }
      } else {
        alert("Por favor, ingresa tu PIN.");
      }
    });

  document.getElementById("back-button").addEventListener("click", function () {
    window.location.href = "../Inicio/incio.html";
  });
});
