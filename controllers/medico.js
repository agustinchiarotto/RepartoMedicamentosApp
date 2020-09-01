'use strict'

var Medico = require('../models/medico');
var Paciente = require('../models/paciente');
var Clinica = require('../models/clinica');

// FUNCIONES
function getMedicos(req, res){
    Medico.find({}, function (err, medicos) {
        if (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!medicos) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: medicos
        });
    });
}

function getMedico(req, res){
    Medico.findById({'_id': req.params.idMedico})
    .populate('clinicas')
    .populate('pacientes')
    .exec(function (err, medico) {
        if (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!medico) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: medico
        });
    });
}

function getMedicosNoAsignados(req, res) {
    Paciente.findById({'_id': req.params.idPaciente})
    .exec(function (error,paciente) {
        if (error) {
            return res.status(400).json({
                title: 'Error',
                error: error
            });
        }
        Medico.find({ "_id": { "$nin": paciente.medicos}}, function (err, medicos) {
            if (err) {
                return res.status(400).json({
                    title: 'Error',
                    error: err
                });
            }
            if (!medicos) {
                return res.status(404).json({
                    title: 'Error',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: medicos
            });
        });
    });
}

function cargarMedico(req, res) {
    if (!req.body.dniMedico) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.nombreMedico) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.apellidoMedico) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.telefonoMedico) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.matriculaMedico) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.especialidadMedico) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }

    var nuevoMedico = new Medico({
        dni: req.body.dniMedico,
        nombre: req.body.nombreMedico,
        apellido: req.body.apellidoMedico,
        telefono: req.body.telefonoMedico,
        matricula: req.body.matriculaMedico,
        especialidad: req.body.especialidadMedico
    })

    nuevoMedico.save().then(function (nuevoMedico) {
        res.status(201).json({
            message: 'Medico creado',
            obj: nuevoMedico
        });

    }, function (err) {
        if (err.code == 11000) {
            var msj = ""
            //Catching index name inside errmsg reported by mongo to determine the correct error and showing propper message
            if (err.errmsg.toString().includes("dni"))
                msj = "Dni de Medico";
           
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

function editarMedico(req, res) {
    Medico.findById(req.params.idMedico, function (err, medico) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!medico) {
            return res.status(404).json({
                title: 'Error',
                error: 'Medico no encontrado'
            });
        }

        medico.nombre = req.body.nombreMedico;
        medico.apellido = req.body.apellidoMedico;
        medico.telefono = req.body.telefonoMedico;
        medico.matricula = req.body.matriculaMedico;
        especialidad: req.body.especialidadMedico;

        medico.save().then(function (medico) {
            res.status(200).json({
                message: 'Success',
                obj: medico
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
}

// ASIGNAR CLINICAS
function asignarClinicas(req, res) {    
    //Asocio las clinicas al medico
    Medico.findById(req.params.idMedico, async function (err, medico) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!medico) {
            return res.status(404).json({
                title: 'Error',
                error: 'Medico no encontrado'
            });
        }

        var x = await req.body.idsClinicas.findIndex(idClinica => {medico.clinicas.push(idClinica)});
        medico.save().then(function (medico) {
        
            //Asocio el medico las clinicas
            Clinica.find({'_id': {'$in': req.body.idsClinicas}}, async function (err, clinicas) {
                if (err) {
                    return res.status(400).json({
                        title: 'An error occurred',
                        error: err
                    });
                }

                if (!clinicas) {
                    return res.status(404).json({
                        title: 'Error',
                        error: 'Clinica no encontrada'
                    });
                }

                var x = await clinicas.findIndex(clinica => {
                    clinica.medicos.push(req.params.idMedico);
                    clinica.save();
                });
                
                res.status(200).json({
                    message: 'Success',
                    obj: clinicas
                });
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
}


// QUITAR CLINICA
function quitarClinica(req, res) {    
    //Quito la clinica al medico
    Medico.findById(req.params.idMedico, async function (err, medico) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!medico) {
            return res.status(404).json({
                title: 'Error',
                error: 'Medico no encontrado'
            });
        }

        const i = await medico.clinicas.findIndex(clinicaMedico => clinicaMedico._id ===req.body.idClinica);
        medico.clinicas.splice(i, 1)
        
        medico.save().then(function (medico) {
            //Quito el medico a la clinica
            Clinica.findById(req.body.idClinica)
            .populate('medicos')
            .exec(async function (err, clinica) {
                if (err) {
                    return res.status(400).json({
                        title: 'An error occurred',
                        error: err
                    });
                }

                if (!clinica) {
                    return res.status(404).json({
                        title: 'Error',
                        error: 'Clinica no encontrada'
                    });
                }

                const j = await clinica.medicos.findIndex(medicoClinica => medicoClinica._id === req.params.idMedico);
                clinica.medicos.splice(j, 1)

                clinica.save().then(function (clinica) {
                    res.status(200).json({
                        message: 'Success',
                        obj: clinica
                    });
                });
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
}


function eliminarMedico(req, res){
    Medico.findOne({'_id': req.params.idMedico})
    .exec(function (err, medico) {
        if (medico) {
            medico.remove().then(function (medicoEliminado) {
                return res.status(200).json({
                    message: 'Medico eliminado correctamente',
                    obj: medicoEliminado
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

// EXPORT
module.exports = {
    getMedicos,
    getMedico,
    getMedicosNoAsignados,
    cargarMedico,
    editarMedico,
    eliminarMedico,
    asignarClinicas,
    quitarClinica
}

