'use strict'

var ObraSocial = require('../models/obras');
var Paciente = require('../models/paciente');

// FUNCIONES
function getObras(req, res){
    ObraSocial.find({}, function (err, obras) {
        if (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!obras) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: obras
        });
    });
}

function getObraSocial(req, res){
    ObraSocial.findById({'_id': req.params.idObraSocial})
    .populate('pacientes')
    .exec(function (err, obra) {
        if (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!obra) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: obra
        });
    });
}

function getObrasNoAsignadas(req, res) {
    Paciente.findById({'_id': req.params.idPaciente})
    .exec(function (error,paciente) {
        if (error) {
            return res.status(400).json({
                title: 'Error',
                error: error
            });
        }
        ObraSocial.find({ "_id": { "$nin": paciente.obras}}, function (err, obras) {
            if (err) {
                return res.status(400).json({
                    title: 'Error',
                    error: err
                });
            }
            if (!obras) {
                return res.status(404).json({
                    title: 'Error',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: obras
            });
        });
    });
}

function cargarObra(req, res) {
    if (!req.body.cuitObraSocial) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.nombreObra) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.direccionObra) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.telefonoObra) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.emailObra) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }

    var nuevaObra = new ObraSocial({
        cuit: req.body.cuitObraSocial,
        nombre: req.body.nombreObra,
        direccion: req.body.direccionObra,
        telefono: req.body.telefonoObra,
        email: req.body.emailObra
    })

    nuevaObra.save().then(function (nuevaObra) {
        res.status(201).json({
            message: 'Obra social creada',
            obj: nuevaObra
        });

    }, function (err) {
        if (err.code == 11000) {
            var msj = ""
            //Catching index name inside errmsg reported by mongo to determine the correct error and showing propper message
            if (err.errmsg.toString().includes("cuit"))
                msj = "Cuit Obra Social";
           
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

function editarObraSocial(req, res) {
    ObraSocial.findById(req.params.idObraSocial, function (err, obra) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!obra) {
            return res.status(404).json({
                title: 'Error',
                error: 'Obra Social no encontrada'
            });
        }

        obra.cuit = req.body.cuit;
        obra.nombre = req.body.nombreObra;
        obra.apellido = req.body.direccionObra;
        obra.telefono = req.body.telefonoObra;
        obra.matricula = req.body.emailObra;

        obra.save().then(function (obra) {
            res.status(200).json({
                message: 'Success',
                obj: obra
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
}

function eliminarObra(req, res){
    // VERIFICO SE SE PUEDE ELIMINAR OBRA
    Paciente.find({'obras': req.params.idObra})
    .exec(function (err, pacientesConObra) {
        if (err) {
            return res.status(404).json({
                title: 'Error',
                error: err.message
            });
        }

        // SI ENCUENTRA ELEMENTOS ASIGNADOS - ERROR
        if (pacientesConObra.length > 0) {
            return res.status(404).json({
                title: 'Error',
                error: 'Hay pacientes con esta obra social!!'
            });
        }

        // SINO ELIMINA
        ObraSocial.findById(req.params.idObra)
        .exec(function (err, obra) {
            if (err) {
                return res.status(404).json({
                    title: 'Error',
                    error: err.message
                });
            }
            if (!obra) {
                return res.status(404).json({
                    title: 'Error',
                    error: 'No se encontro obra'
                });
            }
    
            obra.remove().then(function (obraEliminada) {
                return res.status(200).json({
                    message: 'Obra Social eliminada correctamente',
                    obj: obraEliminada
                });
            }, function (err) {
                return res.status(400).json({
                    title: 'Error',
                    error: err.message
                });
            });
        });
    });
}

// EXPORT
module.exports = {
    getObras,
    getObraSocial,
    getObrasNoAsignadas,
    cargarObra,
    editarObraSocial,
    eliminarObra
}

