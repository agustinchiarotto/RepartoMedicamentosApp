'use strict'

var express = require('express');
var api = express.Router();
var ObraController = require('../controllers/obra');

// GETS
api.get('/',ObraController.getObras);
api.get('/:idObraSocial',ObraController.getObraSocial);
api.get('/obrasNoAsignadas/:idPaciente',ObraController.getObrasNoAsignadas);
// api.get('/:idMedico/:cuidObra',ObraController.editarObra);

// PATCH
api.patch('/:idObraSocial',ObraController.editarObraSocial);

// POST
api.post('/',ObraController.cargarObra);

// DELETE
api.delete('/:idObra', ObraController.eliminarObra)

module.exports = api;