import inquirer from 'inquirer';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const client = new Client({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

client.connect();

//I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

//start the application by asking the user what they would like to do
function startApp() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments', 
                'View all roles', 
                'View all employees', 
                'Add a department', 
                'Add a role', 
                'Add an employee', 
                'Update an employee role',
                'Exit'
            ]
        }
    ]).then((answers) => {
        switch (answers.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            // case 'Add an employee':
            //     addEmployee();
            //     break;
            // case 'Update an employee role':
            //     updateEmployeeRole();
            //     break;
            case 'Exit':
                console.log('Goodbye!');
                break;
        }
        
        
    });
}

// View all departments

function viewDepartments() {
    client.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.error('Error fetching departments:', err);
        } else {
            console.table(res.rows);
        }
        startApp(); 
    });
}




// View all roles

function viewRoles() {
    client.query(
        `SELECT role.id, role.title, role.salary, department.name AS department
         FROM role
         JOIN department ON role.department_id = department.id`,
        (err, res) => {
            if (err) {
                console.error('Error fetching roles:', err);
            } else {
                console.table(res.rows);
            }
            startApp(); 
    });
}

// View all employees
function viewEmployees() {
    client.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
         FROM employee
         JOIN role ON employee.role_id = role.id
         JOIN department ON role.department_id = department.id
         LEFT JOIN employee manager ON employee.manager_id = manager.id`,
        (err, res) => {
            if (err) {
                console.error('Error fetching employees:', err);
            } else {
                console.table(res.rows);
            }
            startApp(); 
    });
}



// Add a department

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:'
        }
    ]).then((answers) => {
        client.query('INSERT INTO department (name) VALUES ($1)', [answers.name], (err, res) => {
            if (err) {
                console.error('Error adding department:', err);
            } else {
                console.log('Department added successfully');
            }
            startApp();
        });
    });
}

// Add a role

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role:'
        },
        {
            type: 'number',
            name: 'salary',
            message: 'Enter the salary of the role:'
        },
        {
            type: 'number',
            name: 'department_id',
            message: 'Enter the department ID of the role:'
        }
    ]).then((answers) => {
        client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id], (err, res) => {
            if (err) {
                console.error('Error adding role:', err);
            } else {
                console.log('Role added successfully');
            }
            startApp();
        });
    });
}

// Add an employee
// Update an employee role

startApp();

