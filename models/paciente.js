'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Esquema consume
var Consume = Schema({
    medicamento: {
        type: Schema.Types.ObjectId,
        ref: 'Medicamento'
    },
    frecuencia: Number,
    cantidadConsumicion: Number,
    diasRestantes: Number,
    numeroMedicamento: String
    
});

//Esquema paciente
var pacienteSchema = Schema({
    dni: {
        type: String,
        unique: true
    },
    nombre: String,
    apellido: String,
    telefono: String,
    direccion: String,
    barrio: String,
    fechaNacimiento: Date,

    consumiciones:[Consume],
    //Relacion con Medico
    medicos:[{
        type: Schema.Types.ObjectId,
        ref: 'Medico'
    }],
    //Relacion con Obra
    obras:[{
        type: Schema.Types.ObjectId,
        ref: 'Obra'
    }],
    //Relacion con Medicamento
    medicamentos:[{
        type: Schema.Types.ObjectId,
        ref: 'Medicamento'
    }]
    
});

var Paciente = mongoose.model('Paciente', pacienteSchema);

module.exports = Paciente;