'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Esquema Medico
var MedicoSchema = Schema({
    dni: {
        type: String,
        unique: true
    },
    nombre: String,
    apellido: String,
    telefono: String,
    matricula: String,
    especialidad: String,

    //Relacion con Clinica
    clinicas:[{
        type: Schema.Types.ObjectId,
        ref: 'Clinica'
    }],

    //Relacion con Paciente
    pacientes:[{
        type: Schema.Types.ObjectId,
        ref: 'Paciente'
    }]

});
var Medico = mongoose.model('Medico', MedicoSchema);

module.exports = Medico;