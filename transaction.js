$(window).on("load", function () {
  $("body").addClass("interfaz-lista");
});

$(document).ready(function () {
  // -----------------------------------------------------------
  // ESTADO: array en memoria que es la fuente de verdad
  // -----------------------------------------------------------
  const CONTACTOS = [];

  // -----------------------------------------------------------
  // VALIDACIÓN: detecta si el contacto ya existe por nombre, alias o número de cuenta
  // -----------------------------------------------------------
  function buscarDuplicado(nuevoContacto) {
    for (let contacto of CONTACTOS) {
      // estamos aignando y comparando si un alias/numerocuenta ya existe. o sea duplicado
      const mismoAlias =
        contacto.alias &&
        nuevoContacto.alias &&
        contacto.alias.toLowerCase() === nuevoContacto.alias.toLowerCase();

      const mismoNumero =
        contacto.numerocuenta &&
        nuevoContacto.numerocuenta &&
        contacto.numerocuenta === nuevoContacto.numerocuenta;

      if (mismoAlias) return "alias"; // aqui retormamos si existe el alias duplicado.
      if (mismoNumero) return "número de cuenta";
    }
    return null; // No hay duplicado
  }

  // -----------------------------------------------------------
  // PERSISTENCIA: cargar y guardar en localStorage
  // -----------------------------------------------------------

  function cargarContactos() {
    const guardados = localStorage.getItem("contactos");
    if (guardados) {
      const parseados = JSON.parse(guardados); // parse es para que sea un array de objetos
      // Limpiamos y rellenamos el array en memoria
      CONTACTOS.splice(0, CONTACTOS.length);
      CONTACTOS.push(...parseados);
    }
  }

  function guardarContactos() {
    localStorage.setItem("contactos", JSON.stringify(CONTACTOS));
  }

  // -----------------------------------------------------------
  // RENDER: solo lee CONTACTOS y pinta el DOM
  // -----------------------------------------------------------

  function renderizarContactos() {
    $("#lista-contactos").empty();

    if (CONTACTOS.length === 0) {
      $("#lista-contactos").append(`
                <li class="item-contacto list-group-item p-0 m-0">
                    <div class="d-flex align-items-center justify-content-center w-100 h-100">
                        <span class="text-white opacity-30">No hay contactos registrados.</span>
                    </div>
                </li>
            `);
      return; // No hay nada más que hacer
    }

    // Ordenamos por nombre o alias antes de pintar
    CONTACTOS.sort((a, b) => {
      const nameA = (a.name || a.alias).toLowerCase();
      const nameB = (b.name || b.alias).toLowerCase();
      return nameA.localeCompare(nameB);
    });

    $.each(CONTACTOS, function (indice, contacto) {
      const inicial = contacto.name
        ? contacto.name[0].toUpperCase()
        : contacto.alias[0].toUpperCase();

      const itemHTML = `
            <li class="item-contacto list-group-item p-0 m-0" data-id="${contacto.id}">
                <button class="tarjeta-contacto w-100 d-flex border-0 text-white py-3 px-3 mb-2">
                    <div class="d-flex align-items-start gap-3">
                        <div class="d-flex align-items-center justify-content-center fw-bold rounded-circle avatar-inicial-contacto">
                            ${inicial}
                        </div>
                        <span class="nombre-contacto fw-bold f-6 text-capitalize">${contacto.name}</span>
                    </div>
                    <div class="text-end d-flex align-items-end">
                        <small class="info-alias-cuenta opacity-50">${contacto.alias} | Cuenta: ${contacto.tipocuenta}</small>
                    </div>
                </button>
            </li>`;

      $("#lista-contactos").append(itemHTML);
    });
  }

  // -----------------------------------------------------------
  // INICIO: cargar datos y pintar
  // -----------------------------------------------------------
  cargarContactos();
  renderizarContactos();

  // -----------------------------------------------------------
  // EVENTO: agregar nuevo contacto
  // -----------------------------------------------------------
  $("#formulario-agregar-contacto").on("submit", function (e) {
    e.preventDefault();

    const nuevoContacto = {
      id: Date.now(),
      name: $("#input-nombre-contacto").val().trim(),
      email: $("#input-email-contacto").val().trim(),
      alias: $("#input-alias-contacto").val().trim(),
      tipocuenta: $("#select-tipo-cuenta").val(),
      numerocuenta: $("#input-numero-cuenta").val().trim(), // ← antes se limpiaba pero nunca se guardaba
    };

    // Revisamos si algún campo ya existe antes de agregar
    const campoDuplicado = buscarDuplicado(nuevoContacto);

    if (campoDuplicado) {
      // Mostramos feedback y salimos sin agregar ni limpiar el form
      $("#mensaje-duplicado")
        .text(`Ya existe un contacto con ese ${campoDuplicado}.`)
        .removeClass("d-none");
      return;
    }

    // Si no hay duplicado, limpiamos el mensaje, guardamos y renderizamos
    $("#mensaje-duplicado").addClass("d-none");

    CONTACTOS.push(nuevoContacto);
    guardarContactos();
    renderizarContactos();
    this.reset();
  });

  // -----------------------------------------------------------
  // EVENTO: buscar contacto existente -buscador inteligente
  // -----------------------------------------------------------
  $(".input-busqueda-contacto").on("keyup", function () {
    /* Capturamos y Convertimos el texto de busqueda a minúsculas */
    const textoBusqueda = this.value.toLowerCase();
    /* Capturamos los contactos guardados */
    const guardados = localStorage.getItem("contactos");
    /* Convertimos los contactos a un array */
    const contactos = JSON.parse(guardados);

    /* Recorremos los contactos y mostramos o ocultamos según el texto de busqueda */
    contactos.forEach((contacto) => {
      const nombre = contacto.name.toLowerCase();
      /* Comparamos el nombre del contacto con el texto de busqueda */
      if (nombre.includes(textoBusqueda)) {
        /* usamos show para mostrar el contacto */
        $(`.item-contacto[data-id="${contacto.id}"]`).show();
      } else {
        /* usamos hide para ocultar el contacto  */
        $(`.item-contacto[data-id="${contacto.id}"]`).hide();
      }
    });
  });

  // -----------------------------------------------------------
  // Eliminar lo del localStorage
  // -----------------------------------------------------------

  function eliminarCttGuardados() {
    localStorage.removeItem("contactos");
    location.reload();
  }

  /* function eliminarsaldo() {
  localStorage.removeItem("contactos");
  location.reload();
} */
});
