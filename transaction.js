$(window).on('load', function() {
    $("body").addClass("interfaz-lista");
});

//documento ready para que se ejecute el codigo despues de que el documento html este listo
$(document).ready(function(){

    //logica de base de datos contactos registrados  --> sendMoney.html

    const CONTACTOS = [
        {id:1, name: "Emir Paredes", email: "9i2Ct@example.com", alias: "Eme", tipoCuenta: "Débito"},
        {id:2, name: "Samuel Hernandez", email: "i2jCt@example.com", alias: "Samul", tipoCuenta: "Master card"},
        {id:3, name: "Julio martinez", email: "askuCt@example.com", alias: "Chico julio", tipoCuenta: "Prepago"},
        {id:4, name: "Fernando lopez", email: "554wwdt@example.com", alias: "Fer", tipoCuenta: "Crédito"},
        {id:5, name: "homero jay. simpson", email: "4sda6e8@example.com", alias: "Homer", tipoCuenta: "Débito"},
        {id:6, name: "", email: "4sda6e8@example.com", alias: "Fer", tipoCuenta: "Débito"}
    ];

    // 2. Limpiar el contenedor usando su ID único para evitar duplicados
    $("#contacts-list").empty();

    // 3. Iterar e inyectar usando $.each de jQuery
    $.each(CONTACTOS, function(indice, contacto) {
        
        // Inyectamos las propiedades de tu objeto usando ${contacto.propiedad}
        let itemHTML = `
        <li class="bg-white list-group-item p-0 m-0 " data-id="${contacto.id}">

            <!-- Contenedor Principal -->
            <button class="button-contact w-100 d-flex  border-0 text-white p-3 my-0">
                
                <!-- Contenedor Izquierdo: Inicial + Nombre -->
                <div class="d-flex align-items-start gap-3">
                    <div class="d-flex align-items-center justify-content-center fw-bold rounded-circle alias-circle";">
                        ${contacto.name ? contacto.name[0].toUpperCase(): ""}
                    </div>
                    <span class="contact-name fw-bold text-capitalize">${contacto.name}</span>
                </div>

                <!-- Contenedor Derecho: Alias y Cuenta -->
                <div class="text-end d-flex align-items-end ">
                    <small class="contact-name-small opacity-50">${contacto.alias} | Cuenta: ${contacto.tipoCuenta}</small>
                </div>
                
            </button>
        </li>
        `;
        
        // jQuery busca el ID exacto en el HTML y pega el bloque en su interior (del ID "contacts-list")
        $("#contacts-list").append(itemHTML);
    });
    



    // Fin --> sendMoney.html

});