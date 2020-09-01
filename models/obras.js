'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObrasSchema = Schema({
    cuit: {
        type: String,
        unique: true
    },
    nombre: String,
    direccion: String,
    telefono: String,
    email: String,
    
    //Relacion con Paciente
    pacientes:[{
        type: Schema.Types.ObjectId,
        ref: 'Paciente'
    }]
});
var Obra = mongoose.model('Obra', ObrasSchema);

module.exports = Obra;