'use strict'

var express = require('express');
var api = express.Router();
var FarmaciaController = require('../controllers/farmacia');

// GETS
api.get('/',FarmaciaController.getFarmacias);
api.get('/:idFarmacia',FarmaciaController.getFarmacia);
api.get('/farmaciasMedicamento/:idMedicamento',FarmaciaController.getFarmaciasMedicamento);

// PATCH MODIFICACION
api.patch('/:idFarmacia',FarmaciaController.editarFarmacia);
api.patch('/asignarMedicamentos/:idFarmacia', FarmaciaController.asignarMedicamentos);
api.patch('/quitarMedicamento/:idFarmacia', FarmaciaController.quitarMedicamento);

// POST ALTA
api.post('/',FarmaciaController.cargarFarmacia);

// DELETE
api.delete('/:idFarmacia', FarmaciaController.eliminarFarmacia)

module.exports = api; 