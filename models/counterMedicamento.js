'use strict'; 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterMedicamentoSchema = Schema({
    contador: Number
});
var CounterMedicamento = mongoose.model('counter_medicamento', CounterMedicamentoSchema);

module.exports = CounterMedicamento;