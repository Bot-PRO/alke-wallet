// -----
// 1. Interfaz al cargar la página
// -----
$(window).on('load', function() {
    $("body").addClass("interfaz-lista"); // aplica la clase visual al body
});

// -----
// 2. Login: validación del formulario
// -----
$(document).ready(function() {
    const CREDENCIALES_VALIDAS = {
        email: "test@test.com",
        password: "1234"
    };

    $("#enviar-form").on("submit", function(evento) {
        evento.preventDefault(); // evita el envío estándar del formulario

        const email = $("#email").val().trim(); // lee email sin espacios extras
        const pass = $("#password").val().trim(); // lee contraseña sin espacios extras

        $("#mensaje-error").text(""); // limpia error de campos vacíos
        $("#error-usuario-incorrecto").text(""); // limpia error de credenciales

        // 2.1 Validar campos vacíos
        if (email === "" || pass === "") {
            $("#mensaje-error").text("Por favor completa todos los campos.");
            return;
        }

        // 2.2 Validar usuario y contraseña
        if (email !== CREDENCIALES_VALIDAS.email || pass !== CREDENCIALES_VALIDAS.password) {
            $("#error-usuario-incorrecto").text("El usuario o la contraseña son incorrectos.");
            return;
        }

        // 2.3 Redirigir a menú
        window.location.href = "menu.html";
    });
});
