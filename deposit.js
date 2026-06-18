$(window).on('load', function() {
    $("body").addClass("interfaz-lista");
});

//documento ready para que se ejecute el codigo despues de que el documento html este listo
$(document).ready(function(evento){
    evento.preventDefault();
    
    // del <-menu--- a los diferentes html --> deposit, sendmoney, transaction.

    $("#btn-deposit").on("click", function(){
        window.location.href = "deposit.html";
    });
    $("#btn-send").on("click", function(){
        window.location.href = "sendmoney.html";
    });
    $("#btn-move").on("click", function(){
        window.location.href = "transactions.html";
    });

    //Fin ---> menu
});