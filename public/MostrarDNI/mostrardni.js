window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const dniLocalStorage = localStorage.getItem("dni");
  const dniNumero = urlParams.get("dni");

  if (!dniNumero && !dniLocalStorage) {
    alert("No se ha proporcionado un DNI válido.");
    return;
  }

  if (dniLocalStorage !== dniNumero) {
    alert("DNI inválido");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/leerDatos/${dniNumero}`
    );
    if (!response.ok) {
      throw new Error("Datos no encontrados");
    }

    const data = await response.json();
    mostrarDNI(data);
  } catch (error) {
    console.error(error);
    alert("Error al cargar los datos del DNI");
  }

  // Agregar evento de clic al botón de retroceso
  const backButton = document.querySelector(".back-button");
  backButton.addEventListener("click", () => {
    window.location.href = "/public/Inicio/incio.html";
  });

  // Agregar evento de clic al botón de detalle
  const detailButton = document.querySelector(".btn-detail");
  detailButton.addEventListener("click", () => {
    const dni = localStorage.getItem("dni");
    if (dni) {
      window.location.href = `/public/DetalleDNI/DetalleDNI.html?dni=${dni}`;
    } else {
      alert("No se ha encontrado un DNI en el localStorage.");
    }
  });
};

const meses = {
  "01": { esp: "ENE", eng: "JAN" },
  "02": { esp: "FEB", eng: "FEB" },
  "03": { esp: "MAR", eng: "MAR" },
  "04": { esp: "ABR", eng: "APR" },
  "05": { esp: "MAY", eng: "MAY" },
  "06": { esp: "JUN", eng: "JUN" },
  "07": { esp: "JUL", eng: "JUL" },
  "08": { esp: "AGO", eng: "AUG" },
  "09": { esp: "SEP", eng: "SEP" },
  "10": { esp: "OCT", eng: "OCT" },
  "11": { esp: "NOV", eng: "NOV" },
  "12": { esp: "DIC", eng: "DEC" }
};

function formatearFecha(fecha) {
  const day = String(fecha.getDate()).padStart(2, "0");
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const year = fecha.getFullYear();
  return `${day} ${meses[month].esp} / ${meses[month].eng} ${year}`;
}

function formatearFechaNumeric(fecha) {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatearNumero(numero) {
  let numeroStr = numero.toString();
  let partes = [];
  while (numeroStr.length > 0) {
    partes.unshift(numeroStr.slice(-3));
    numeroStr = numeroStr.slice(0, -3);
  }
  return partes.join(".");
}

function mostrarDNI(data) {
  const dniContainer = document.getElementById("dniContainer");

  const imgFrente = document.createElement("canvas");
  const contextFrente = imgFrente.getContext("2d");
  const imgAtras = document.createElement("canvas");
  const contextAtras = imgAtras.getContext("2d");

  imgFrente.width = 500;
  imgFrente.height = 300;
  imgAtras.width = 500;
  imgAtras.height = 300;

  const imageFrente = new Image();
  imageFrente.src = "dni_frente_final.png";
  const imageAtras = new Image();
  imageAtras.src = "dni_atras.png";

  const fechaNacimiento = new Date(data.fechaNacimiento);
  const fechaVencimiento = new Date(fechaNacimiento);
  fechaVencimiento.setFullYear(fechaNacimiento.getFullYear() + 30);

  const fechaFormateada = formatearFecha(fechaVencimiento);
  const fechaFormateadaNumeric = formatearFechaNumeric(fechaVencimiento);

  imageFrente.onload = function () {
    contextFrente.drawImage(
      imageFrente,
      0,
      0,
      imgFrente.width,
      imgFrente.height
    );
    contextFrente.font =
      "500 16px 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
    contextFrente.fillStyle = "#000000";
    contextFrente.textAlign = "left";
    contextFrente.fillText(data.apellido.toUpperCase(), 152, 74);
    contextFrente.fillText(data.nombre.toUpperCase(), 152, 104);
    contextFrente.fillText(data.sexo === "Masculino" ? "M" : "F", 152, 135.5);
    contextFrente.fillText(data.nacionalidad.toUpperCase(), 220, 135.5);
    contextFrente.fillText(formatearFecha(new Date(data.fechaNacimiento)), 152, 167);
    contextFrente.fillText(formatearFecha(new Date(data.fechaEmision)), 152, 200);
    contextFrente.fillText(fechaFormateada, 152, 232);

    // Cambiar el tamaño de fuente y alinear el texto del DNI a la izquierda
    contextFrente.font =
      "bold 25px 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
    contextFrente.textAlign = "left";
    contextFrente.fillText(
      formatearNumero(data.dniNumero.toUpperCase()),
      15,
      290
    );

    // Restaurar el tamaño de fuente original para el texto
    contextFrente.font =
      "500 16px 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
    contextFrente.fillText(data.ejemplar.toUpperCase(), 380, 133);

    // Cambiar el tamaño de fuente y alinear el texto del número de trámite a la izquierda
    contextFrente.font =
      "500 16px 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
    contextFrente.textAlign = "left";

    // Dividir el número de trámite en dos líneas después del 11º carácter
    const nroTramite = data.nroTramite.toUpperCase();
    const firstLine = nroTramite.substring(0, 11);
    const secondLine = nroTramite.substring(11);

    contextFrente.fillText(firstLine, 177, 279);
    contextFrente.fillText(secondLine, 177, 296); // Ajusta la coordenada Y para la segunda línea

    const firmaImg = new Image();
    firmaImg.src = `/data/firmas/${data.firma}`;
    firmaImg.onload = function () {
      contextFrente.drawImage(firmaImg, 380, 135, 120, 60);
    };

    const fotoImg = new Image();
    fotoImg.src = `/data/fotos/${data.foto}`;
    fotoImg.onload = function () {
      contextFrente.drawImage(fotoImg, 30, 85, 120, 140);
    };
  };

  imageAtras.onload = function () {
    contextAtras.drawImage(imageAtras, 0, 0, imgAtras.width, imgAtras.height);

    // Domicilio y Lugar de Nacimiento
    contextAtras.font = "500 14.5px 'Segoe UI'";
    contextAtras.fillStyle = "black";
    contextAtras.textAlign = "left";
    contextAtras.fillText(data.domicilio.toUpperCase(), 98, 26);
    contextAtras.fillText(data.lugarNacimiento.toUpperCase(), 197, 51);
    // Formato MRZ
    contextAtras.font = "24.2px 'Segoe UI'";
    const dniNumberFormatted = `IDARG${data.dniNumero
      .toString()
      .padEnd(9, "<")}1`;
    const birthDateFormatted = `${data.fechaNacimiento.replace(/-/g, "")}`;
    const sexFormatted = data.sexo[0].toUpperCase();
    const expirationDateFormattedNumeric = `${fechaFormateadaNumeric.replace(/-/g, "")}`;
    const nationalityFormatted = "ARG";
    const apellidoFormatted = data.apellido.toUpperCase().replace(/ /g, "<");
    const nombreFormatted = data.nombre.toUpperCase().replace(/ /g, "<");

    const maxLineLength = 30; // Máximo número de caracteres en una línea MRZ
    const apellidoNombre = `${apellidoFormatted}<<${nombreFormatted}`;
    const remainingLength = maxLineLength - apellidoNombre.length;
    const dynamicFill = "<".repeat(remainingLength);

    const line1 = `${dniNumberFormatted}${"<".repeat(
      maxLineLength - dniNumberFormatted.length
    )}`;
    const line2 = `${birthDateFormatted}${sexFormatted}${expirationDateFormattedNumeric}${nationalityFormatted}${"<".repeat(
      maxLineLength -
        birthDateFormatted.length -
        sexFormatted.length -
        expirationDateFormattedNumeric.length -
        nationalityFormatted.length -
        1
    )}<3`;
    const line3 = `${apellidoFormatted}<<${nombreFormatted}${dynamicFill}`;

    contextAtras.textAlign = "left";
    contextAtras.fillText(line1, 20, imgAtras.height - 90);
    contextAtras.fillText(line2, 20, imgAtras.height - 63);
    contextAtras.fillText(line3, 19, imgAtras.height - 36);
  };


  // Mostrar nombre y apellido en el HTML
  const nombreApellidoElement = document.getElementById("nombreApellido");
  nombreApellidoElement.textContent = `${data.nombre} ${data.apellido}`;

  const frontDiv = dniContainer.querySelector(".flip-card-front");
  const backDiv = dniContainer.querySelector(".flip-card-back");

  frontDiv.appendChild(imgFrente);
  backDiv.appendChild(imgAtras);
}
