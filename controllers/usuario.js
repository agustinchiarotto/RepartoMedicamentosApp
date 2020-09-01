var Usuario = require('../models/usuario');
var Permiso = require('../models/permiso');

function getUsuarios(req,res){
    var query=Usuario.find({},'_id username firstName lastName permisos');
    query.populate('permisos')
    .exec(
    function(err,doc){
        if (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: doc
        });
    });
}

function getUsuario(req,res){
    var query = Usuario.findById(req.params.userId)

    query.populate('permisos').exec(
    function(err,usr){
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if(!usr){
            return res.status(404).json({
                title: 'Error',
                error: 'Usuario no encontrado'
            });
        }

        usr.password="********";
        res.status(200).json({
            message: 'Success',
            obj: usr
        });
    });
}

function patchUsuario(req, res){
    if(!req.body.firstName){
        return res.status(400).json({
            title: 'Error',
            error: 'Nombre vacío.'
        });
    }
    
    var query = Usuario.findOne({'_id':req.body._id});

        query.exec(function (err, user) {
            if (err) {
                return res.status(404).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            if(!user){
                return res.status(404).json({
                    title: 'Error',
                    error: 'Usuario no encontrado'
                });
            }

            if(req.body.password && req.body.password.length>0){
                user.password = req.body.password;
            }
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.username = req.body.username;
            user.permisos= req.body.permisos;

            user.save().then(function(loc){
                res.status(200).json({
                    message: 'Success',
                    obj: loc
                });
            },function(err){
                return res.status(404).json({
                    title: 'Error',
                    error: err
                });
            });
        });

    }


function postUsuario(req,res){
    Permiso.findOne({'name': 'admin'})
    .exec((err, permiso) => {
        if (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }

        if (!permiso) {
            return res.status(404).json({
                title: 'Error',
                error: 'No se encontró permiso'
            });
        }

        var usuario = new Usuario({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password
        });

        usuario.permisos.push(permiso._id);
    
        usuario.save().then(function(usuario){
            res.status(201).json({
                message: 'Usuario creado',
                obj: usuario
            });
        },function(err){
            if(err.code==11000){
                var msj=""
                //Catching index name inside errmsg reported by mongo to determine the correct error and showing propper message
                if(err.errmsg.toString().includes("username"))
                    msj= "Nombre de Usuario (username)";
                else if(err.errmsg.toString().includes("firstName"))
                    msj="Nombre de usuario";
    
                return res.status(404).json({
                    title: 'Error',
                    error: msj+' existente.'
                });
            }
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    })
    
}

function deleteUsuario(req,res){
    if (!req.params.idUsuario) {
        return res.status(400).json({
            title: 'Error',
            error: 'Falta enviar el id del usuario.'
        });
    }

    Usuario.findOne({'_id': req.params.idUsuario})
    .exec(function (error, usuario){
        if (error) {
            return res.status(400).json({
                title: 'Error',
                error: 'Ocurrio un error.'
            });
        }

        if (!usuario) {
            return res.status(404).json({
                title: 'Error',
                error: 'No existe tal usuario.'
            });
        }

        usuario.remove().then(function (usu) {
            return res.status(200).json({
                message: 'Usuario eliminado correctamente',
                obj: usu
            });
        }, function (err) {
            return res.status(400).json({
                title: 'Error',
                error: err.message
            });
        })
    })
}

function patchUsuarioPermiso(req, res){
    //var query = Empresa.findOne({'_id':emp_id});

    if(!req.body.permisos){
        return res.status(400).json({
            title: 'Error',
            error: 'Falta enviar permisos.'
        });
    }

    var query = Usuario.findOne({'_id':req.params.id});

    query
        .exec(function (err, user) {

            if (err) {
                return res.status(400).json({
                    title: 'An error occurred',
                    error: err
                });
            }

            if(!oat){
                return res.status(400).json({
                    title: 'Error',
                    error: 'Usuario no encontrado'
                });
            }

            user.permisos = req.body.permisos;

            user.save().then(function(doc){
                //Expandimos los tanques de las plantas y luego se lo asignamos al OAT saliente
                User.populate(doc,[{path:'permisos', model: 'Permission'}
                    ],
                    function(err, editedUser){

                        if (err) {
                            return res.status(400).json({
                                title: 'Error',
                                error: err
                            });
                        }
                        res.status(200).json({
                            message: 'Success,comandos node',
                            obj: editedUser
                        });
                    }
                );

            },function(err){
                return res.status(404).json({
                    title: 'Error',
                    error: err
                });
            });
        });

}

module.exports = {
    getUsuarios,
    getUsuario,
    postUsuario,
    patchUsuario,
    deleteUsuario,
    patchUsuarioPermiso
};