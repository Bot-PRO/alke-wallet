$(window).on('load', function() {
    $("body").addClass("interfaz-lista");
});

$(document).ready(function(){

    // 1. Declaramos la base de datos al inicio para que esté accesible
    const CONTACTOS = [];

    // 2. Creamos una función encargada exclusivamente de pintar la lista
    function renderizarContactos() {
        // Limpiar el contenedor usando su ID único para evitar duplicados
        $("#contacts-list").empty();

        // Iterar e inyectar usando $.each de jQuery
        $.each(CONTACTOS, function(indice, contacto) {
            
            let itemHTML = `
            <li class="li-contacto list-group-item p-0 m-0" data-id="${contacto.id}">
                <button class="button-contact w-100 d-flex border-0 text-white py-3 px-3 mb-2">
                    
                    <div class="d-flex align-items-start gap-3">
                        <div class="d-flex align-items-center justify-content-center fw-bold rounded-circle alias-circle">
                            ${contacto.name ? contacto.name[0].toUpperCase() : (contacto.alias ? contacto.alias[0].toUpperCase() : "")}
                        </div>
                        <span class="contact-name fw-bold f-6 text-capitalize">${contacto.name}</span>
                    </div>

                    <div class="text-end d-flex align-items-end">
                        <small class="contact-name-small opacity-50">${contacto.alias} | Cuenta: ${contacto.tipocuenta}</small>
                    </div>
                    
                </button>
            </li>
            `;
            
            $("#contacts-list").append(itemHTML);
        });
    }

    // Ejecutamos la función una vez al cargar la página (por si ya hay datos iniciales)
    renderizarContactos();


    // 3. Lógica para capturar y guardar contactos
    // CAMBIO CLAVE: Escuchamos el 'submit' del FORMULARIO, no el click del botón de #guardar-contacto
    $(`#formulario-modal-agregar`).on("submit", function(e){
        // El navegador ya validó los 'required' antes de llegar a esta línea
        e.preventDefault(); // Ahora sí detenemos la recarga de página de forma segura

        const id = CONTACTOS.length + 1;
        const name = $(`#name-contacto`).val();
        const email = $(`#email-contacto`).val();
        const alias = $(`#alias-contacto`).val();
        const tipodecuenta = $(`#tipoDeCuenta`).val();
        
        CONTACTOS.push({
            id: id,
            name: name,
            email: email,
            alias: alias,
            tipocuenta: tipodecuenta
        });

        // Limpiar los inputs
        $(`#name-contacto`).val("");
        $(`#email-contacto`).val("");
        $(`#alias-contacto`).val("");
        $(`#tipoDeCuenta`).val("");
        $(`#number-contacto`).val("");

        // ¡Crucial! Volvemos a llamar a la función para actualizar la pantalla
        renderizarContactos();
    });

});