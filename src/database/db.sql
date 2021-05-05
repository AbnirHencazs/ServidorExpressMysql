--Creando baes de datos
CREATE DATABASE crudenodejsmysql;

--using database
use crudenodejsmysql;

--creating a table

CREATE TABLE customer (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY_KEY,
    name VARCHAR(45) NOT NULL,
    address VARCHAR(100) NOT NULL,
    phone VARCHAR(15) 
);
--to show tables  
SHOW TABLES

--to describe table
describe customer