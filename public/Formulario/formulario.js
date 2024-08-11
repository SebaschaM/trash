const canvas = document.getElementById("signature-canvas");
const context = canvas.getContext("2d");

let initialX;
let initialY;
let correccionX = 0;
let correccionY = 0;

let posicion = canvas.getBoundingClientRect();
correccionX = posicion.x;
correccionY = posicion.y;

const dibujar = (cursorX, cursorY) => {
  context.beginPath();
  context.moveTo(initialX, initialY);
  context.lineWidth = 1;
  context.strokeStyle = "#000";
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineTo(cursorX, cursorY);
  context.stroke();

  initialX = cursorX;
  initialY = cursorY;
};

async function generarDNI() {
  // Validar el formulario
  const form = document.getElementById("form");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Obtener los valores del formulario
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const sexo = document.getElementById("sexo").value;
  const nacionalidad = document.getElementById("nacionalidad").value;
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;
  const fechaEmision = document.getElementById("fechaEmision").value;
  const dniNumero = document.getElementById("dniNumero").value;
  const domicilio = document.getElementById("domicilio").value;
  const lugarNacimiento = document.getElementById("lugarNacimiento").value;
  const nroTramite = document.getElementById("nro_tramite").value;
  const ejemplar = document.getElementById("ejemplar").value;

  // Captura la firma del canvas
  const canvas = document.getElementById("signature-canvas");
  const firmaBase64 = canvas.toDataURL("image/png"); // Convertir a Base64

  // Crear un archivo de la firma
  const firmaFile = await fetch(firmaBase64)
    .then((res) => res.blob())
    .then((blob) => new File([blob], "firma.png", { type: "image/png" }));

  // Obtener la foto seleccionada
  const fotoFile = document.getElementById("foto").files[0];
  const username = localStorage.getItem("username");

  // Crear el objeto de datos a enviar
  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("apellido", apellido);
  formData.append("sexo", sexo);
  formData.append("nacionalidad", nacionalidad);
  formData.append("fechaNacimiento", fechaNacimiento);
  formData.append("fechaEmision", fechaEmision);
  formData.append("dniNumero", dniNumero);
  formData.append("domicilio", domicilio);
  formData.append("lugarNacimiento", lugarNacimiento);
  formData.append("nroTramite", nroTramite);
  formData.append("ejemplar", ejemplar);
  formData.append("firma", firmaFile);
  formData.append("username", username);
  if (fotoFile) {
    formData.append("foto", fotoFile);
  }

  try {
    // Enviar datos al servidor
    const response = await fetch("https://server.miargentina.online/api/guardarDatos", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      form.reset();
      localStorage.clear();
      clearCanvas();

      window.location.href = `../Login/index.html`;
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("isLogged");
      const errorText = await response.text();
      window.location.href = `../Login/index.html`;
      alert("Error al guardar los datos: " + errorText);
    }
  } catch (error) {
    console.error("Error al enviar los datos:", error);
    if (error instanceof TypeError) {
      alert("Error de red. Verifica tu conexión a internet.");
    } else if (error instanceof SyntaxError) {
      alert("Error en la estructura del JSON. Contacta al administrador.");
    } else {
      alert("Error desconocido. Contacta al administrador.");
    }
  }
}

function previewFile() {
  const preview = document.getElementById("foto-preview");
  const file = document.getElementById("foto").files[0];
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    function () {
      preview.src = reader.result;
      preview.style.display = "block";
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);
  }
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

const mouseDown = (evt) => {
  evt.preventDefault();
  if (evt.changedTouches === undefined) {
    initialX = evt.offsetX;
    initialY = evt.offsetY;
  } else {
    //evita desfase al dibujar
    initialX = evt.changedTouches[0].pageX - correccionX;
    initialY = evt.changedTouches[0].pageY - correccionY;
  }
  dibujar(initialX, initialY);
  canvas.addEventListener("mousemove", mouseMoving);
  canvas.addEventListener("touchmove", mouseMoving);
};

const mouseMoving = (evt) => {
  evt.preventDefault();
  if (evt.changedTouches === undefined) {
    dibujar(evt.offsetX, evt.offsetY);
  } else {
    dibujar(
      evt.changedTouches[0].pageX - correccionX,
      evt.changedTouches[0].pageY - correccionY
    );
  }
};

const mouseUp = () => {
  canvas.removeEventListener("mousemove", mouseMoving);
  canvas.removeEventListener("touchmove", mouseMoving);
};

canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);

//pantallas tactiles
canvas.addEventListener("touchstart", mouseDown);
canvas.addEventListener("touchend", mouseUp);
