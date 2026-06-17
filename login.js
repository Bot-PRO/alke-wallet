$(window).on('load', function() {
    $("body").addClass("interfaz-lista");
});

//documento ready para que se ejecute el codigo despues de que el documento html este listo
$(document).ready(function(){

    // enviar formulario, login ---al--> menu
    $("#enviar-form").on("submit", function(evento){
        //previene el comportamiento por defecto debe de estar dentro del evento 
        evento.preventDefault();

        let email = $("#email").val();
        let pass = $("#password").val();

        if (email === "" || pass === ""){
            $("#mensaje-error").text("Por favor completa todos los campos.");
        }else{
            //debe de ser or para que compruebe. la logica: si, email o pass son incorrectos
            //si fuera con and  al ser correcto 1 ya pasaria ya que andamos comparando si son distintos.
            if (email !== "test@test.com" || pass !== "1234" ){
                $("#error-usuario-incorrecto").text("El usuario o la contraseña son incorrectos.");
            }else{
                //enviar formulario
                window.location.href = "menu.html";
                //$("#enviar-form").submit();       
            }
        }   
    });


});