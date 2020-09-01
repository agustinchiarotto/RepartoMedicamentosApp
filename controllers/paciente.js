'use strict'

var Paciente = require('../models/paciente');
var Medico = require('../models/medico');
var ObraSocial =require('../models/obras');
var Pedido= require('../models/pedido');
var Medicamento= require('../models/medicamento');

// FUNCIONES
function getPacientes(req, res){
    Paciente.find({})
    .exec(function (err, pacientes) {
        if (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!pacientes) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: pacientes
        });
    });
}

function getPaciente(req, res){
    Paciente.findById(req.params.idPaciente)
    .populate('medicos')
    .populate('obras')
    .populate('consumiciones.medicamento')
    .populate('medicamentos')    
    .exec(function (err, paciente) {
        if (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!paciente) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }

        res.status(200).json({
            message: 'Success',
            obj: paciente
        });
    });
}

//Obtengo los pacientes de un determinado pedido
function getPacientePedido(req, res){
    var query = Pedido.findById(req.params.idPedido);
    
    query.populate({
        path: 'pacienete',
        model: 'Paciente'
    })
    .exec(function (err, pedido) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!pedido) {
            return res.status(404).json({
                title: 'Error',
                error: 'Pedido no encontrado'
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: pedido.paciente
        }); 
    });
}


function cargarPaciente(req, res) {
    if (!req.body.dniPaciente) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso DNI'
        });
    }
    if (!req.body.nombrePaciente) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso nombre'
        });
    }
    if (!req.body.apellidoPaciente) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso apellido'
        });
    }
    if (!req.body.telefonoPaciente) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso telefono'
        });
    }
    if (!req.body.direccionPaciente) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso direccion'
        });
    }
    if (!req.body.barrioPaciente) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso barrio'
        });
    }
    if (!req.body.fechaNacimientoPaciente) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso fecha de nacimiento'
        });
    }
    
    var nuevoPaciente = new Paciente({
        dni: req.body.dniPaciente,
        nombre: req.body.nombrePaciente,
        apellido: req.body.apellidoPaciente,
        telefono: req.body.telefonoPaciente,
        direccion: req.body.direccionPaciente,
        barrio: req.body.barrioPaciente,
        fechaNacimiento:req.body.fechaNacimientoPaciente
      
    })

    nuevoPaciente.save().then(function (nuevoPaciente) {
        res.status(201).json({
            message: 'Paciente creado',
            obj: nuevoPaciente
        });

    }, function (err) {
        if (err.code == 11000) {
            var msj = ""
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

function editarPaciente(req, res) {
    Paciente.findById(req.params.idPaciente, function (err, paciente) {
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

        paciente.nombre = req.body.nombrePaciente;
        paciente.apellido = req.body.apellidoPaciente;
        paciente.telefono = req.body.telefonoPaciente;
        paciente.direccion = req.body.direccionPaciente;
        paciente.barrio = req.body.barrioPaciente;
        paciente.fechaNacimiento=req.body.fechaNacimientoPaciente

        paciente.save().then(function (paciente) {
            res.status(200).json({
                message: 'Success',
                obj: paciente
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
}

function eliminarPaciente(req, res){
    Paciente.findOne({'_id': req.params.idPaciente})
    .exec(function (err, paciente) {
        if (paciente) {
            paciente.remove().then(function (pacienteEliminado) {
                return res.status(200).json({
                    message: 'paciente eliminado correctamente',
                    obj: pacienteEliminado
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

function cargarConsumicion(req, res) {
    if (!req.body.frecuencia) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso frecuencia'
        });
    }

    if (!req.body.cantidadConsumicion) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso cantidad de consumicion'
        });
    }

    //Busco el medicamento y me quedo con la cantidad de comprimidos
    Medicamento.findById(req.params.idMedicamento, function (err, medica) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        
        if (!medica) {
            return res.status(404).json({
                title: 'Error',
                error: 'Medicamento no encontrado'
            });
        }

        Paciente.findById(req.params.idPaciente, function (err, paciente) {
            if (err) {
                return res.status(400).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            if (!paciente) {
                return res.status(404).json({
                    title: 'An error occurred',
                    error:'No se encontro paciente'
                });
            }
            
            paciente.medicamentos.push(req.params.idMedicamento);
            
            paciente.consumiciones.push({
                medicamento: req.params.idMedicamento,
                frecuencia: req.body.frecuencia,
                cantidadConsumicion: req.body.cantidadConsumicion,   
                // calculo los dias restantes
                diasRestantes: (medica.cantidadComprimidos/req.body.cantidadConsumicion)/req.body.frecuencia,
                numeroMedicamento: req.params.idMedicamento,
            });

            paciente.save().then(function (paciente) {
                Paciente.populate(paciente,[{path: 'consumiciones.medicamento', model:'Medicamento'}], (err, pacienteExpandido) => {
                    if (err) {
                        return res.status(400).json({
                            title: 'An error occurred',
                            error: err
                        });
                    }
                    if (!pacienteExpandido) {
                        return res.status(400).json({
                            title: 'An error occurred',
                            error: 'No se pudo expandir paciente'
                        });
                    }
                    res.status(200).json({
                        message: 'Success',
                        obj: pacienteExpandido
                    });
                });
            }, function (err) {
                return res.status(404).json({
                    title: 'Error',
                    error: err
                });
            });           
        });        
    });
    
    
}

function quitarConsumicion(req, res) {

    Paciente.findById(req.params.idPaciente)
    .populate('consumiciones.medicamento')
    .exec(async function (err, paciente) {
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

        let pos = 0;
        var x = await paciente.consumiciones.findIndex(consumicion => {
            if (consumicion) {
                if (consumicion._id == req.body.idConsumicion) {
                    paciente.medicamentos.splice(pos, 1);
                    paciente.consumiciones.splice(pos, 1);
                }
            }
            pos++;
        });

        paciente.save().then(function (paciente) {
            res.status(200).json({
                message: 'Success',
                obj: paciente
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
    
    
}

// ASIGNAR MEDICOS
function asignarMedicos(req, res) {    
    //Asocio el medico al paciente
    Paciente.findById(req.params.idPaciente, async function (err, paciente) {
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

        var x = await req.body.idsMedicos.findIndex(idMedico => {paciente.medicos.push(idMedico)});        
        paciente.save().then(function (paciente) {
        
            //Asocio el paciente al Medico
            Medico.find({'_id': {'$in': req.body.idsMedicos}}, async function (err, medicos) {
                if (err) {
                    return res.status(400).json({
                        title: 'An error occurred',
                        error: err
                    });
                }

                if (!medicos) {
                    return res.status(404).json({
                        title: 'Error',
                        error: 'Medico no encontrado'
                    });
                }

                var x = await medicos.findIndex(medico => {
                    medico.pacientes.push(req.params.idPaciente );
                    medico.save();
                });

                res.status(200).json({
                    message: 'Success',
                    obj: medicos
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


// QUITAR MEDICO
function quitarMedico(req, res) {    
    //Asocio el medico al paciente
    Paciente.findById(req.params.idPaciente, async function (err, paciente) {
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

        const i = await paciente.medicos.findIndex(medicoPaciente => medicoPaciente._id === req.body.idMedico);
        paciente.medicos.splice(i, 1)

        paciente.save().then(function (paciente) {
            //Asocio el paciente al Medico
            Medico.findById(req.body.idMedico)
            .populate('pacientes')
            .exec(async function (err, medico) {
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

                const j = await medico.pacientes.findIndex(pacienteMedico => pacienteMedico._id === req.params.idPaciente);
                medico.pacientes.splice(j, 1);

                medico.save().then(function (medico) {
                    res.status(200).json({
                        message: 'Success',
                        obj: medico
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


// ASIGNAR OBRA SOCIAL
function asignarObrasSociales(req, res) {    
    //Asocio la obra al paciente
    Paciente.findById(req.params.idPaciente, async function (err, paciente) {
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

        var x = await req.body.idsObras.findIndex(idObra => {paciente.obras.push(idObra)});
        paciente.save().then(function (paciente) {
        
            //Asocio el paciente a la obra
            ObraSocial.find({'_id': {'$in': req.body.idsObras}}, async function (err, obras) {
                if (err) {
                    return res.status(400).json({
                        title: 'An error occurred',
                        error: err
                    });
                }

                if (!obras) {
                    return res.status(404).json({
                        title: 'Error',
                        error: 'Medico no encontrado'
                    });
                }

                var x = await obras.findIndex(obra => {
                    obra.pacientes.push(req.params.idPaciente );
                    obra.save();
                });

                res.status(200).json({
                    message: 'Success',
                    obj: obras
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

// QUITAR OBRA SOCIAL
function quitarObraSocial(req, res) {    
    // Quito la obra al paciente
    Paciente.findById(req.params.idPaciente, async function (err, paciente) {
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

        
        const i = await paciente.obras.findIndex(obraPaciente => obraPaciente._id === req.body.idObraSocial);
        paciente.obras.splice(i, 1);

        paciente.save().then(function (paciente) {
            //Quito el paciente a la obra
            ObraSocial.findById(req.body.idObraSocial)
            .populate('pacientes')
            .exec(async function (err, obra) {
                if (err) {
                    return res.status(400).json({
                        title: 'An error occurred',
                        error: err
                    });
                }

                if (!obra) {
                    return res.status(404).json({
                        title: 'Error',
                        error: 'Obra no encontrada'
                    });
                }

                const j = await obra.pacientes.findIndex(pacienteObra => pacienteObra._id === req.params.idPaciente);
                obra.pacientes.splice(j, 1);

                obra.save().then(function (obra) {
                    res.status(200).json({
                        message: 'Success',
                        obj: obra
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


// EXPORT
module.exports = {
    getPacientes,
    getPacientePedido,
    getPaciente,
    cargarPaciente,
    editarPaciente,
    eliminarPaciente,
    cargarConsumicion,
    asignarMedicos,
    quitarMedico,
    asignarObrasSociales,
    quitarObraSocial,
    quitarConsumicion
}

