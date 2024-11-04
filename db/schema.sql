-- The basic outline for the code below was taken from the 28-Stu_Mini-Project example in the class repository. I modified it to fit the parameters of the Challenge 10 readme to create tables for department, role, and employee. I also added a manager_id column to the employee table to allow for the creation of a manager_id foreign key.

DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;

\c employee_tracker_db;

CREATE TABLE department (
    id: SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) 
    REFERENCES department(id)
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) 
    REFERENCES role(id),
    FOREIGN KEY (manager_id) 
    REFERENCES employee(id)
);