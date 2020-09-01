'use strict'

var express = require('express');
var api = express.Router();
var HistorialPedidosController = require('../controllers/historial_pedidos');

// GETS
api.get('/:idPedido',HistorialPedidosController.getHistorial);
// api.get('/:idMedico/:idPaciente',MedicoController.editarMedico);


// POST ALTA
api.post('/',HistorialPedidosController.cargarHistorialPedidos);

// DELETE
api.delete('/:idHistorial', HistorialPedidosController.eliminarHistorialPedidos)

module.exports = api; 