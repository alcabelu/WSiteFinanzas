var LoginView = require('../views/reference'),
  LoginModel = require('../models/dataAccess');

var Login = function (conf) {
  this.conf = conf || {};
  this.view = new LoginView();
  this.model = new LoginModel({
    parameters: this.conf.parameters
  });

  this.response = function () {
    this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
  };
};

// /api/login/internos
// Funcionalidad de login
Login.prototype.get_auth = function (req, res, next) {
  var self = this;

  var usuario = req.query.usuario;
  var password = req.query.password;
  var mensajeUsuario = req.query.mensaje;

  var params = [
    { name: 'Usuario', value: usuario, type: self.model.types.STRING },
    { name: 'Password', value: password, type: self.model.types.STRING },
    { name: 'MensajeUsuario', value: mensajeUsuario, type: self.model.types.STRING }
  ];

  this.model.query('SP_LogiWebSiteFinzas', params, function (error, result) {
    //Cuando la contraseña es incorrecta, no existe el objeto result
    if (typeof result === 'undefined') {
      result = [{ 'MensajeUsuario': 'La contraseña es incorrecta' }];
    }

    if (result.length > 0) {
      console.log("result " + result[0]);
    }

    self.view.expositor(res, {
      error: error,
      result: result,
    });
  });
};

module.exports = Login;
