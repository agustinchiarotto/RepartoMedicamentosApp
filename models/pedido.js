'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EstadoPedido = Schema({
    estado: {
        type: Schema.Types.ObjectId,
        ref: 'Estado'
    },
    fecha: Date    
});

//Esquema pedido
var PedidoSchema = Schema({
    numero: {
        type: Number,
        unique: true
    },
    estadosPedido: [EstadoPedido],
    fecha: Date,

    //Relacion con Paciente
    paciente:{
        type: Schema.Types.ObjectId,
        ref: 'Paciente'
    },

    //Relacion con Repartidor, guardo el repartidor
    repartidor:{
        type: Schema.Types.ObjectId,
        ref: 'Repartidor'
    },
    //Relacion con Farmacia 
    farmacia:{
        type: Schema.Types.ObjectId,
        ref: 'Farmacia'
    },

    //Relacion con Medicamento
    medicamento:{
        type: Schema.Types.ObjectId,
        ref: 'Medicamento'
    }    
});
var Pedido = mongoose.model('Pedido', PedidoSchema);

module.exports = Pedido;