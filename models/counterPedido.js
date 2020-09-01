'use strict'; 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterPedidoSchema = Schema({
    contador: Number
});
var CounterPedido = mongoose.model('counter_pedido', CounterPedidoSchema);

module.exports = CounterPedido;