'use strict'

var Historial_paciente = require('../models/historial_paciente');
var Paciente = require('../models/paciente');
var Medico = require('../models/medico');
var Obra=require('../models/obras');
var Pedido= require('../models/pedido');

// FUNCIONES
function getHistorial(req, res){
Historial_paciente.find({dni: req.params.idPaciente }, function (err, historial) {
        if (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!historial) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: historial
        });
    });
}


function cargarHistorial(req, res) {
    if (!req.body.dniPaciente) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.nombrePaciente) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.apellidoPaciente) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.telefonoPaciente) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.direccionPaciente) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.barrioPaciente) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.fechaNacimientoPaciente) {
        return res.status(400).json({
            title: 'Error',
            error: err
        }); }
  
    var nuevoHistorial = new Historial_paciente({
        dni: req.body.dniPaciente,
        nombre: req.body.nombrePaciente,
        apellido: req.body.apellidoPaciente,
        telefono: req.body.telefonoPaciente,
        direccion: req.body.direccionPaciente,
        barrio: req.body.barrioPaciente,
        fechaNacimiento:req.body.fechaNacimientoPaciente,
        fechaCambio:req.body.fechaCambioPaciente
      
    })

    nuevoHistorial.save().then(function (nuevoHistorial) {
        res.status(201).json({
            message: 'Historial creado',
            obj: nuevoHistorial
        });

    }, function (err) {
        if (err.code == 11000) {
            var msj = ""
            //Catching index name inside errmsg reported by mongo to determine the correct error and showing propper message
            if (err.errmsg.toString().includes("dni"))
                msj = "DNI Paciente";
           
            return res.status(404).json({
                title: 'Error',
                error: msj + ' existente.'
            });
        }
        return res.status(404).json({
            title: 'Error',
            error: err
        });
    });
}




function eliminarHistorial(req, res){
    Historial_paciente.findOne({'_id': req.params.idPaciente})
    .exec(function (err, historial) {
        if (historial) {
            historial.remove().then(function (historialEliminado) {
                return res.status(200).json({
                    message: 'paciente eliminado correctamente',
                    obj: historialEliminado
                });
            }, function (err) {
                return res.status(400).json({
                    title: 'Error',
                    error: err.message
                });
            });
        }
        else {
            return res.status(404).json({
                title: 'Error',
                error: err.message
            });
        }
    });
}

function cargarHistorialConsumicion(req, res) {
    if (!req.body.frecuencia) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }

    if (!req.body.cantidadConsumicion) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }

    Historial_paciente.findById(req.params.idPaciente, function (err, historial) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!historial) {
            return res.status(404).json({
                title: 'Error',
                error: 'historial no encontrado'
            });
        }

        historial.consumiciones.push({
            medicamento: req.params.idMedicamento,
            frecuencia: req.body.frecuencia,
            cantidadConsumicion: req.body.cantidadConsumicion,
            diasRestantes: null
        })

        historial.save().then(function (historial) {
            res.status(200).json({
                message: 'Success',
                obj: historial
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
    
    
}




//Cargar un Medico

function cargarHistorialMedico(req, res) {
    //Asocio el medico al paciente
    Historial_paciente.findById(req.params.idPaciente, function (err, historial) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!paciente) {
            return res.status(404).json({
                title: 'Error',
                error: 'Paciente no encontrado'
            });
        }
        historial.medicos.push(req.params.idMedico);

        

        historial.save().then(function (historial) {
            res.status(200).json({
                message: 'Success',
                obj: historial
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });



       
}





//Cargar una obra social
function cargarHistorialObra(req, res) {
    //Asocio la obra social al paciente
    Historial_paciente.findById(req.params.idPaciente, function (err, historial) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!historial) {
            return res.status(404).json({
                title: 'Error',
                error: 'historial no encontrado'
            });
        }
        historial.obras.push(req.params.idObra);

        historial.save().then(function (historial) {
            res.status(200).json({
                message: 'Success',
                obj: historial
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
}   
   



// EXPORT
module.exports = {
    getHistorial,
    cargarHistorial,
    eliminarHistorial,
    cargarHistorialConsumicion,
    cargarHistorialMedico,
    cargarHistorialObra
  
  
}