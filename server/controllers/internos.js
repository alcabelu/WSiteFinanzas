var internosView = require('../views/reference'),
InternosModel = require('../models/dataAccess');

var internos = function(conf) {
this.conf = conf || {};
this.view = new internosView();
this.model = new InternosModel({
    parameters: this.conf.parameters
});

this.response = function() {
    this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
};
};

// /api/internos/internos
// Funcionalidad de la tabla UNIDADES
internos.prototype.get_internos = function(req, res, next) {
var self = this;
  var idCia = req.query.idcia;
  var idSucursal = req.query.idsucursal;
  var mes = req.query.mes;
  var anio = req.query.anio;
  console.log('QueryString = ' + req.query);

var params = [
  { name: 'IdCia', value: idCia, type: self.model.types.INT },
  { name: 'IdSucursal', value: idSucursal, type: self.model.types.STRING },
  { name: 'Mes', value: mes, type: self.model.types.STRING },
  { name: 'Anio', value: anio , type: self.model.types.STRING }
];

  this.model.query('spInternosUnidades', params, function (error, result) {
    console.log('Parametros: ' + params);
    if (result.length > 0) {

        console.log("resultaaaaaaa " + result[0]);
    }
    self.view.expositor(res, {
        error: error,
        result: result,
    });
  });
};

// /api/internos/estadoresultados
// Funcionalidad de la tabla ESTADO DE RESULTADOS
internos.prototype.get_estadoresultados = function(req, res, next) {
  var self = this;
  var idCia = req.query.idcia;
  var idSucursal = req.query.idsucursal;
  var departamento = req.query.departamento
  var mes = req.query.mes;
  var anio = req.query.anio;
  console.log('QueryString = ' + req.query);

  var params = [
    { name: 'IdCia', value: idCia, type: self.model.types.INT },
    { name: 'IdSucursal', value: idSucursal, type: self.model.types.STRING },
    { name: 'Departamento', value: departamento, type: self.model.types.STRING },
    { name: 'Mes', value: mes, type: self.model.types.STRING },
    { name: 'Anio', value: anio, type: self.model.types.STRING }
  ];

  this.model.query('SP_CONSULTA_ESTADO_RESULTADOS', params, function (error, result) {
    console.log('Parametros: ' + params);
    if (result.length > 0) {
      console.log("Estado de Resultados " + result[0]);
    }
    self.view.expositor(res, {
      error: error,
      result: result,
    });
  });
};

// /api/internos/unidadesdepto
// Funcionalidad de la tabla UNIDADES por departamento
internos.prototype.get_unidadesdepto = function (req, res, next) {
  var self = this;
  var idCia = req.query.idcia;
  var idSucursal = req.query.idsucursal;
  var departamento = req.query.departamento
  var mes = req.query.mes;
  var anio = req.query.anio;

  var params = [
    { name: 'IdCia', value: idCia, type: self.model.types.INT },
    { name: 'IdSucursal', value: idSucursal, type: self.model.types.STRING },
    { name: 'Departamento', value: departamento, type: self.model.types.STRING },
    { name: 'Mes', value: mes, type: self.model.types.STRING },
    { name: 'Anio', value: anio, type: self.model.types.STRING }
  ];

  this.model.query('SP_CONSULTA_UNIDADES_DEPTO', params, function (error, result) {
    if (result.length > 0) {
      console.log("Unidades Depto " + result[0]);
    }
    self.view.expositor(res, {
      error: error,
      result: result,
    });
  });
};

// /api/internos/companias
// Funcionalidad del dropdown de compañias
internos.prototype.get_companias = function(req, res, next) {
  var self = this;
  var idUsuario = req.query.idusuario;

  var params = [
   { name: 'IdUsuario', value: idUsuario , type: self.model.types.INT }
  ];

    this.model.query('SP_CONSULTA_COMPANIA', params, function (error, result) {
      console.log(params);
      // if (result.length > 0) {
      //     console.log("SP_CONSULTA_COMPANIA " + result[0]);
      // }
      self.view.expositor(res, {
          error: error,
          result: result,
      });
    });
};

// /api/internos/sucursales
// Funcionalidad del dropdown de compañias
internos.prototype.get_sucursales = function (req, res, next) {
  var self = this;
  var idAgencia = req.query.idcia;
  var idEstadoDeResultados = req.query.idreporte;

  var params = [
    { name: 'IdAgencia', value: idAgencia, type: self.model.types.INT },
    { name: 'IdReporte', value: idEstadoDeResultados, type: self.model.types.INT }
  ];

  this.model.query('SP_CONSULTA_SUCURSAL', params, function (error, result) {
    console.log(params);
    self.view.expositor(res, {
      error: error,
      result: result,
    });
  });
};

// /api/internos/departamentos
// Funcionalidad del dropdown de departamentos
internos.prototype.get_departamentos = function (req, res, next) {
  var self = this;
  var idReporte = req.query.idreporte;
  var idSucursal = req.query.idsucursal;
  var idAgencia = req.query.idcia;
  var anio = req.query.anio;
  var mes = req.query.mes;

  var params = [
    { name: 'IdReporte', value: idReporte, type: self.model.types.INT },
    { name: 'IdSucursal', value: idSucursal, type: self.model.types.STRING },
    { name: 'IdAgencia', value: idAgencia, type: self.model.types.INT },
    { name: 'Anio', value: anio, type: self.model.types.STRING },
    { name: 'Mes', value: mes, type: self.model.types.STRING }
  ];

  this.model.query('SP_CONSULTA_DEPARTAMENTO', params, function (error, result) {
    console.log(params);
    self.view.expositor(res, {
      error: error,
      result: result,
    });
  });
};

// /api/internos/detalleunidadesmensual
// Funcionalidad para detalle de Unidades mensual (doble click celdas de lado azul)
internos.prototype.get_detalleunidadesmensual = function (req, res, next) {
  var self = this;
  var idAgencia = req.query.idcia;
  var mSuc = req.query.msuc;
  var anio = req.query.anio;
  var mes = req.query.mes;
  var concepto = req.query.concepto;

  var params = [
    { name: 'IdAgencia', value: idAgencia, type: self.model.types.STRING },
    { name: 'MSuc', value: mSuc, type: self.model.types.STRING },
    { name: 'Anio', value: anio, type: self.model.types.STRING },
    { name: 'Mes', value: mes, type: self.model.types.STRING },
    { name: 'Concepto', value: concepto, type: self.model.types.STRING }
  ];

  this.model.query('SP_DETALLE_DE_UNIDADES_MENSUAL', params, function (error, result) {
    console.log(params);
    self.view.expositor(res, {
      error: error,
      result: result,
    });
  });
};

// /api/internos/detalleresultadosmensual
// Funcionalidad para detalle de Estado de Resultados mensual (doble click celdas de lado azul)
internos.prototype.get_detalleresultadosmensual = function (req, res, next) {
  var self = this;
  var idAgencia = req.query.idcia;
  var anio = req.query.anio;
  var mes = req.query.mes;
  var idSucursal = req.query.idsucursal;
  var mSucursal = req.query.msucursal;
  var departamento = req.query.departamento;
  var concepto = req.query.concepto;
  var idEstadoResultado = req.query.idEstadoDeResultado;
  var idDetalle = req.query.idDetalle;

  var params = [
    { name: 'IdAgencia', value: idAgencia, type: self.model.types.STRING },
    { name: 'Anio', value: anio, type: self.model.types.STRING },
    { name: 'Mes', value: mes, type: self.model.types.STRING },
    { name: 'IdSucursal', value: idSucursal, type: self.model.types.STRING },
    { name: 'MSucursal', value: mSucursal, type: self.model.types.STRING },
    { name: 'Departamento', value: departamento, type: self.model.types.STRING },
    { name: 'Concepto', value: concepto, type: self.model.types.STRING },
    { name: 'IdEstadoDeResultado', value: idEstadoResultado, type: self.model.types.STRING },
    { name: 'IdDetalle', value: idDetalle, type: self.model.types.STRING }
  ];

  this.model.query('SP_ESTADO_DE_RESULTADOS_DETALLE', params, function (error, result) {
    console.log(params);
    self.view.expositor(res, {
      error: error,
      result: result,
    });
  });
};

// /api/internos/detalleresultadoscuentas
// Funcionalidad para detalle de Estado de Resultados mensual (doble click celdas de lado azul)
internos.prototype.get_detalleresultadoscuentas = function (req, res, next) {
  var self = this;
  var servidorAgencia = req.query.servidoragencia;
  var concentradora = req.query.concentradora;
  var anio = req.query.anio;
  var mes = req.query.mes;
  var numCta = req.query.numcta;

  var params = [
    { name: 'ServidorAgencia', value: servidorAgencia, type: self.model.types.STRING },
    { name: 'Concentradora', value: concentradora, type: self.model.types.STRING },
    { name: 'Anio', value: anio, type: self.model.types.STRING },
    { name: 'Mes', value: mes, type: self.model.types.STRING },
    { name: 'NumCta', value: numCta, type: self.model.types.STRING }
  ];

  this.model.query('SP_ESTADO_DE_RESULTADOS_DETALLE_CUENTAS', params, function (error, result) {
    console.log(params);
    self.view.expositor(res, {
      error: error,
      result: result,
    });
  });
};


// /api/internos/efectivoysituacion
// Funcionalidad para las opciones de efectivo real y situacion financiera
internos.prototype.get_efectivoysituacion = function (req, res, next) {
  var self = this;
  var idReporte = req.query.idreporte;
  var idAgencia = req.query.idcia;
  var anio = req.query.anio;

  var params = [
    { name: 'IdAgencia', value: idAgencia, type: self.model.types.INT },
    { name: 'IdReporte', value: idReporte, type: self.model.types.INT },
    { name: 'Anio', value: anio, type: self.model.types.STRING }
  ];

  this.model.query('SP_EFECTIVO_REAL_Y_SITUACION_FINANCIERA', params, function (error, result) {
    console.log(params);
    self.view.expositor(res, {
      error: error,
      result: result,
    });
  });
};

// internos.prototype.post_internos = function(req, res, next) {
// var self = this;
// var name = req.body.name;
// var apepaterno =  req.body.apepaterno;
// var apematerno = req.body.apematerno;
// var correo =  req.body.correo;
// var password =  req.body.password;

// var params = [
//  { name: 'nombre', value: name , type: self.model.types.STRING }
// ,{ name: 'apepaterno', value: apepaterno, type: self.model.types.STRING }
// ,{ name: 'apematerno', value: apematerno , type: self.model.types.STRING }
// ,{ name: 'correo', value: correo, type: self.model.types.STRING }
// ,{ name: 'password', value: password, type: self.model.types.STRING }
// ];

// try {
//     this.model.post('INS_PROFESOR_SP', params, function(error, result){
//         self.view.expositor(res, {
//             error: error,
//             result: result
//         });
//     });
//     console.log("Se inserto con exito al usuario");
// } catch (error) {
//     console.log('Mensaje: ' + error);
// }
// };

module.exports = internos;
