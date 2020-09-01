'use strict'

var express = require('express');
var api = express.Router();
var PacienteController = require('../controllers/paciente');

// GETS
api.get('/',PacienteController.getPacientes);
api.get('/pacientePedido/:idPedido',PacienteController.getPacientePedido);
api.get('/:idPaciente',PacienteController.getPaciente);

// PATCH MODIFICACION
api.patch('/:idPaciente',PacienteController.editarPaciente);

// MEDICO
api.patch('/asignarMedicos/:idPaciente', PacienteController.asignarMedicos);
api.patch('/quitarMedico/:idPaciente', PacienteController.quitarMedico);

// OBRA SOCIAL
api.patch('/asignarObrasSociales/:idPaciente', PacienteController.asignarObrasSociales);
api.patch('/quitarObraSocial/:idPaciente', PacienteController.quitarObraSocial);

// MEDICAMENTO
api.patch('/cargarConsumicion/:idPaciente/:idMedicamento', PacienteController.cargarConsumicion);
api.patch('/quitarConsumicion/:idPaciente', PacienteController.quitarConsumicion);

// POST ALTA
api.post('/',PacienteController.cargarPaciente);

// DELETE
api.delete('/:idPaciente', PacienteController.eliminarPaciente)

module.exports = api; 