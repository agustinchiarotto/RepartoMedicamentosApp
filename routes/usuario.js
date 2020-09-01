'use strict'
var express = require('express');
var UsuarioController = require('../controllers/usuario');
var api = express.Router();
var auth = require("../auth.js")();

api.get('/', UsuarioController.getUsuarios);
api.get('/:userId', auth.authenticate(), UsuarioController.getUsuario);
api.patch('/', UsuarioController.patchUsuario);
api.post('/', UsuarioController.postUsuario);
api.delete('/:idUsuario', UsuarioController.deleteUsuario);

api.patch('/:id/updatePermissions/', UsuarioController.patchUsuarioPermiso);

module.exports = api;
