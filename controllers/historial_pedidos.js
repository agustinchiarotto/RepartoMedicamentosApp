'use strict'

var Pedido = require('../models/pedido');
var Historial_pedidos = require('../models/historial_pedidos');
var Medicamento =require('../models/medicamento');



// FUNCIONES
function getHistorial(req, res){
//colocar select
Historial_pedidos.find({pedido: req.params.idPed }).populate(
    {path: 'ped', model:'Pedido'}
).populate({path:'pac',model:'Paciente'}).exec(function (err, historial) {
        if (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!historial) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: historial
        });
    });
}


function cargarHistorialPedidos(req, res) {
    if (!req.body.numeroPedido) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }

    if (!req.body.estadoNuevo) {
        return res.status(400).json({
            title: 'Error',
            error: err
        });
    }

    var nuevoPedido = new Historial_pedidos({
        numero: req.body.numeroPedido,
        estado: req.body.estadoNuevo,
        estadoAnterior:req.body.estadoAnterior,
        hora: req.body.fechaCambioPedido,
        ped: req.body.idPedido,
        pac: req.body.idPaciente,
        medica: req.body.idMedicamento
    });

    nuevoPedido.save().then(function (nuevoPedido) {
        res.status(201).json({
            message: 'Pedido creado',
            obj: nuevoPedido
        });

    }, function (err) {
        if (err.code == 11000) {
            var msj = ""
            //Catching index name inside errmsg reported by mongo to determine the correct error and showing propper message
            if (err.errmsg.toString().includes("idPed"))
                msj = "Numero Pedido";
           
            return res.status(404).json({
                title: 'Error',
                error: msj + ' pedido existente.'
            });
        }
        return res.status(404).json({
            title: 'Error',
            error: err
        });
    });
}




function eliminarHistorialPedidos(req, res){
    HistorialPedidos.findOne({'_id': req.params.idPedido})
    .exec(function (err, pedido) {
        if (pedido) {
            pedido.remove().then(function (pedidoEliminado) {
                return res.status(200).json({
                    message: 'pedido eliminado correctamente',
                    obj: pedidoEliminado
                });
            }, function (err) {
                return res.status(400).json({
                    title: 'Error',
                    error: err.message
                });
            });
        }
        else {
            return res.status(404).json({
                title: 'Error',
                error: err.message
            });
        }
    });
    
}




// EXPORT
module.exports = {
    getHistorial,
    cargarHistorialPedidos,
    eliminarHistorialPedidos,
  
}

