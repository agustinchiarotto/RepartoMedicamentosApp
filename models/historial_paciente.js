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
    diasRestantes: Number
    
});

//Esquema Historial_paciente
var hitorial_pacienteSchema = Schema({
    dni: {
        type: String,
    },
    nombre: String,
    apellido: String,
    telefono: String,
    direccion: String,
    barrio: String,
    fechaNacimiento: Date,
    fechaCambio: Date,

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
    }]
    
});

var Historial_paciente = mongoose.model('HistorialPaciente', hitorial_pacienteSchema);

module.exports = Historial_paciente;