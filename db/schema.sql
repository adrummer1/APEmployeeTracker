DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
    id INT PRIMARY KEY,
    dep_name VARCHAR(30),
);

CREATE TABLE role (
    id INT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    dep_id INT
);

CREATE TABLE employee (
    id INT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT
);

ALTER TABLE role 
ADD CONSTRAINT fk_dep_id
FOREIGN KEY (dep_id)
REFERENCES deparment(id);


ALTER TABLE employee 
ADD CONSTRAINT fk_role_id
FOREIGN KEY (role_id)
REFERENCES role(id);