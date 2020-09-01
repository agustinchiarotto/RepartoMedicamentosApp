'use strict'


var Medicamento = require('../models/medicamento');
var CounterMedicamento = require('../models/counterMedicamento');
var Paciente= require('../models/paciente');
var Farmacia=require('../models/farmacia')

// FUNCIONES
function getMedicamentos(req, res){
    Medicamento.find({}, function (err, medicamentos) {
        if (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!medicamentos) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: medicamentos
        });
    });
}
function getMedicamentosID(req, res){
    Medicamento.findById(req.params.idMedicamentos, function (err, medicamento) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!medicamento) {
            return res.status(404).json({
                title: 'Error',
                error: 'Medicamento no encontrado'
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: medicamentos
        });
    });
}

//Obtengo los medicamentos de un determinado paciente
function getMedicamentosPaciente(req, res){
    var query = Paciente.findById(req.params.idPaciente);
    
    query.populate({
        path: 'medicamentos',
        model: 'Medicamento'
    })
    .exec(function (err, paciente) {
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
        res.status(200).json({
            message: 'Success',
            obj: paciente.medicamentos
        }); 
    });
    
 
}

//Obtengo los medicamentos de un determinado pedido
function getMedicamentosPedido(req, res){
    var query = Pedido.findById(req.params.idPedido);
    
    query.populate({
        path: 'medicamento',
        model: 'Medicamento'
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
            obj: pedido.medicamento
        }); 
    }); 
}

function getMedicamentosNoConsumePaciente(req, res){
    var query = Paciente.findById(req.params.idPaciente);
    
    query.exec(function (err, paciente) {
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

        if (paciente.medicamentos.length != 0) {
            Medicamento.find({
                '_id': {
                    $nin: paciente.medicamentos
                }
            }, function (err, medicamentos) {
                res.status(200).json({
                    message: 'Success',
                    obj: medicamentos
                });
            })
        }
        else{
            Medicamento.find({}, function (err, medicamentos) {
                if (err) {
                    return res.status(400).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                if (!medicamentos) {
                    return res.status(404).json({
                        title: 'Error',
                        error: 'Medicamentos no encontrados'
                    });
                }
                res.status(200).json({
                    message: 'Success',
                    obj: medicamentos
                });
            })
        }
    });
}


function getMedicamentosNoFarmacia(req, res){
    var query = Farmacia.findById(req.params.idFarmacia);
    query.exec(function (err, farmacia) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!farmacia) {
            return res.status(404).json({
                title: 'Error',
                error: 'Farmacia no encontrada'
            });
        }

        if (farmacia.medicamentos.length != 0) {
            Medicamento.find({
                '_id': {
                    $nin: farmacia.medicamentos
                }
            }, function (err, medicamentos) {
                
                res.status(200).json({
                    message: 'Success',
                    obj: medicamentos
                });
            })
        }
        else{
            Medicamento.find({}, function (err, medicamentos) {
                if (err) {
                    return res.status(400).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                if (!medicamentos) {
                    return res.status(404).json({
                        title: 'Error',
                        error: 'Medicamentos no encontrados'
                    });
                }
                res.status(200).json({
                    message: 'Success',
                    obj: medicamentos
                });
            })
        }
    });
}

function cargarMedicamento(req, res) {
    if (!req.body.nombreMedicamento) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso nombre'
        });
    }
    if (!req.body.dosisMedicamento) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso dosis'
        });
    }
    if (!req.body.cadenaFrioMedicamento) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso cadena frio'
        });
    }
    if (!req.body.cantidadComprimidosMedicamento) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso Cantidad Comprimidos'
        });
    }

    CounterMedicamento.find({}, function(err, counters){

        var counter = counters[0];

        var nuevoMedicamento = new Medicamento({
            idMedicamento: counter.contador,
            nombre: req.body.nombreMedicamento,
            dosis: req.body.dosisMedicamento,
            cadenaFrio: req.body.cadenaFrioMedicamento,
            laboratorio: req.body.laboratorioMedicamento,
            cantidadComprimidos: req.body.cantidadComprimidosMedicamento
          
        });

        counter.contador = counter.contador + 1;

        nuevoMedicamento.save().then(function (nuevoMedicamento) {
            counter.save().then((counterGuardado) => {
                res.status(201).json({
                    message: 'Medicamento creado',
                    obj: nuevoMedicamento
                });
            })
        }, function (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        });
    });    
}

function editarMedicamento(req, res) {
    Medicamento.findById(req.params.idMedicamento, function (err, medicamento) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!medicamento) {
            return res.status(404).json({
                title: 'Error',
                error: 'Medicamento no encontrado'
            });
        }

        medicamento.nombre = req.body.nombreMedicamento;
        medicamento.dosis = req.body.dosisMedicamento;
        medicamento.cadenaFrio = req.body.cadenaFrioMedicamento;
        medicamento.laboratorio = req.body.laboratorioMedicamento;
        medicamento.cantidadComprimidos = req.body.cantidadComprimidosMedicamento;

        medicamento.save().then(function (medicamento) {
            res.status(200).json({
                message: 'Success',
                obj: medicamento
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
}

function eliminarMedicamento(req, res){
    Medicamento.findOne({'_id': req.params.idMedicamentos})
    .exec(function (err, medicamento) {
        if (medicamento) {
            medicamento.remove().then(function (medicamentoEliminado) {
                return res.status(200).json({
                    message: 'medicamento eliminado correctamente',
                    obj: medicamentoEliminado
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
    getMedicamentos,
    getMedicamentosID,
    cargarMedicamento,
    editarMedicamento,
    eliminarMedicamento,
    getMedicamentosPaciente,
    getMedicamentosNoConsumePaciente,
    getMedicamentosNoFarmacia,
    getMedicamentosPedido
}

