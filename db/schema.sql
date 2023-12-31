-- Database requirements for department, role, and employee
DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;

USE employees;

CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dep_name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    dep_id INT
);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT
);

-- Data constraints and foreign key parameters
ALTER TABLE role 
ADD CONSTRAINT fk_dep_id
FOREIGN KEY (dep_id)
REFERENCES department(id);


ALTER TABLE employee 
ADD CONSTRAINT fk_role_id
FOREIGN KEY (role_id)
REFERENCES role(id)
ON DELETE set null;
