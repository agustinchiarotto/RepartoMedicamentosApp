'use strict';


/**
 * Dependencias del modulo
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Permiso Schema
 */
var permisoSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    description: String,
});


// El esquema solo no sirve. Luego, creamos el modelo
var Permiso = mongoose.model('Permiso', permisoSchema);

module.exports = Permiso;