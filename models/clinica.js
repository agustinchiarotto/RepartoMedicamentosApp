'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Esquema Clinica
var ClinicaSchema = Schema({
    cuit: {
        type: String,
        unique: true
    },
    nombre: String,
    direccion: String,
    telefono: String,
    email: String,

    //Relacion con Medico
    medicos:[{
        type: Schema.Types.ObjectId,
        ref: 'Medico'
    }]
});
var Clinica = mongoose.model('Clinica', ClinicaSchema);

module.exports = Clinica;