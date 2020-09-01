'use strict'

var Farmacia = require('../models/farmacia');
var Medicamento = require('../models/medicamento');

// FUNCIONES
function getFarmacias(req, res) {
    Farmacia.find({}, function (err, farmacia) {
        if (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!farmacia) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: farmacia
        });
    });
}

function getFarmacia(req, res) {
    Farmacia.findById({
            '_id': req.params.idFarmacia
        })
        .populate('medicamentos')
        .exec(function (err, farmacia) {
            if (err) {
                return res.status(400).json({
                    title: 'Error',
                    error: err
                });
            }
            if (!farmacia) {
                return res.status(404).json({
                    title: 'Error',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: farmacia
            });
        });
}

function getFarmaciasMedicamento(req, res) {
    Farmacia.find({'medicamentos': req.params.idMedicamento})
    .exec(function (err, farmacias) {
        if (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!farmacias) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: farmacias
        });
    });
}

function cargarFarmacia(req, res) {

    if (!req.body.cuitFarmacia) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.nombreFarmacia) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.direccionFarmacia) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.telefonoFarmacia) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }
    if (!req.body.emailFarmacia) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }



    var nuevoFarmacia = new Farmacia({
        cuit: req.body.cuitFarmacia,
        nombre: req.body.nombreFarmacia,
        telefono: req.body.telefonoFarmacia,
        direccion: req.body.direccionFarmacia,
        email: req.body.emailFarmacia
    })


    nuevoFarmacia.save().then(function (nuevoFarmacia) {
        res.status(201).json({
            message: 'Farmacia creado',
            obj: nuevoFarmacia
        });

    }, function (err) {
        if (err.code == 11000) {
            var msj = ""
            //Catching index name inside errmsg reported by mongo to determine the correct error and showing propper message
            if (err.errmsg.toString().includes("cuit"))
                msj = "cuit Farmacia";

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

function editarFarmacia(req, res) {
    Farmacia.findById(req.params.idFarmacia, function (err, farmacia) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!farmacia) {
            return res.status(404).json({
                title: 'Error',
                error: 'Farmacia no encontrado'
            });
        }

        farmacia.nombre = req.body.nombreFarmacia;
        farmacia.telefono = req.body.telefonoFarmacia;
        farmacia.direccion = req.body.direccionFarmacia;
        farmacia.email = req.body.emailFarmacia;

        farmacia.save().then(function (farmacia) {
            res.status(200).json({
                message: 'Success',
                obj: farmacia
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
}

function eliminarFarmacia(req, res) {
    Farmacia.findOne({
            '_id': req.params.idFarmacia
        })
        .exec(function (err, farmacia) {
            if (farmacia) {
                farmacia.remove().then(function (farmaciaEliminado) {
                    return res.status(200).json({
                        message: 'farmacia eliminado correctamente',
                        obj: farmaciaEliminado
                    });
                }, function (err) {
                    return res.status(400).json({
                        title: 'Error',
                        error: err.message
                    });
                });
            } else {
                return res.status(404).json({
                    title: 'Error',
                    error: err.message
                });
            }
        });
}

//Cargar un Medicamento
function asignarMedicamentos(req, res) {
    //Asocio el medicamento a la farmacia
    Farmacia.findById(req.params.idFarmacia)
        .populate('medicamentos')
        .exec(async function (err, farmacia) {
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

            var x = await req.body.idsMedicamentos.findIndex(idMedicamento => {
                farmacia.medicamentos.push(idMedicamento)
            });
            farmacia.save().then(function (farmacia) {
                Medicamento.find({
                    '_id': {
                        '$in': req.body.idsMedicamentos
                    }
                }, (error, medicamentosAgregados) => {
                    if (error) {
                        return res.status(404).json({
                            title: 'Error',
                            error: err
                        });
                    }
                    if (!medicamentosAgregados) {
                        return res.status(404).json({
                            title: 'Error',
                            error: 'Medicamentos Agregados no encontrados'
                        });
                    }
                    res.status(200).json({
                        message: 'Success',
                        obj: medicamentosAgregados
                    });
                })
            });
        });
}

function quitarMedicamento(req, res) {
    //Quito el medicamento de la farmacia
    Farmacia.findById(req.params.idFarmacia, async function (err, farmacia) {
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

        const i = await farmacia.medicamentos.findIndex(medicamentoFarmacia => medicamentoFarmacia._id === req.body.idMedicamento);
        farmacia.medicamentos.splice(i, 1)

        farmacia.save().then(function (farmacia) {
            Medicamento.findById(req.body.idMedicamento, (error, medicamentoQuitado) => {
                if (error) {
                    return res.status(400).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                if (!medicamentoQuitado) {
                    return res.status(404).json({
                        title: 'Error',
                        error: 'Medicamento quitado no encontrado'
                    });
                }

                res.status(200).json({
                    message: 'Success',
                    obj: medicamentoQuitado
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
    getFarmacias,
    getFarmacia,
    getFarmaciasMedicamento,
    editarFarmacia,
    eliminarFarmacia,
    asignarMedicamentos,
    quitarMedicamento,
    cargarFarmacia

}