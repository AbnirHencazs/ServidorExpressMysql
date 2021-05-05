//Web Socket: https://github.com/websockets/ws
var mysql = require('mysql');
var http = require('http');
var https = require('https');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8085 });


console.log('Iniciando server');
var fechaActual = new Date(2000, 11, 24, 10, 33, 30, 0);  // Date(year, month, day, hours, minutes, seconds, milliseconds)

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws, req) {
  //console.log('Cliente conectado:' + req.connection.remoteAddress);
  //Clientes recepcion de datos
  ws.on('message', function incoming(data) {
    //Hearbeat detectado
    if(data == "@"){
      console.log('received:%s', "Hearbeat");
      return;
    }
    
    if(data.includes("NIVELAGUA")){
      console.log("WATER READ");
      const porcentajeCadena = data.substr(10,5);
      const porcentajeNumero = parseFloat(porcentajeCadena);
      const referencia = 'sensor prueba';
      const fechaLectura = new Date();
      GuardarNivelAgua(referencia, porcentajeNumero, fechaLectura.toISOString());
    }
    //Guardar dato recepcionado
    else if(data.length == "FF009210000xxx".length){
      if(data.substr(2,1) == "0"){
        console.log("GUARDAR EVENTO EN MYSQL");
        var can = data.substr(3,2);
        var pin = data.substr(5,1);
        var percent = data.substr(6,3);
        var time = data.substr(9,2);
        var rgb = data.substr(11,3);
        if(parseInt(percent) == NaN)
          percent = -1;
        GuardarDato(can, pin, percent, rgb);       //FF1557xxxxxF00 
      }
    }
    //Mostramos el dato
    console.log('received:%s', data);  
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      //if (client !== ws && client.readyState === WebSocket.OPEN) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
  //Cliente desconectados
});


function GuardarDato(can, pin, percent, rgb){
  //Algoritmo que guarda en la base de dato
  let conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ALAala123,.-',
    database: 'Accesa',
    port: 3306
  });  

  //Ejecutar almecenado
  conexion.connect(function(err){
    if (err) throw err;
    //Realizar llamado
    conexion.query('Call ActualizaDispositivo(?,?,?,?)',[can, pin, percent, rgb], function(err, results) { 
      if (err) throw err;
      //Consultas del boleto
      if(results[0][0].estatus == '1'){  
        console.log(`--> ACTUALIZADO CAN:${can},PIN:${pin},PORCIENTO:${percent},RGB:${rgb}`); 
      }else{
        console.log(`--> ERROR AL ACTUALIZAR EL CAN:${can},PIN:${pin},PORCIENTO:${percent},RGB:${rgb}`); 
      }
    }); //Fin function and query 
    //Cerrar conexion
    conexion.end();
  });
}

function GuardarNivelAgua(referencia, lectura, fechaLectura){
  const conexionDB = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'ALAala123,.-',
    database: 'Joya',
    port: 3306
  });
  conexionDB.connect((err)=>{
    if(err) throw err;
    conexionDB.query('INSERT INTO nivelagua (referencia, lectura, fechalectura) VALUES(?, ?, ?)',[referencia, lectura, fechaLectura], (err, filas)=>{
      if(err) throw err;
      console.log(filas);
    });
    conexionDB.end();
  })
}

//Limpiar pantalla cada minuto
setInterval(function (){
  //process.stdout.write("\033c");
  //console.log("Pantalla limpiada");
  //console.log("Proceso: " + ++timesAux);
  var d = new Date();

  if(d.getDate() != fechaActual.getDate()){
  	var rtc = "FF"+"R"+"01"; //FFR01091219124702
    //Genera cadena de envio
    rtc += stringToNum(d.getDate(), 2);         //Dia del mes
    rtc += stringToNum(d.getMonth()+1, 2);       //Mes
    rtc += stringToNum(d.getFullYear().toString().substr(2,2), 2);  //Año
    rtc += stringToNum(d.getHours(), 2);
    rtc += stringToNum(d.getMinutes(), 2);
    rtc += stringToNum(d.getDay()+1, 2);
  	wss.broadcast(rtc); 
  	fechaActual = new Date();
  	console.log("Actualizar hora");
  }
}, 60000); 

//Manda Heartbeat
setInterval(function (){
  wss.broadcast("@");
}, 20000); 

/****************************************************/
function stringToNum(numero, size){
  var cadena = "";
  numero += "";  //Convertir a cadena 
  size -= numero.length;
  for(var i = 0; i < size; i++)
  	cadena += "0";

  cadena += numero;

  return cadena
 }
 /****************************************************/