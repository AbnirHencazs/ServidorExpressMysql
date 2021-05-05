const controller = {};

controller.graficar = (req, res) =>{
    console.log(req.params);
    req.getConnection((err,conn) =>{
        conn.query('SELECT id,referencia,lectura, fechalectura FROM nivelagua ORDER BY id DESC LIMIT 20',(err, rows) =>{
            console.log(rows);
            res.render('graph',{
                datos: rows
            })
        });
    })
}

controller.agregaLectura = (req, res) =>{
    console.log(req.body);
    const data = req.body;
    req.getConnection((err, conn) =>{
        conn.query('INSERT INTO nivelagua (referencia, lectura, fechalectura) VALUES(?, ?, ?)', [data.referencia, data.lectura,data.fechalectura], (err, respuesta)=>{
            console.log(respuesta);
            res.redirect('/grafica');
        })
    })
}

controller.list = (req,res) => {
    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM sensoresmag', (err, sensores)=>{
            if(err){
                res.json(err);
            }
            console.log(sensores);
            
            res.render('customers', {
                data: sensores
            });
            
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO sensoresmag set ?', [data], (err, sensor) =>{
            
            res.redirect('/');
        })
    })
}

controller.delete = (req, res) => {
    const {id} = req.params;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM sensoresmag WHERE id = ?', [id], (err, filas) =>{
            res.redirect('/');
        })
    })
}

controller.edit = (req, res) => {
    const {id} = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM sensoresmag WHERE id = ?', [id], (err, sensor) =>{
            console.log(sensor);
            res.render('customer_edit', {
                data: sensor[0]
            })
        })
    })
}

controller.update = (req, res) => {
    const {id} = req.params;
    const nuevoSensor = req.body;
    const {estado} = nuevoSensor;
    console.log(estado);
    req.getConnection((req, conn) =>{
        conn.query('UPDATE sensoresmag set estado = ? WHERE id = ?',[estado, id], (err, rows) =>{
            console.log(rows);
            res.redirect('/');
        });
    });
}

setInterval(function(){console.log("@")},60000);
module.exports = controller;