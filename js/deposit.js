/* importar la fuction de crear transaccion */
import { crearTransaccion } from "./transaction.js";

$(window).on("load", function () {
  $("body").addClass("interfaz-lista");
});

//documento ready para que se ejecute el codigo despues de que el documento html este listo
$(document).ready(function () {
  // del <-menu---.
  // Creas el formateador para Chile
  let formateador = new Intl.NumberFormat("es-CL");
  /*  guardar el saldo en el localStorage  */
  let saldoGuardado = localStorage.getItem("saldo");
  let saldoActual;

  /* si el saldo no esta vacio */
  if (saldoGuardado !== null) {
    saldoActual = Number(saldoGuardado);
  } else {
    /* si el saldo esta vacio */
    saldoActual = 0;
    localStorage.setItem("saldo", saldoActual);
  }
  /* mostrar el saldo en la pantalla  */
  $("#saldoDisponible").text(formateador.format(saldoActual));

  // botones del deposit
  $("#depositar").click(function () {
    // Capturar el texto del input y quitarle espacios en blanco de los extremos
    let montoTexto = $("#monto").val().trim();

    // Convertir el texto a un número entero limpio (Base 10)
    let montoDeposito = parseInt(montoTexto, 10);

    // Creamos la transaccion de deposito
    {
      crearTransaccion("Deposito", montoDeposito);
    }

    // VALIDACIÓN: Verificar que el usuario ingresó un número real y mayor a cero
    if (isNaN(montoDeposito) || montoDeposito <= 0) {
      alert("Por favor, ingresa un monto válido para Depositar.");
      return; // Detiene el código aquí si hay un error
    }

    saldoActual += Number(montoTexto);
    // Guardar el nuevo saldo en el localStorage para mantenerlo actualizado
    localStorage.setItem("saldo", saldoActual);

    // Actualizar la pantalla con los puntos de miles
    $("#saldoDisponible").text(formateador.format(saldoActual));

    // Limpiar el campo de texto para que quede listo para otra operación
    $("#monto").val("");
    // Redirigir a la pantalla principal para ver el saldo actualizado
    window.location.href = "menu.html";
  });

  $("#retirar").click(function () {
    // Capturar el texto del input y quitarle espacios en blanco de los extremos
    let montoTexto = $("#monto").val().trim();

    // Convertir el texto a un número entero limpio (Base 10)
    let montoRetiro = parseInt(montoTexto, 10);

    // Si el monto es mayor al saldo actual, mostrar un mensaje de error
    if (montoRetiro > saldoActual) {
      alert(
        `No tienes suficiente saldo para retirar. Actualmente tienes: ${formateador.format(saldoActual)}`,
      );
      return; // Detiene el código aqui si hay un error
    } else {
      // Creamos la transaccion de retiro
      {
        crearTransaccion("Retiro", montoRetiro);
      }
    }

    // VALIDACIÓN: Verificar que el usuario ingresó un número real y mayor a cero
    if (isNaN(montoRetiro) || montoRetiro <= 0) {
      alert("Por favor, ingresa un monto válido para Retirar.");
      return; // Detiene el código aquí si hay un error
    }

    saldoActual -= Number(montoTexto);
    // Guardar el nuevo saldo en el localStorage para mantenerlo actualizado
    localStorage.setItem("saldo", saldoActual);

    // Actualizar la pantalla con los puntos de miles
    $("#saldoDisponible").text(formateador.format(saldoActual));

    // Limpiar el campo de texto para que quede listo para otra operación
    $("#monto").val("");
    // Redirigir a la pantalla principal para ver el saldo actualizado
    window.location.href = "menu.html";
  });
  // Fin botones del deposit

  //del <-menu--- a los diferentes html's --> deposit, sendmoney, transaction.
  $("#btn-deposit").on("click", function () {
    window.location.href = "deposit.html";
  });
  $("#btn-send").on("click", function () {
    window.location.href = "sendmoney.html";
  });
  $("#btn-move").on("click", function () {
    window.location.href = "transactions.html";
  });

  //Fin ---> menu
});
