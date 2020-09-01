'use strict'

var express = require('express');
var api = express.Router();
var HistorialPacienteController = require('../controllers/historial_paciente');

// GETS
api.get('/:idPaciente',HistorialPacienteController.getHistorial);
// api.get('/:idMedico/:idPaciente',MedicoController.editarMedico);

// PATCH MODIFICACION
api.patch('/agregarMedicamento/:idPaciente/:idMedicamento', HistorialPacienteController.cargarHistorialConsumicion);
api.patch('/agregarMedico/:idPaciente/:idMedico', HistorialPacienteController.cargarHistorialMedico);
api.patch('/agregarObraSocial/:idPaciente/:idObra', HistorialPacienteController.cargarHistorialObra);


// POST ALTA
api.post('/',HistorialPacienteController.cargarHistorial);

// DELETE
api.delete('/:idPaciente', HistorialPacienteController.eliminarHistorial)

module.exports = api; 