'use strict'

var Repartidor = require('../models/repartidor');

// FUNCIONES
function getRepartidores(req, res){
    Repartidor.find({}, function (err, repartidores) {
        if (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!repartidores) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: repartidores
        });
    });
}

function cargarRepartidor(req, res) {
    if (!req.body.dniRepartidor) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso dni'
        });
    }
    if (!req.body.nombreRepartidor) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso nombre'
        });
    }
    if (!req.body.apellidoRepartidor) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso apellido'
        });
    }
    if (!req.body.telefonoRepartidor) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso telefono'
        });
    }
    if (!req.body.legajoRepartidor) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso legajo'
        });
    }

    var nuevoRepartidor = new Repartidor({
        dni: req.body.dniRepartidor,
        nombre: req.body.nombreRepartidor,
        apellido: req.body.apellidoRepartidor,
        telefono: req.body.telefonoRepartidor,
        legajo: req.body.legajoRepartidor
    })

    nuevoRepartidor.save().then(function (nuevoRepartidor) {
        res.status(201).json({
            message: 'Repartidor creado',
            obj: nuevoRepartidor
        });

    }, function (err) {
        if (err.code == 11000) {
            var msj = ""
            //Catching index name inside errmsg reported by mongo to determine the correct error and showing propper message
            if (err.errmsg.toString().includes("dni"))
                msj = "Dni de Repartidor";
           
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

function editarRepartidor(req, res) {
    Repartidor.findById(req.params.idRepartidor, function (err, repartidor) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!repartidor) {
            return res.status(404).json({
                title: 'Error',
                error: 'Repartidor no encontrado'
            });
        }

        repartidor.dni = req.body.dniRepartidor;
        repartidor.nombre = req.body.nombreRepartidor;
        repartidor.apellido = req.body.apellidoRepartidor;
        repartidor.telefono = req.body.telefonoRepartidor;
        repartidor.legajo = req.body.legajoRepartidor;

        repartidor.save().then(function (repartidor) {
            res.status(200).json({
                message: 'Success',
                obj: repartidor
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
}

function eliminarRepartidor(req, res){
    Repartidor.findOne({'_id': req.params.idRepartidor})
    .exec(function (err, repartidor) {
        if (repartidor) {
            repartidor.remove().then(function (repartidorEliminado) {
                return res.status(200).json({
                    message: 'Repartidor eliminado correctamente',
                    obj: repartidorEliminado
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
    getRepartidores,
    cargarRepartidor,
    editarRepartidor,
    eliminarRepartidor
}

