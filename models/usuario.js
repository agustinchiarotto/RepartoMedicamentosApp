'use strict';

/**
 * Dependencias del modulo
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Usuario Schema
 */
var usuarioSchema = new Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    permisos: [{
        type: Schema.Types.ObjectId,
        ref: 'Permiso'
    }]
});


// El esquema solo no sirve. Luego, creamos el modelo
var Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;