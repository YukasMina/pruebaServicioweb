var URL_SOAP = "http://localhost/wsdl/index.php?wsdl";

function cambiarColor(component) {
    component.style.color = "#ADBCFF";
}

function cambiarColorInput(component) {
    var color = component.value;
    var txts = document.getElementsByTagName("input");
    for (var i = 0; i < txts.length; i++) {
        if (txts[i].type == 'text')
            txts[i].style.color = color;
    }

}

function calcularEdad(fecha) {
    // var fecha = document.getElementById("txtfechaNac");
    var hoy = new Date();
    var cumpleanos = new Date(fecha);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }
    console.log("TIENES: " + edad + " ANIOS")
    return edad;
}

function cargarEspecialidades() {
    var peticion = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">';
    peticion += '<Body>';
    peticion += '<lista_especialidades xmlns="urn:server"/>';
    peticion += '</Body>';
    peticion += '</Envelope>';
    $.ajax({
        url: URL_SOAP,
        data: peticion,
        type: 'POST',
        dataType: 'xml',
        contentType: 'text/xml',
        success: function(data, textStatus, jqXHR) {
            console.log(textStatus + " " + jqXHR.status);
            var xml = jqXHR.responseXML;
            var xmlChange = $.parseXML(xml);
            var option = '';
            $(xml).text(xmlChange).find("item").each(function() {
                var id = $(this).find("id").text();
                var nombre = $(this).find("nombre").text();
                option += '<option value="' + nombre + '">' + nombre + '</option>';
            });
            $("#idespecialidad").html(option);
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    });

}

function cargarMedicos() {
    var peticion = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">';
    peticion += '<Body>';
    peticion += '<medicos_listado xmlns="urn:server">';
    peticion += '<token>' + localStorage["token"] + '</token>';
    peticion += '</medicos_listado>';
    peticion += '</Body>';
    peticion += '</Envelope>';
    $.ajax({
        url: URL_SOAP,
        data: peticion,
        type: 'POST',
        dataType: 'xml',
        contentType: 'text/xml',
        success: function(data, textStatus, jqXHR) {
            console.log(textStatus + " " + jqXHR.status);
            var xml = jqXHR.responseXML;
            var xmlChange = $.parseXML(xml);
            var tabla = '';
            $(xml).text(xmlChange).find("item").each(function() {
                console.log("llega para prsentar medicos");
                var id = $(this).find("id").text();
                var nombre = $(this).find("nombre").text();
                tabla += '<tr>';
                tabla += '<td>' + id + '</td>';
                tabla += '<td>' + item.cedula + '</td>';
                tabla += '<td>' + item.apellidos + ' ' + item.nombres + '</td>';
                tabla += '<td>' + item.nro_reg + '</td>';
                tabla += '<td>' + item.especialidad + '</td>';
                tabla += '<td></td>';
                tabla += '</tr>';
            });
            $("#idespecialidad").html(tabla);
            $("#error").html('<div class="alert alert-success">' + "cargado con exito" + '</div>');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            manejoErrores(jqXHR.responseText);
        }
    });

}

// ingreso de datos
function insertarDatos() {
    var message1 = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">';
    message1 += '<Body>';
    message1 += '<registro_medico xmlns="urn:server">';
    message1 += '<cedula>' + $("#txtcedula").val() + '</cedula>';
    message1 += '<apellidos>' + $("#txtapellido").val() + '</apellidos>';
    message1 += '<nombres>' + $("#txtnombre").val() + '</nombres>';
    message1 += '<especialidad>' + $("#idespecialidad").val() + '</especialidad>';
    message1 += '<correo>' + $("#txtcorreo").val() + '</correo>';
    message1 += '<nro_reg>' + $("#txtregistro").val() + '</nro_reg>';
    message1 += '<clave>' + $("#txtclave").val() + '</clave>';
    message1 += '</registro_medico>';
    message1 += '</Body>';
    message1 += '</Envelope>';
    console.log(" " + message1);
    $.ajax({
        url: URL_SOAP,
        data: message1,
        type: 'POST',
        contentType: 'text/xml',
        dataType: 'xml',

        success: function(data, textStatus, jqXHR) {
            if (jqXHR.status == '200') {
                limpiaModal();
                var mensaje = '<div class="alert alert-success"> Se ha registrado su cuenta, por favor inicie sesion! </div>';
                $("#mensaje").html(mensaje);

                // alert("Se ha registrado su cuenta, por favor inicie
                // sesion!");
                // location.href = "login.html";
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            manejoErrores(jqXHR.responseText);
        }
    });
}

// validar inicio de session
function inicioSession() {

    var message1 = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">';
    message1 += '<Body>';
    message1 += '<iniciar_sesion xmlns="urn:server">';
    message1 += '<usuario>' + $("#email").val() + '</usuario>';
    message1 += '<clave>' + $("#clave").val() + '</clave>';
    message1 += '</iniciar_sesion>';
    message1 += '</Body>';
    message1 += '</Envelope>';
    $.ajax({
        url: URL_SOAP,
        data: message1,
        type: 'POST',
        contentType: 'text/xml',
        dataType: 'xml',

        success: function(data, textStatus, jqXHR) {
            if (jqXHR.status == '200') {
                var xml = jqXHR.responseXML;
                var xmlChange = $.parseXML(xml);
                var external = $(xml).text(xmlChange).find("external_id").text();
                var token = $(xml).text(xmlChange).find("token").text();
                var persona = $(xml).text(xmlChange).find("persona").text();
                localStorage["token"] = token;
                localStorage["usuario"] = persona;
                localStorage["external"] = external;

                location.href = "Principal.html";
                // alert("Se ha registrado su cuenta, por favor inicie
                // sesion!");
                // location.href = "login.html";
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            manejoErroresInicio(jqXHR.responseText);
        }
    });
}

// validacion de datos
function validar() {

    $.validator.addMethod("soloLetras", function(value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Solo letras");
    $.validator.addMethod("registro", function(value, element) {
        return this.optional(element) || /^[N]-[0-9]{4}-[R]-[0-9]{3}$/.test(value);
    }, "Ingrese un registro valido ejemplo N-0000-R-000");
    $.validator.addMethod("validaCedula", function(value, element) {
        return this.optional(element) || validarCedula(value);
    }, "Cedula no valida");
    console.log("presenta datos");


    $("#login-form").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            clave: {
                required: true
            }
        },
        messages: {
            email: {
                required: "Ingrese un correo"
            },
            clave: {
                required: "ingrese su clave"
            }
        },
        submitHandler: function(form) {
            inicioSession();
        }
    });

    $("#idformulario").validate({
        rules: {
            txtcedula: {
                required: true,
                minlength: 10,
                maxlength: 13,
                number: true,
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
                minlength: 4,
                maxlength: 25
            },
            txtregistro: {
                required: true,
                registro: true

            },
            txtcorreo: {
                required: true,
                email: true,
                minlength: 4,
                maxlength: 50

            },
            txtcontrasenia: {
                required: true,
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
            txtregistro: {
                required: "Ingrese un registro valido"
            },
            txtcorreo: {
                required: "Ingresar un numero de cedula",
                minlength: $.format("Necesitamos por lo menos {0} caracteres"),
                maxlength: $.format("{0} caracteres son demasiados!")
            },
            txtcontrasenia: {
                required: "Hey vamos, por favor, dános tu nombre",
                minlength: $.format("Necesitamos por lo menos {0} caracteres"),
                maxlength: $.format("{0} caracteres son demasiados!")
            }
        },
        submitHandler: function(form) {
            insertarDatos();
        }
    });
}

// validacion de cedula
function validarCedula(cedula) {
    var cad = cedula.trim();
    var total = 0;
    var longitud = cad.length;
    var longcheck = longitud - 1;

    if (cad !== "" && longitud === 10) {
        for (i = 0; i < longcheck; i++) {
            if (i % 2 === 0) {
                var aux = cad.charAt(i) * 2;
                if (aux > 9)
                    aux -= 9;
                total += aux;
            } else {
                total += parseInt(cad.charAt(i)); // parseInt o concatenará en
                // lugar de sumar
            }
        }

        total = total % 10 ? 10 - total % 10 : 0;

        if (cad.charAt(longitud - 1) == total) {
            return true;
        } else {
            return false;
        }
    }
}

// limpia modal
function limpiaModal() {
    jQuery('#ModalRegistro').on('hidden.bs.modal', function(e) {
        jQuery(this).find('.modal-content').empty();
        jQuery(this).removeData('bs.modal');

    });
}

// presentacion de mensaje de error
function manejoErrores(xml) {
    console.log("Si llega al metodo");
    var xmlData = $.parseXML(xml);
    var error = $(xml).find("faultstring").text();
    // console.log(error);
    var mensaje = '<div class="alert alert-danger">';
    mensaje += error;
    mensaje += '</div>';

    $("#error").html(mensaje);
}
// presentacion de mensaje de error
function manejoErroresInicio(xml) {
    console.log("Si llega al metodo");
    var xmlData = $.parseXML(xml);
    var error = $(xml).find("faultstring").text();
    // console.log(error);
    var mensaje = '<div class="alert alert-danger">';
    mensaje += error;
    mensaje += '</div>';
    $("#mensaje").html(mensaje);
}

function verificarInicioSesion() {
    if (localStorage["token"] != null) {
        location.href = "Principal.html";
    }
}

function verificarNoInicioSesion() {
    if (localStorage["token"] == null) {
        location.href = "inicio.html";
    }
}

function cerrar_sesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("external");
    location.href = "inicio.html";
}