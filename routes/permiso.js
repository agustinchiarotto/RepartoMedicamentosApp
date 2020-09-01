'use strict'
var express = require('express');
var PermisoController = require('../controllers/permiso');
var api = express.Router();
var auth = require("../auth.js")();

api.get('/', auth.authenticate(), PermisoController.getPermisos);
api.get('/:idUser', PermisoController.getPermiso);

module.exports = api;