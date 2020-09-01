'use strict'

var express = require('express');
var api = express.Router();
var RepartidorController = require('../controllers/repartidor');

// GETS
api.get('/',RepartidorController.getRepartidores);
// api.get('/:idRepartidor/:idPaciente',RepartidorController.editarRepartidor);

// PATCH
api.patch('/:idRepartidor',RepartidorController.editarRepartidor);

// POST
api.post('/',RepartidorController.cargarRepartidor);

// DELETE
api.delete('/:idRepartidor', RepartidorController.eliminarRepartidor)

module.exports = api;