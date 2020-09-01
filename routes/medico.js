'use strict'

var express = require('express');
var api = express.Router();
var MedicoController = require('../controllers/medico');

// GETS
api.get('/',MedicoController.getMedicos);
api.get('/:idMedico',MedicoController.getMedico);
api.get('/medicosNoAsignados/:idPaciente',MedicoController.getMedicosNoAsignados);

// PATCH
api.patch('/:idMedico',MedicoController.editarMedico);

// CLINICA
api.patch('/asignarMedicos/:idMedico', MedicoController.asignarClinicas);
api.patch('/quitarMedico/:idMedico', MedicoController.quitarClinica);

// POST
api.post('/',MedicoController.cargarMedico);

// DELETE
api.delete('/:idMedico', MedicoController.eliminarMedico)

module.exports = api;