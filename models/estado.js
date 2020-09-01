'use strict'; 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EstadoSchema = Schema({
    nombre: String
});
var Estado = mongoose.model('Estado', EstadoSchema);

module.exports = Estado;