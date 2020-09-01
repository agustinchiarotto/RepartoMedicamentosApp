'use strict'; 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MedicamentosSchema = Schema({
    idMedicamento: {
        type: Number,
        unique: true
    },
    nombre: String,
    //laboratorio: String,
    dosis: String,
    cadenaFrio: String,
    laboratorio: String,
    cantidadComprimidos: Number
});
var Medicamento = mongoose.model('Medicamento', MedicamentosSchema);

module.exports = Medicamento;