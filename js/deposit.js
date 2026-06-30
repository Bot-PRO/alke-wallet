/*
 1. Importar función de transacción
*/
import { crearTransaccion } from "./transaction.js"; // trae la función que guarda cada movimiento

// -----
// 1. Interfaz al cargar la página
// -----
$(window).on("load", function () {
  $("body").addClass("interfaz-lista"); // agrega clase de estilo al cargar
});

// -----
// 2. Lógica de depósito y retiro
// -----
$(document).ready(function () {
  const formateador = new Intl.NumberFormat("es-CL"); // formatea números en estilo chileno
  let saldoGuardado = localStorage.getItem("saldo"); // lee saldo del almacenamiento local
  let saldoActual = saldoGuardado !== null ? Number(saldoGuardado) : 0; // inicializa saldo

  if (saldoGuardado === null) {
    localStorage.setItem("saldo", saldoActual); // guarda saldo inicial si no existe
  }

  $("#saldoDisponible").text(formateador.format(saldoActual)); // muestra saldo en pantalla

  function actualizarSaldo(nuevoSaldo) {
    saldoActual = nuevoSaldo; // actualiza la variable local
    localStorage.setItem("saldo", saldoActual); // guarda el saldo actualizado
    $("#saldoDisponible").text(formateador.format(saldoActual)); // actualiza el texto del saldo
  }

  function limpiarMonto() {
    $("#monto").val(""); // limpia el campo de monto
  }

  // -----
  // 2.1 Depositar saldo
  // -----
  $("#depositar").click(function () {
    const montoTexto = $("#monto").val().trim(); // lee el valor del input
    const montoDeposito = parseInt(montoTexto, 10); // convierte el valor a número entero

    if (isNaN(montoDeposito) || montoDeposito <= 0) {
      alert("Por favor, ingresa un monto válido para Depositar.");
      return;
    }

    saldoActual += montoDeposito; // suma el depósito al saldo
    localStorage.setItem("saldo", saldoActual); // guarda el nuevo saldo
    crearTransaccion("Deposito", montoDeposito); // registra la transacción
    $("#saldoDisponible").text(formateador.format(saldoActual)); // actualiza el saldo mostrado
    limpiarMonto(); // borra el campo de monto
    window.location.href = "menu.html"; // vuelve al menú
  });

  // -----
  // 2.2 Retirar saldo
  // -----
  $("#retirar").click(function () {
    const montoTexto = $("#monto").val().trim(); // lee el valor del input
    const montoRetiro = parseInt(montoTexto, 10); // convierte el valor a número entero

    if (isNaN(montoRetiro) || montoRetiro <= 0) {
      alert("Por favor, ingresa un monto válido para Retirar.");
      return;
    }

    if (montoRetiro > saldoActual) {
      alert(`No tienes suficiente saldo para retirar. Actualmente tienes: ${formateador.format(saldoActual)}`);
      return;
    }

    saldoActual -= montoRetiro; // resta el retiro del saldo
    localStorage.setItem("saldo", saldoActual); // guarda el saldo actualizado
    crearTransaccion("Retiro", montoRetiro); // registra la transacción
    $("#saldoDisponible").text(formateador.format(saldoActual)); // muestra el saldo actualizado
    limpiarMonto(); // borra el campo de monto
    window.location.href = "menu.html"; // vuelve al menú
  });

  // -----
  // 3. Navegación del menú
  // -----
  $("#btn-deposit").on("click", function () {
    window.location.href = "deposit.html"; // abre formulario de depósito
  });

  $("#btn-send").on("click", function () {
    window.location.href = "sendmoney.html"; // abre pantalla de transferencias
  });

  $("#btn-move").on("click", function () {
    window.location.href = "transactions.html"; // abre historial de transacciones
  });
});
