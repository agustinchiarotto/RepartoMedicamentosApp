'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Esquema pedido
var HistorialPedidosSchema = Schema({
    numero: {
        type: Number,
        unique: true
    },
    estado: String,
    estadoAnterior:String,
    hora: Date,
    ped:String,
    pac:String,
    medica:String,

    //Relacion con su pedido
       pedido:{
        type: Schema.Types.ObjectId,
        ref: 'Pedido'
    },

    
});
var HistorialPedidos = mongoose.model('Historial_Pedidos', HistorialPedidosSchema);

module.exports = HistorialPedidos;