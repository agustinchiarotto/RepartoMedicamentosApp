// auth.js
var passport = require("passport");
var passportJWT = require("passport-jwt");
var Usuario = require("./models/usuario.js");
var cfg = require("./config.js");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.versionOneCompatibility({
        authScheme: 'Bearer'
    })
    //jwtFromRequest: ExtractJwt.fromAuthHeader() -- asi viene por defecto
};

module.exports = function () {
    var strategy = new JwtStrategy(params, function (payload, done) {
        var user;
        Usuario.findOne({
            'username': payload.username
        }, function (err, u) {
            user = u;
            if (user) {
                return done(null, {
                    username: user.username
                });
            } else {
                return done(new Error("User not found"), null);
            }
        });
    });

    passport.use(strategy);
    return {
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function () {
            return passport.authenticate("jwt", cfg.jwtSession);
        },
        requirePermission: function (role) {
            return function (req, res, next) {
                next();
            }
        }
    };
};