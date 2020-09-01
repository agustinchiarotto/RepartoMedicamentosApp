var Permiso = require('../models/permiso');
var Usuario = require('../models/usuario');

function getPermisos(req,res){
    Permiso.find({}, function (err, doc) {
        res.send(doc);
    });
}

function getPermiso(req,res){
    var user;
    var permisos = [];

    Usuario.findById(req.params.idUser, function (err, usr) {

        if (err) {
            return res.status(404).json({
                title: 'Ha ocurrido un error',
                error: err
            });
        }
        if (!usr) {
            return res.status(404).json({
                title: 'Error',
                error: 'Usuario no encontrada'
            });
        }
        user = usr;

        var prom = user.permisos.map(function (elem) {
            return new Promise(function (resolve) {
                Permiso.findById(elem, function (err, doc) {
                    resolve(permisos.push(doc));
                });
            });
        });

        var prom2 = Promise.all(prom);
        prom2.then(function (respuestaPermisos) {
            res.status(200).json({
                message: 'Success',
                obj: tanques
            });

            //obs: obj podria ser tarqnuilamente tanques (el arreglo)
        });
    });
}

module.exports = {
    getPermisos,
    getPermiso
};