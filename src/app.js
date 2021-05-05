const express = require ('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const app = express();

//importing routes
const customerRoutes = require('./routes/customer');

//configuraciones
app.set('port', process.env.PORT || 3001); //checa si el sistema operativo tiene un puerto por default o le da 3000
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: 'ALAala123,.-',
    port: 3306,
    database: 'Joya'
}, 'pool'));
app.use(express.urlencoded({extended: false}));
//routes
app.use('/', customerRoutes);

//statics files
app.use(express.static(path.join(__dirname, 'public')));


app.listen(3000, () => {
    console.log('Server on port 3000');
})