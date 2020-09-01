'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



//Esquema Repartidor
var RepartidorSchema = Schema({
    dni: {
        type: String,
        unique: true
    },
    nombre: String,
    apellido: String,
    telefono: String,
    legajo: String,
});
var Repartidor = mongoose.model('Repartidor', RepartidorSchema);

module.exports = Repartidor;