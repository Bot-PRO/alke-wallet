// -----
// 1. Historial de transacciones
// -----
const historialGuardado = localStorage.getItem("historial");
const Historial = historialGuardado ? JSON.parse(historialGuardado) : [];

export function crearTransaccion(tipo, monto, contacto = null) {
  // 1. Creamos la transaccion
  const transaccion = {
    id: Date.now(),
    tipo: tipo,
    monto: monto,
    fecha: new Date().toLocaleString("es-CL", { hour12: false }),
    contacto: contacto,
  };

  // 2. Guardar la transaccion
  Historial.push(transaccion);
  //console.log(Historial);
  // 3. Guardar el localStorage
  localStorage.setItem("historial", JSON.stringify(Historial));
  return transaccion;
}

$(window).on("load", function () {
  $("body").addClass("interfaz-lista");
});

$(document).ready(function () {
  let formateador = new Intl.NumberFormat("es-CL");
  // -----
  // 2. Estado y datos en memoria
  // -----
  const CONTACTOS = [];

  // -----
  // 3. Validación de contactos duplicados
  // -----
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

  // -----
  // 4. Persistencia con localStorage
  // -----

  function cargarContactos() {
    const guardados = localStorage.getItem("contactos");
    if (guardados) {
      const parseados = JSON.parse(guardados); // parse es para que sea un array de objetos
      // Limpiamos y rellenamos el array en memoria
      CONTACTOS.splice(0, CONTACTOS.length); // splice lo limpia y lo rellena de nuevo.
      CONTACTOS.push(...parseados);
    }
  }

  function guardarContactos() {
    localStorage.setItem("contactos", JSON.stringify(CONTACTOS));
  }

  // -----
  // 5. Renderizado de contactos
  // -----

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
                <button type="button" class="tarjeta-contacto w-100 d-flex border-0 text-white py-3 px-3 mb-2">
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

  // -----
  // 6. Inicio de la interfaz
  // -----
  cargarContactos();
  renderizarContactos();

  // -----
  // 7. Agregar nuevo contacto
  // -----
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

  // -----
  // 8. Buscar contactos existentes
  // -----
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
        $(".item-contacto[data-id=\"" + contacto.id + "\"]").show("slow");
      } else {
        /* usamos hide para ocultar el contacto  */
        $(".item-contacto[data-id=\"" + contacto.id + "\"]").hide("slow");
      }
    });
  });

  // -----
  // 9. Eliminar datos guardados
  // -----

  function eliminarCttGuardados() {
    localStorage.removeItem("contactos");
    location.reload();
  }

  function eliminarsaldo() {
    localStorage.removeItem("saldo");
    location.reload();
  }

  function eliminarhistorial() {
    localStorage.removeItem("historial");
    location.reload();
  }

  // -----
  // 10. Mostrar historial de transacciones
  // -----
  // Antes del forEach, defines los colores
  function colorPorTipo(tipo) {
    if (tipo === "Deposito") return "fw-bold color-texto-deposito "; // verde
    if (tipo === "Retiro") return "fw-bold color-texto-retiro "; // rojo
    return "fw-bold color-texto-transferencia "; // amarillo para envíos
  }
  function fondoPorTipo(tipo) {
    if (tipo === "Deposito") return " rounded-pill color-fondo-deposito"; // verde
    if (tipo === "Retiro") return "rounded-pill color-fondo-retiro"; // rojo
    return "rounded-pill color-fondo-transferencia"; // amarillo para envíos
  }

  // Solo corre si estamos en transactions.html
  if ($("#transaction-list").length) {
    const guardadoHistorial = localStorage.getItem("historial");
    const historial = guardadoHistorial ? JSON.parse(guardadoHistorial) : [];
    //console.log(historial);

    const historialOrdenado = [...historial].sort(function (a, b) {
      return b.id - a.id;
    });

    if (historialOrdenado.length === 0) {
      $("#transaction-list").append(`
        <li class="list-group-item text-center opacity-50">
          No hay transacciones registradas.
        </li>
      `);
    } else {
      historialOrdenado.forEach(function (transaccion) {
        const tipocolor = colorPorTipo(transaccion.tipo);
        const fondocolor = fondoPorTipo(transaccion.tipo);
        $("#transaction-list").append(`
          <li class="transferencia-lista  mb-2 d-flex justify-content-between align-items-center">
            <div class="d-flex flex-column w-100">
              
              <div class="d-flex align-items-center w-50">
                <strong class="text-white p-2 ${fondocolor}">${transaccion.tipo}</strong>
              </div>
              
              <div class="d-flex align-items-center justify-content-between my-1">
                <strong class="text-white p-2 ${transaccion.contacto ? fondocolor : ``} ">${transaccion.contacto ? ` Para: ${transaccion.contacto.name[0].toUpperCase() + transaccion.contacto.name.slice(1)}` : ""}</strong>
                <span class="${tipocolor} fw-bold fs-5">
                ${transaccion.contacto || transaccion.tipo === "Retiro" ? "-" : ""}$${formateador.format(transaccion.monto)}
                </span>
              </div>

              <div class="d-flex align-items-center w-50 ">
                <small class="d-block text-white  ${fondocolor}">${transaccion.fecha}</small>
              </div>
            </div>
          </li>
        `);
      });
    }
  }

  // -----
  // 11. Transferir dinero y actualizar saldo
  // -----
  if ($("#modal-transferencia").length) {
    let contactoSeleccionado = null;
    const modalTransferencia = new bootstrap.Modal( // una vez aquí
      document.getElementById("modal-transferencia"),
    );

    $("#lista-contactos").on("click", ".tarjeta-contacto", function () {
      const id = $(this).closest("li").data("id");
      contactoSeleccionado = CONTACTOS.find((c) => c.id == id);
      //console.log(contactoSeleccionado);
      $("#modal-nombre-contacto").text(
        contactoSeleccionado.name[0].toUpperCase() +
          contactoSeleccionado.name.slice(1),
      );
      $("#modal-cuenta-contacto").text(contactoSeleccionado.tipocuenta);

      let saldo = Number(localStorage.getItem("saldo"));
      $("#modal-saldo-disponible").text(formateador.format(saldo));

      modalTransferencia.show(); // siempre la misma instancia
    });

    $("#btn-confirmar-transferencia").on("click", function () {
      // saldo actual
      let saldo = Number(localStorage.getItem("saldo"));
      // monto ingresado
      let montoInput = $("#input-monto-transferencia").val().trim(); // captura el input
      // monto a transferir parseado
      let monto = parseInt(montoInput, 10);

      // validaciones...
      if (isNaN(monto) || monto <= 0) {
        alert("Por favor, ingresa un monto valido y mayor a 0.");
        return;
      } else if (monto > saldo) {
        alert("No tienes suficiente saldo para realizar esta transferencia");
        return;
      }
      // actualizar el saldo
      let saldoActual = saldo - monto;

      localStorage.setItem("saldo", saldoActual);
      $("#saldoDisponible").text(formateador.format(saldoActual));
      crearTransaccion("Transferencia", monto, contactoSeleccionado);

      $("#input-monto-transferencia").val("");
      modalTransferencia.hide();
    });
  }
});
