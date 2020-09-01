'use strict'

var Pedido = require('../models/pedido');
var Medicamento = require('../models/medicamento');
const CronJob = require('../node_modules/cron/lib/cron').CronJob; // necesario para la tarea una vez al dia. 
var Paciente = require('../models/paciente');
var CounterPedido = require('../models/counterPedido');
var Estado = require('../models/estado');

//Creo los pedidos automaticamente.
const job = new CronJob('00 59 23 * * *', function () {
    //Decremento en 1 los dias restantes.
    console.log('comienza tarea');
    Paciente.find({
        "consumiciones.diasRestantes": {
            $gte: 7
        }
    }).exec(async (error, pacientes) => {
        if (error) {

        }

        var x = await pacientes.findIndex(paciente => {
            paciente.consumiciones.forEach(consumicion => {
                consumicion.diasRestantes = consumicion.diasRestantes - 1;
            });
            paciente.save().then(function (pacienteGuardado) { });
        });

        //Busco los pacientes que poseen menos de 7 dias de consumiciones y les genero un pedido nuevo.
        Paciente.find({
            "consumiciones.diasRestantes": {
                $lte: 7
            }
        }).exec(function (err, pacientes) {
            
            pacientes.forEach(elementPac => {
                let cont = 0;
                //obtener las consumiciones y verificar si diasRestantes es menor a 7
                console.log(elementPac._id);
                elementPac.consumiciones.forEach(elemConsu => {
                    if (elemConsu.diasRestantes <= 7) {
                        Estado.find()
                            .exec((error, estados) => {
                                if (error) {
                                    return res.status(400).json({
                                        title: 'Error',
                                        error: error
                                    });
                                }
                                if (!estados) {
                                    return res.status(400).json({
                                        title: 'Error id medicamento',
                                        error: 'No encontro estados'
                                    });
                                }

                                var estadoPedido = {
                                    estado: estados[0]._id,
                                    fecha: new Date()
                                }


                                CounterPedido.findOne({})
                                    .exec((error, counterPedido) => {
                                        if (error) {
                                            return res.status(400).json({
                                                title: 'Error',
                                                error: error
                                            });
                                        }
                                        if (!counterPedido) {
                                            return res.status(400).json({
                                                title: 'Error id medicamento',
                                                error: 'No encontro contador pedido'
                                            });
                                        }

                                        var nuevoPedido = new Pedido({
                                            numero: counterPedido.contador,
                                            fecha: new Date(),
                                            paciente: elementPac._id,
                                            medicamento: elemConsu.medicamento
                                        });

                                        nuevoPedido.estadosPedido.push(estadoPedido);

                                        counterPedido.contador = counterPedido.contador + 1;

                                        nuevoPedido.save().then(function (nuevoPedido) {
                                            counterPedido.save();
                                        });
                                    });
                            });
                    };
                });
            });
        });
    });
    console.log('pedido de tarea');
});

const job2 = new CronJob('00 19 15 * * *', function () {//00:59:22
    
    Estado.findOne({
        'nombre': 'Entregado'
    })
        .exec((err, estadoEntragado) => {
            var today= new Date();
            console.log('Estado entregado: '+estadoEntragado);
            let año=today.getFullYear().toString();
            let mes=today.getMonth().toString();
            let dia=today.getDate().toString();
            today.setHours(0,0,0,0);
            Pedido.find({
                'estadosPedido.estado': estadoEntragado._id
            })
                .exec((error, pedidosDeHoy) => {
                   
                    for (const pedido of pedidosDeHoy) {
                        let fec=pedido.estadosPedido[pedido.estadosPedido.length-1].fecha;
                        let esta=pedido.estadosPedido[pedido.estadosPedido.length-1].estado;
                        let añof=fec.getFullYear().toString();
                        let mesf=fec.getMonth().toString();
                        let diaf=fec.getDate().toString();
                        fec.setHours(0,0,0,0);
                        if(añof.localeCompare(año)=='0' && mesf.localeCompare(mes)=='0' && diaf.localeCompare(dia)=='0'){
                            Paciente.findById(pedido.paciente)
                            .populate('consumiciones.medicamento')
                            .exec(function (error, paciente) {
                                if (!error && paciente) {
                                    for (const consumicion of paciente.consumiciones) {                                        
                                        if (consumicion.medicamento._id.equals(pedido.medicamento)) { 
                                            consumicion.diasRestantes = (consumicion.medicamento.cantidadComprimidos / consumicion.cantidadConsumicion) / consumicion.frecuencia;
                                            paciente.save().then(function (pacienteGuardado) { });
                                        }
                                    }
                                }
                            });

                        }
                    }
                });
        });
});

job.start();
job2.start();

// FUNCIONES
function getPedidos(req, res) {
    Estado.findOne({
        'nombre': req.params.estado
    }, (error, estado) => {
        if (error) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!estado) {
            return res.status(400).json({
                title: 'Error',
                error: 'No se encontro estado'
            });
        }
        Pedido.find({
            'estadosPedido.estado': estado._id
        })
            .populate([{
                path: 'paciente'
            },
            {
                path: 'repartidor'
            },
            {
                path: 'farmacia'
            },
            {
                path: 'medicamento'
            },
            {
                path: 'estadosPedido.estado',
                model: 'Estado'
            }
            ])
            .exec(function (err, pedidos) {
                let aux = [];
                for (const pedido of pedidos) {
                    var ultimo=pedido.estadosPedido[pedido.estadosPedido.length-1]                                        
                    if (ultimo.estado.equals(estado._id)) {
                        aux.push(pedido);
                    }
                }
                pedidos=aux;
                if (err) {
                    return res.status(400).json({
                        title: 'Error',
                        error: err
                    });
                }
                if (!pedidos) {
                    return res.status(404).json({
                        title: 'Error',
                        error: err
                    });
                }                
                res.status(200).json({
                    message: 'Success',
                    obj: pedidos
                });
            });
    });
}

function getPedido(req, res) {

    Pedido.findById(req.params.idPedido)
        .populate([{
            path: 'paciente'
        },
        {
            path: 'repartidor'
        },
        {
            path: 'farmacia'
        },
        {
            path: 'medicamento'
        },
        {
            path: 'estadosPedido.estado',
            model: 'Estado'
        }
        ])
        .exec(function (err, pedido) {
            if (err) {
                return res.status(400).json({
                    title: 'Error',
                    error: err
                });
            }
            if (!pedido) {
                return res.status(404).json({
                    title: 'Error',
                    error: 'Pedido no encontrado'
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: pedido
            });
        });
}

function getEstados(req, res) {

    Estado.find({})
        .exec(function (err, estados) {
            if (err) {
                return res.status(400).json({
                    title: 'Error',
                    error: err
                });
            }
            if (!estados) {
                return res.status(404).json({
                    title: 'Error',
                    error: 'Estados no encontrados'
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: estados
            });
        });
}



function getPedidosEntregados(req, res) {
    Pedido.find({
        estado: 'Entregado'
    }).populate({
        path: 'medica',
        select: 'nombre',
        model: 'Medicamento'
    }).populate({
        path: 'pac',
        select: ['apellido', 'direccion'],
        model: 'Paciente'
    })
        .populate({
            path: 'repartidor',
            select: 'apellido',
            model: 'Repartidor'
        }).exec(function (err, pedidos) {
            if (err) {
                return res.status(400).json({
                    title: 'Error',
                    error: err
                });
            }
            if (!pedidos) {
                return res.status(404).json({
                    title: 'Error',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: pedidos
            });
        });
}

function getPedidosEntreFechas(req, res) {
    Pedido.find(req.params.fechaInicio < Pedido.horaYFechaPedido < Pedido.horaYFechaPedido, function (err, pedidos) {
        if (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!pedidos) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: pedidos
        });
    });
}

function cargarPedido(req, res) {
    if (!req.body.fechaPedido) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso fecha'
        });
    }

    if (!req.body.idPaciente) {
        return res.status(400).json({
            title: 'Error id paciente',
            error: 'No ingreso paciente'
        });
    }

    if (!req.body.idMedicamento) {
        return res.status(400).json({
            title: 'Error id medicamento',
            error: 'No ingreso medicamento'
        });
    }

    if (!req.body.idFarmacia) {
        return res.status(400).json({
            title: 'Error id medicamento',
            error: 'No ingreso farmacia'
        });
    }

    if (!req.body.idRepartidor) {
        return res.status(400).json({
            title: 'Error id medicamento',
            error: 'No ingreso repartidor'
        });
    }

    Estado.find({})
        .exec((error, estados) => {
            if (error) {
                return res.status(400).json({
                    title: 'Error',
                    error: error
                });
            }
            if (!estados) {
                return res.status(400).json({
                    title: 'Error id medicamento',
                    error: 'No encontro estados'
                });
            }

            var estadoPedido = {
                estado: estados[0]._id,
                fecha: req.body.fechaPedido
            }

            CounterPedido.findOne({})
                .exec((error, counterPedido) => {
                    if (error) {
                        return res.status(400).json({
                            title: 'Error',
                            error: error
                        });
                    }
                    if (!counterPedido) {
                        return res.status(400).json({
                            title: 'Error id medicamento',
                            error: 'No encontro contador pedido'
                        });
                    }

                    var nuevoPedido = new Pedido({
                        numero: counterPedido.contador,
                        fecha: req.body.fechaPedido,
                        paciente: req.body.idPaciente,
                        medicamento: req.body.idMedicamento,
                        farmacia: req.body.idFarmacia,
                        repartidor: req.body.idRepartidor
                    });

                    nuevoPedido.estadosPedido.push(estadoPedido);

                    counterPedido.contador = counterPedido.contador + 1;

                    nuevoPedido.save().then(function (nuevoPedido) {
                        counterPedido.save().then((counterGuardado) => {

                            Pedido.populate(nuevoPedido, [{
                                path: 'paciente'
                            },
                            {
                                path: 'repartidor'
                            },
                            {
                                path: 'farmacia'
                            },
                            {
                                path: 'medicamento'
                            },
                            {
                                path: 'estadosPedido.estado'
                            }
                            ], (error, nuevoPedidoExpandido) => {
                                if (error) {
                                    return res.status(400).json({
                                        title: 'Error',
                                        error: err
                                    });
                                }
                                if (!nuevoPedidoExpandido) {
                                    return res.status(400).json({
                                        title: 'Error',
                                        error: 'No se pudo expandir pedido creado'
                                    });
                                }
                                res.status(201).json({
                                    message: 'Medicamento creado',
                                    obj: nuevoPedidoExpandido
                                });
                            })
                        })
                    }, function (err) {
                        return res.status(404).json({
                            title: 'Error',
                            error: err
                        });
                    });
                });
        });
}


function cargarPedidoAutomatico(req, res) {
    if (!req.body.fechaPedido) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso fecha'
        });
    }

    if (!req.body.idPaciente) {
        return res.status(400).json({
            title: 'Error id paciente',
            error: 'No ingreso paciente'
        });
    }

    if (!req.body.idMedicamento) {
        return res.status(400).json({
            title: 'Error id medicamento',
            error: 'No ingreso medicamento'
        });
    }

    Estado.find({})
        .exec((error, estados) => {
            if (error) {
                return res.status(400).json({
                    title: 'Error',
                    error: error
                });
            }
            if (!estados) {
                return res.status(400).json({
                    title: 'Error id medicamento',
                    error: 'No encontro estados'
                });
            }

            var estadoPedido = {
                estado: estados[0]._id,
                fecha: req.body.fechaPedido
            }
            //verificar el id..
            CounterPedido.find({})
                .exec((error, countersPedido) => {
                    if (error) {
                        return res.status(400).json({
                            title: 'Error',
                            error: error
                        });
                    }
                    if (!countersPedido) {
                        return res.status(400).json({
                            title: 'Error id medicamento',
                            error: 'No encontro contador pedido'
                        });
                    }

                    var counterPedido = countersPedido[0];

                    var nuevoPedido = new Pedido({
                        numero: counterPedido.contador,
                        fecha: req.body.fechaPedido,
                        paciente: req.body.idPaciente,
                        medicamento: req.body.idMedicamento
                    });

                    nuevoPedido.estadosPedido.push(estadoPedido);

                    counterPedido.contador = counterPedido.contador + 1;

                    nuevoPedido.save().then(function (nuevoPedido) {
                        counterPedido.save().then((counterGuardado) => {
                            res.status(201).json({
                                message: 'Medicamento creado',
                                obj: nuevoPedido
                            });
                        })
                    }, function (err) {
                        return res.status(404).json({
                            title: 'Error',
                            error: err
                        });
                    });
                });
        });
}


//cargo el pedido cuando agrego el medicamento

function cargarPedido2(req, res) {

    Pedido.countDocuments({}, function (err, count) {
        if (err) {
            return handleError(err)
        } //handle possible errors
        //and do some other fancy stuff
        if (!req.params.idPaciente) {
            return res.status(400).json({
                title: 'Error id paciente',
                error: err
            });
        }
        if (!req.params.idMedicamento) {
            return res.status(400).json({
                title: 'Error id medicamento',
                error: err
            });
        }
        var num = count + 1;
        Medicamento.find({
            "_id": req.params.idMedicamento
        }, function (err, medicamento) {
            if (err) {
                return res.status(400).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            if (!medicamento) {
                return res.status(404).json({
                    title: 'Error',
                    error: 'Medicamento no encontrado'
                });
            }

            var nuevoPedido = new Pedido({

                numero: num,

                estado: "Generado",
                hora: new Date(),
                //a partir de aca no funciona.
                cadenaFrio: medicamento[0].cadenaFrio,
                medica: medicamento[0]._id,
                pac: req.params.idPaciente


            })
            nuevoPedido.idPaciente = req.params.idPaciente;
            nuevoPedido.idMedicamento = req.params.idMedicamento;

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
        });
    })

}




function editarPedido(req, res) {
    Pedido.findById(req.params.idPedido, function (err, pedido) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!pedido) {
            return res.status(404).json({
                title: 'Error',
                error: 'Pedido no encontrado'
            });
        }

        if (req.body.repartidor) {
            pedido.repartidor = req.body.repartidor;
        }

        if (req.body.farmacia) {
            pedido.farmacia = req.body.farmacia;
        }

        pedido.save().then(function (pedidoEditado) {
            Pedido.populate(pedidoEditado, [{
                path: 'paciente'
            },
            {
                path: 'repartidor'
            },
            {
                path: 'farmacia'
            },
            {
                path: 'medicamento'
            },
            {
                path: 'estadosPedido.estado'
            }
            ], (error, pedidoEditadoExpandido) => {
                res.status(200).json({
                    message: 'Success',
                    obj: pedidoEditadoExpandido
                });
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
}

function eliminarPedido(req, res) {
    Pedido.findOne({
        '_id': req.params.idPedido
    })
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
            } else {
                return res.status(404).json({
                    title: 'Error',
                    error: err.message
                });
            }
        });

}

//Cargar un Repartidor

function cargarRepartidor(req, res) {
    //Asocio el repartidor al pedido
    Pedido.findById(req.params.idPedido, function (err, pedido) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!pedido) {
            return res.status(404).json({
                title: 'Error',
                error: 'Pedido no encontrado'
            });
        }

        pedido.repartidor = req.params.idRepartidor;

        pedido.save().then(function (pedido) {
            res.status(200).json({
                message: 'Success',
                obj: pedido
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
}

function contarPedidos(req, res) {
    Pedido.find({})
        .populate({
            path: 'estadosPedido.estado',
            model: 'Estado'
        })
        .exec(async (err, pedidos) => {
            if (err) {
                return res.status(400).json({
                    title: 'Error',
                    error: err
                });
            }

            var conteo = {
                generados: 0,
                enProceso: 0,
                retirados: 0,
                pendientes: 0,
                entregados: 0,
            };

            var x = await pedidos.findIndex(pedido => {
                var ultimoEstado = pedido.estadosPedido[pedido.estadosPedido.length - 1];
                if (ultimoEstado.estado.nombre === 'Generado') {
                    conteo.generados = conteo.generados + 1;
                } else if (ultimoEstado.estado.nombre === 'En Proceso') {
                    conteo.enProceso = conteo.enProceso + 1;
                } else if (ultimoEstado.estado.nombre === 'Retirado') {
                    conteo.retirados = conteo.retirados + 1;
                } else if (ultimoEstado.estado.nombre === 'Pendiente') {
                    conteo.pendientes = conteo.pendientes + 1;
                } else if (ultimoEstado.estado.nombre === 'Entregado') {
                    conteo.entregados = conteo.entregados + 1;
                }
            });

            res.status(200).json({
                message: 'Success',
                obj: conteo
            });
        });
}

function siguienteEstado(req, res) {

    Pedido.findById(req.params.idPedido).populate({
        path: 'estadosPedido.estado',
        model: 'Estado'
        }).exec((err, pedido) => {
            if (err) {
                return res.status(400).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            if (!pedido) {
                return res.status(404).json({
                    title: 'Error',
                    error: 'Pedido no encontrado'
                });
            }
            var ultimoEstado = pedido.estadosPedido[pedido.estadosPedido.length - 1];
            Estado.find({})
                .exec((err, estados) => {
                    var estadoPedido;
                    if (ultimoEstado.estado.nombre === 'Generado') {
                        estadoPedido = {
                            estado: estados[1]._id,
                            fecha: new Date(),                            
                        }
                        
                        pedido.estadosPedido.push(estadoPedido);
                    } else if (ultimoEstado.estado.nombre === 'En Proceso') {
                         estadoPedido = {
                            estado: estados[2]._id,
                            fecha: new Date()
                        }
                        
                        pedido.estadosPedido.push(estadoPedido);
                    } else if (ultimoEstado.estado.nombre === 'Retirado') {
                         estadoPedido = {
                            estado: estados[4]._id,
                            fecha: new Date()
                        }
                        
                        pedido.estadosPedido.push(estadoPedido);
                    } 
                    pedido.fecha=estadoPedido.fecha;
                    pedido.save().then(function (pedidoEditado) {
                        Pedido.populate(pedidoEditado, [{
                            path: 'paciente'
                        },
                        {
                            path: 'repartidor'
                        },
                        {
                            path: 'farmacia'
                        },
                        {
                            path: 'medicamento'
                        },
                        {
                            path: 'estadosPedido.estado'
                        }
                        ], (error, pedidoEditadoExpandido) => {
                            res.status(200).json({
                                message: 'Success',
                                obj: pedidoEditadoExpandido
                            });
                        });
                    }, function (err) {
                        return res.status(404).json({
                            title: 'Error',
                            error: err
                        });
                    });
                });

        });

}




function anteriorEstado(req, res) {

    Pedido.findById(req.params.idPedido).populate({
        path: 'estadosPedido.estado',
        model: 'Estado'
        }).exec(async (err, pedido) => {
            if (err) {
                return res.status(400).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            if (!pedido) {
                return res.status(404).json({
                    title: 'Error',
                    error: 'Pedido no encontrado'
                });
            }
            var ultimoEstado = pedido.estadosPedido[pedido.estadosPedido.length - 1];
           
            Estado.find({})
                .exec((err, estados) => {
                    var estadoPedido;
                    if (ultimoEstado.estado.nombre === 'En Proceso') {
                            estadoPedido= {
                            estado: estados[0]._id,
                            fecha: new Date()
                        }
                        pedido.estadosPedido.push(estadoPedido);
                    } else if (ultimoEstado.estado.nombre === 'Retirado') {
                         estadoPedido = {
                            estado: estados[1]._id,
                            fecha: new Date()
                        }
                        pedido.estadosPedido.push(estadoPedido);
                    }
                    else if (ultimoEstado.estado.nombre === 'Entregado') {
                        estadoPedido = {
                           estado: estados[2]._id,
                           fecha: new Date()
                       }
                       
                       pedido.estadosPedido.push(estadoPedido);
                   } 
                                       
                    pedido.fecha=estadoPedido.fecha;
                                     
                    pedido.save().then(function (pedidoEditado) {
                        Pedido.populate(pedidoEditado, [{
                            path: 'paciente'
                        },
                        {
                            path: 'repartidor'
                        },
                        {
                            path: 'farmacia'
                        },
                        {
                            path: 'medicamento'
                        },
                        {
                            path: 'estadosPedido.estado'
                        }
                        ], (error, pedidoEditadoExpandido) => {
                            res.status(200).json({
                                message: 'Success',
                                obj: pedidoEditadoExpandido
                            });
                        });
                    }, function (err) {
                        return res.status(404).json({
                            title: 'Error',
                            error: err
                        });
                    });
                });
        });

}


function estadoPendiente(req, res) {

    Pedido.findById(req.params.idPedido).populate({
        path: 'estadosPedido.estado',
        model: 'Estado'
        }).exec(async (err, pedido) => {
            if (err) {
                return res.status(400).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            if (!pedido) {
                return res.status(404).json({
                    title: 'Error',
                    error: 'Pedido no encontrado'
                });
            }
            var ultimoEstado = pedido.estadosPedido[pedido.estadosPedido.length - 1];
           
            Estado.find({})
                .exec((err, estados) => {
                    var estadoPedido;
                   
                            estadoPedido= {
                            estado: estados[3]._id,
                            fecha: new Date()
                        }
                        pedido.estadosPedido.push(estadoPedido);
                    
                                       
                    pedido.fecha=estadoPedido.fecha;
                                     
                    pedido.save().then(function (pedidoEditado) {
                        Pedido.populate(pedidoEditado, [{
                            path: 'paciente'
                        },
                        {
                            path: 'repartidor'
                        },
                        {
                            path: 'farmacia'
                        },
                        {
                            path: 'medicamento'
                        },
                        {
                            path: 'estadosPedido.estado'
                        }
                        ], (error, pedidoEditadoExpandido) => {
                            res.status(200).json({
                                message: 'Success',
                                obj: pedidoEditadoExpandido
                            });
                        });
                    }, function (err) {
                        return res.status(404).json({
                            title: 'Error',
                            error: err
                        });
                    });
                });
        });

}

function estadoNoPendiente(req, res) {

    Pedido.findById(req.params.idPedido).populate({
        path: 'estadosPedido.estado',
        model: 'Estado'
        }).exec(async (err, pedido) => {
            if (err) {
                return res.status(400).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            if (!pedido) {
                return res.status(404).json({
                    title: 'Error',
                    error: 'Pedido no encontrado'
                });
            }
            var ultimoEstado = pedido.estadosPedido[pedido.estadosPedido.length - 2];
            console.log('Estado anterior '+ultimoEstado);
            console.log(ultimoEstado._id);
            var a = ultimoEstado._id;
            Estado.findById(ultimoEstado.estado._id)           
            .exec((err, estados) => {
                var estadoPedido;
                console.log('El estado que busque '+estados);
               
                        estadoPedido= {
                        estado: estados._id,
                        fecha: new Date()
                    }
                    pedido.estadosPedido.push(estadoPedido);
                
                                   
                pedido.fecha=estadoPedido.fecha;
                                 
                pedido.save().then(function (pedidoEditado) {
                    Pedido.populate(pedidoEditado, [{
                        path: 'paciente'
                    },
                    {
                        path: 'repartidor'
                    },
                    {
                        path: 'farmacia'
                    },
                    {
                        path: 'medicamento'
                    },
                    {
                        path: 'estadosPedido.estado'
                    }
                    ], (error, pedidoEditadoExpandido) => {
                        res.status(200).json({
                            message: 'Success',
                            obj: pedidoEditadoExpandido
                        });
                    });
                }, function (err) {
                    return res.status(404).json({
                        title: 'Error',
                        error: err
                    });
                });
            });
               
        });

}



function quitarConsumicionPedido(req, res) {




}


// EXPORT
module.exports = {
    getPedidos,
    getPedido,
    getEstados,
    getPedidosEntregados,
    getPedidosEntreFechas,
    cargarPedido,
    cargarPedidoAutomatico,
    editarPedido,
    eliminarPedido,
    cargarRepartidor,
    cargarPedido2,
    quitarConsumicionPedido,
    contarPedidos,
    siguienteEstado,
    anteriorEstado,
    estadoPendiente,
    estadoNoPendiente
}