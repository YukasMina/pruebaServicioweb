/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var URL_RESFULL = "http://localhost/wsdl/restfull.php";

// validacion de datos
function validar() {
    $.validator.addMethod("soloLetras", function(value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Solo letras");
    $.validator.addMethod("validaCedula", function(value, element) {
        return this.optional(element) || validarCedula(value);
    }, "Cedula no valida");
    // console.log("presenta datos");

    $("#idformModal").validate({
        rules: {
            txtcedula: {
                required: true,
                number: true,
                minlength: 10,
                maxlength: 13,
                validaCedula: true
            },
            txtnombre: {
                required: true,
                soloLetras: true,
                minlength: 4,
                maxlength: 25
            },
            txtapellido: {
                required: true,
                soloLetras: true,
                minlength: 4,
                maxlength: 25
            },
            txtdireccion: {
                required: true,
                soloLetras: true,
                minlength: 4,
                maxlength: 50
            },
            txttelefono: {
                required: true,
                number: true,
                minlength: 10
            },
            txtcelular: {
                required: true,
                number: true,
                minlength: 10
            },
            txtedad: {
                required: true,
                number: true,
                minlength: 1,
                maxlength: 2
            },
            txthabito: {
                required: true,
                minlength: 4,
                maxlength: 25
            },
            txtenfermedad: {
                //                required: true,
                minlength: 4,
                maxlength: 25
            },
            txteredada: {
                //                required: true,
                minlength: 4,
                maxlength: 25
            }
        },
        messages: {
            txtcedula: {
                required: "Ingresar un numero de cedula valido",
                minlength: $.format("Necesitamos por lo menos {0} caracteres"),
                maxlength: $.format("{0} caracteres son demasiados!")
            },
            txtnombre: {
                required: "Ingrese un nombre para el registro",
                minlength: $.format("Necesitamos por lo menos {0} caracteres"),
                maxlength: $.format("{0} caracteres son demasiados!")
            },
            txtapellido: {
                required: "Ingrese un apellido",
                minlength: $.format("Necesitamos por lo menos {0} caracteres"),
                maxlength: $.format("{0} caracteres son demasiados!")
            },
            txtdireccion: {
                required: "Ingrese un apellido",
                minlength: $.format("Necesitamos por lo menos {0} caracteres"),
                maxlength: $.format("{0} caracteres son demasiados!")
            },
            txttelefono: {
                required: "Ingresar un numero de cedula",
                minlength: $.format("Necesitamos por lo menos {0} caracteres")
            },
            txtcelular: {
                required: "Hey vamos, por favor, dános tu nombre",
                minlength: $.format("Necesitamos por lo menos {0} caracteres")
            },
            txtedad: {
                required: "Ingrese un numero valido",
                minlength: $.format("Necesitamos por lo menos {0} caracteres"),
                maxlength: $.format("{0} caracteres son demasiados!")
            },
            txthabito: {
                required: "Campo requerido",
                minlength: $.format("Necesitamos por lo menos {0} caracteres"),
                maxlength: $.format("{0} caracteres son demasiados!")
            },
            txtenfermedad: {
                //                required: true,
                minlength: $.format("Necesitamos por lo menos {0} caracteres"),
                maxlength: $.format("{0} caracteres son demasiados!")
            },
            txteredada: {
                //                required: true,
                minlength: $.format("Necesitamos por lo menos {0} caracteres"),
                maxlength: $.format("{0} caracteres son demasiados!")
            }
        },
        submitHandler: function(form) {
            guardarPac();
        }
    });
}

//carga pacientes en la tabla
function cargarPaciente() {
    //se nesecita laccion simpre
    var accion = "/listar_paciente";
    // console.log("Presenta token: " + localStorage["token"]);
    console.log(URL_RESFULL + accion);
    $.ajax({
        url: URL_RESFULL + accion,
        type: "GET",
        dataType: "json",
        //se envia el token
        headers: { "api-token": localStorage["token"] },
        //se envia la acion ya sea post o get
        // data: "accion=" + accion,
        //para enviar mas prametros
        // data: 'accion=' + accion +'&param1='+url,
        success: function(data, textStatus, jqXHR) {
            //convertir objeto a datos
            // var myJSON = JSON.stringify(data);
            // console.log("Presenta datos: " + myJSON);
            if (data.codigo) {
                manejoErroresJson(data.message, data.codigo);
            } else {
                var tabla = '';
                var botones = "<div class='btn-group'><button type='button' class='btn btn-danger' data-tooltip='tooltip' data-placement='top' title='Eliminar'><i class='fas fa-trash-alt'></i></button></div>&nbsp;";
                $.each(data, function(index, item) {
                    //se debe poner como esta index y item
                    var aux = $.param(item);
                    tabla += '<tr>';
                    tabla += '<td>' + (index + 1) + '</td>';
                    tabla += '<td>' + item.cedula + '</td>';
                    tabla += '<td>' + item.apellidos + " " + item.nombres + '</td>';
                    tabla += '<td>' + item.celular + '</td>';
                    tabla += '<td>' + item.direccion + '</td>';
                    tabla += '<td>' + item.fecha_nac + '</td>';
                    tabla += '<td><div class="btn-group"><a href="#" data-toggle="modal" data-target="#ModalPaciente" data-tooltip="tooltip" data-placement="top" title="Editar" class="btn btn-primary" onclick="cargardatosPaciente(' + " '" + aux + "'" + ')"><i class="far fa-edit"></i></a></div>&nbsp;';
                    tabla += '<div class="btn-group"><a href="#" data-toggle="modal" data-target="#modalHistorial" class="btn btn-info" data-tooltip="tooltip" data-placement="top" title="Historial"  onclick="cargarHistorial(' + " '" + item.external + "'" + ')"><i class="far fa-address-book"></i></a></div>&nbsp;' + botones;

                    tabla += '</td>'
                        // tabla += '<td><div class="btn-group"><a href="#" data-toggle="modal" data-target="#ModalPaciente" data-tooltip="tooltip" data-placement="top" title="Editar" class="btn btn-primary" onclick="obtenerPaciente(' + " '" + item.external + "'" + ')"><i class="far fa-edit"></i></a></div>&nbsp;' + botones + '</td>';
                    tabla += '</tr>';
                });
                $("#tabla_tbody").html(tabla);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    });
}

//para cargar datos de paciente en el modal de registro para modificarlos

function cargardatosPaciente(data) {

    //se conbierte la dat en Json
    var object1 = JSON.stringify(data);
    console.log("Presenta datos stringify: " + object1)
        //se comvierte el objeto1 en javascript
    var parseonj = $.parseJSON(object1);
    console.log("parseJson: " + parseonj);
    //     //Busca el dato %2B y lo remplaza por espacios 
    // var reemplazar = ' ';
    // var nuevoTexto = parseonj.replace(/%20/g, reemplazar);
    // nuevoTexto = nuevoTexto.replace(/%2C/g, reemplazar);
    // nuevoTexto = nuevoTexto.replace(/%0A/g, reemplazar);
    // presenta el nuevo data
    // console.log("Presenta datos parse: " + nuevoTexto);
    //decodifica los valores como es %20 %2C
    var nuevoTexto = decodeURIComponent(parseonj);

    //romper la cadena de texto por = & y se combierte en array con el split
    var rex = /[=&]+/;
    var resultado = nuevoTexto.split(rex);

    console.log(resultado);
    $('#btnGuardar').hide(); //muestro mediante id
    $("#btnModificar").show();
    $("#txtapellido").val(resultado[3]),
        $("#txtnombre").val(resultado[5]),
        $("#btnModificar").val(resultado[7]),
        $("#txtfechaNac").val(resultado[9]),
        $("#genero").val(resultado[11]),
        $("#txtdireccion").val(resultado[13]),
        $("#txtcelular").val(resultado[15]),
        $("#txttelefono").val(resultado[17]),
        $("#txthabito").val(resultado[19]),
        $("#txtenfermedad").val(resultado[21]),
        $("#txteredada").val(resultado[23]),
        $("#txtcedula").val(resultado[1]),
        $("#txtcedula").prop("disabled", true)
        // $("#external").val(resultado[7]);
    var edad = calcularEdad($("#txtfechaNac").val());
    $("#txtedad").val(edad);
}


//guardar paciente en le servicio web
function guardarPac() {
    var accion = "/guardar_paciente";
    // var extx= $("#external").val();
    // if (extx!=0) {
    //      accion = "/modificar_paciente"+external;
    // }

    var data = {
        "apellidos": $("#txtapellido").val(),
        "nombres": $("#txtnombre").val(),
        "fecha_nac": $("#txtfechaNac").val(),
        "direccion": $("#txtdireccion").val(),
        "edad": $("#txtedad").val(),
        "genero": $("#genero").val(),
        "celular": $("#txtcelular").val(),
        "habitos": $("#txthabito").val(),
        "enfermedades": $("#txtenfermedad").val(),
        "enfermedades_hederitarias": $("#txteredada").val(),
        "cedula": $("#txtcedula").val(),
        "telefono": $("#txttelefono").val()
    };
    var dataEnv = JSON.stringify(data);
    console.log(URL_RESFULL + accion);
    console.log(dataEnv);
    $.ajax({
        url: URL_RESFULL + accion,
        data: dataEnv,
        type: 'POST',
        headers: { "api-token": localStorage["token"] },
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
            console.log(data, textStatus, jqXHR);
            // alert("Data: " + data, "textStatus: " + textStatus, "jqXHR: " + jqXHR);
            if (data.codigo && data.codigo == "200") {
                // alert("guardado correctamente");
                // location.href = "Principal.html";
                limpiarModal();
                cargarPaciente();
                mensajeGuadado();
            } else {
                manejoErroresJson(data.message, data.codigo);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            manejoErroresJson(jqXHR, textStatus, errorThrown);
            console.log(jqXHR);
        }
    });

}

//obtener pacientes para modificar
function obtenerPaciente(external) {
    var accion = "/obtener_paciente/" + external;
    $.ajax({
        url: URL_RESFULL + accion,
        type: 'GET',
        dataType: 'json',
        headers: { "api-token": localStorage["token"] },
        success: function(data, textStatus, jqXHR) {
            if (data.codigo) {
                manejoErroresJson(data.message, data.codigo);
            } else {
                cargarDatosModal(data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            manejoErroresJson(jqXHR, textStatus, errorThrown);
            console.log(jqXHR);
        }
    });

}
//carga datos en el modal para ser modificados
function cargarDatosModal(data) {
    $("#btnModificar").val(data.external)
    $('#btnGuardar').hide(); //muestro mediante id
    $("#btnModificar").show();
    $("#txtapellido").val(data.apellidos),
        $("#txtnombre").val(data.nombres),
        $("#txtfechaNac").val(data.fecha_nac),
        $("#txtdireccion").val(data.direccion),
        $("#genero").val(data.genero),
        $("#txtcelular").val(data.celular),
        $("#txthabito").val(data.habitos),
        $("#txtenfermedad").val(data.enfermedades),
        $("#txteredada").val(data.enferm_heder),
        $("#txtcedula").val(data.cedula),
        $("#txttelefono").val(data.telefono),
        $("#txtcedula").prop("disabled", true)
    var edad = calcularEdad($("#txtfechaNac").val());
    $("#txtedad").val(edad);
}
//obtener pacientes para modificar
function modificarPaciente(external) {
    let externa_id = external.value;
    console.log("external: " + externa_id);
    var accion = "/modificar_paciente/" + externa_id;
    var data = {
        "apellidos": $("#txtapellido").val(),
        "nombres": $("#txtnombre").val(),
        "fecha_nac": $("#txtfechaNac").val(),
        "direccion": $("#txtdireccion").val(),
        "edad": $("#txtedad").val(),
        "genero": $("#genero").val(),
        "celular": $("#txtcelular").val(),
        "habitos": $("#txthabito").val(),
        "enfermedades": $("#txtenfermedad").val(),
        "enfermedades_hederitarias": $("#txteredada").val(),
        "cedula": $("#txtcedula").val(),
        "telefono": $("#txttelefono").val()
    };
    var dataEnv = JSON.stringify(data);
    console.log(URL_RESFULL + accion);
    console.log(dataEnv);
    $.ajax({
        url: URL_RESFULL + accion,
        data: dataEnv,
        type: 'POST',
        dataType: 'json',
        headers: { "api-token": localStorage["token"] },
        success: function(data, textStatus, jqXHR) {
            console.log(data, textStatus, jqXHR);
            // alert("Data: " + data, "textStatus: " + textStatus, "jqXHR: " + jqXHR);
            if (data.codigo && data.codigo == "200") {
                // alert("guardado correctamente");
                // location.href = "Principal.html";
                cargarPaciente();
                mensajeGuadado();
                cerrarModallimpio();
            } else {
                manejoErroresJson(data.message, data.codigo);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            manejoErroresJson(jqXHR, textStatus, errorThrown);
            console.log(jqXHR);
        }
    });

}

//carga historial en el modal
function cargarHistorial(external) {
    console.log(external);
    var accion = "/obtener_historial/" + external;
    $.ajax({
        url: URL_RESFULL + accion,
        type: 'GET',
        dataType: 'json',
        headers: { "api-token": localStorage["token"] },
        success: function(data, textStatus, jqXHR) {
            if (data.codigo) {
                manejoErroresJson(data.message, data.codigo);
            } else {
                $("#txthabito1").val(data.habitos),
                    $("#txtenfermedad1").val(data.enfermedades),
                    $("#txteredada1").val(data.enferm_heder);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            manejoErroresJson(jqXHR, textStatus, errorThrown);
            console.log(jqXHR);
        }
    });
}



//presentacion de mensaje de error
function manejoErroresJson(error, codigo) {
    if (codigo == "401") {
        error = "Hubo un eeror al monento de solisitar la informacion, por favor pongase en contacto ";
    }
    var mensaje = '<div class="alert alert-danger">';
    mensaje += error;
    mensaje += "</div>";
    $("#error").html(mensaje);
}
//presentacion de mensaje si se guada correctamente
function mensajeGuadado() {
    var mensaje1 = '';
    mensaje1 = "Pasiente Actualizado";
    var mensaje = '<div class="alert alert-success">';
    mensaje += mensaje1;
    mensaje += "</div>";
    $("#idmensaje").html(mensaje);
}

function limpiarModal() {
    //funcion limpiar modal al precionar el boton cerrar
    $("#btncancelar").on("click", function(event) {
        $('#idformModal').trigger("reset");
        $("#txtcedula").prop("disabled", false);
        $('#btnGuardar').show(); //muestro mediante id
        $("#btnModificar").hide();
    });
}

//limpiar modal a actualizar los datos o al guardar
function cerrarModallimpio() {
    $("#ModalPaciente .close").click();
    $('#idformModal').trigger("reset");
    $('#btnGuardar').show(); //muestro mediante id
    $("#btnModificar").hide();
}