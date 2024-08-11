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
    mostrarDatos(data);
  } catch (error) {
    console.error(error);
    alert("Error al cargar los datos del DNI");
  }

  // Agregar evento de clic al botón de retroceso
  const backButton = document.querySelector(".back-button");
  backButton.addEventListener("click", () => {
    const dni = localStorage.getItem("dni");
    if (dni) {
      window.location.href = `/public/MostrarDNI/mostrardni.html?dni=${dni}`;
    } else {
      alert("No se ha encontrado un DNI en el localStorage.");
    }
  });
};

function mostrarDatos(data) {
  const body = document.querySelector("body");

  const container = document.createElement("div");
  container.classList.add("container", "mt-4");

  // Añadir imagen de foto
  const fotoImg = document.createElement("img");
  fotoImg.src = `/data/fotos/${data.foto}`;
  fotoImg.alt = "Foto";
  fotoImg.style.display = "block";
  fotoImg.style.margin = "0 auto";
  fotoImg.style.width = "60px";
  fotoImg.style.height = "60px";

  // Añadir imagen de código de barras
  const barcodeImg = document.createElement("img");
  barcodeImg.src = "../../codigo_barras.png";
  barcodeImg.alt = "Código de Barras";
  barcodeImg.style.display = "block";
  barcodeImg.style.margin = "10px auto";
  barcodeImg.style.width = "250px";
  barcodeImg.style.height = "70px";

  container.appendChild(fotoImg);
  container.appendChild(barcodeImg);

  const dniContainer = document.createElement("div");
  dniContainer.classList.add("dni-container");

  const detalles = `
    <p><strong>Número de DNI:</strong> ${data.dniNumero}</p>
    <p><strong>Número de trámites:</strong> ${data.nroTramite}</p>
    <p><strong>Nombre:</strong> ${data.nombre}</p>
    <p><strong>Apellido:</strong> ${data.apellido}</p>
    <p><strong>Sexo:</strong> ${data.sexo}</p>
    <p><strong>Nacionalidad:</strong> ${data.nacionalidad}</p>
    <p><strong>Fecha de Nacimiento:</strong> ${data.fechaNacimiento}</p>
    <p><strong>Fecha de Emisión:</strong> ${data.fechaEmision}</p>
    <p><strong>Ejemplar:</strong> ${data.ejemplar}</p>
    <p><strong>Domicilio:</strong> ${data.domicilio}</p>
    <p><strong>Lugar de Nacimiento:</strong> ${data.lugarNacimiento}</p>
  `;

  dniContainer.innerHTML = detalles;
  container.appendChild(dniContainer);

  // Añadir imagen de firma
  const firmaImg = document.createElement("img");
  firmaImg.src = `/data/firmas/${data.firma}`;
  firmaImg.alt = "Firma";
  firmaImg.style.display = "block";
  firmaImg.style.marginLeft = "10px";
  firmaImg.style.width = "120px";
  firmaImg.style.height = "60px";

  const firmaContainer = document.createElement("div");
  firmaContainer.classList.add("firma-container");

  const firmaLabel = document.createElement("p");
  firmaLabel.innerHTML = "<strong>Firma:</strong>";
  firmaContainer.appendChild(firmaLabel);
  firmaContainer.appendChild(firmaImg);

  container.appendChild(firmaContainer);
  body.appendChild(container);
}
