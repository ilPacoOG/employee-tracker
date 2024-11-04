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
//From assignment readme. I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
//Start the application by asking the user what they would like to do
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
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
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
        }
        else {
            console.table(res.rows);
        }
        startApp();
    });
}
// View all roles
function viewRoles() {
    client.query(`SELECT role.id, role.title, role.salary, department.name AS department
         FROM role
         JOIN department ON role.department_id = department.id`, (err, res) => {
        if (err) {
            console.error('Error fetching roles:', err);
        }
        else {
            console.table(res.rows);
        }
        startApp();
    });
}
// View all employees
function viewEmployees() {
    client.query(`SELECT 
            employee.id AS employee_id, 
            employee.first_name, 
            employee.last_name, 
            role.title AS role_title, 
            role.salary, 
            department.name AS department_name, 
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
            FROM employee
            JOIN role ON employee.role_id = role.id
            JOIN department ON role.department_id = department.id
            LEFT JOIN employee AS manager ON employee.manager_id = manager.id`, (err, res) => {
        if (err) {
            console.error('Error fetching employees:', err);
        }
        else {
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
            }
            else {
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
            }
            else {
                console.log('Role added successfully');
            }
            startApp();
        });
    });
}
// Add an employee
function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the first name of the employee:'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the last name of the employee:'
        },
        {
            type: 'number',
            name: 'role_id',
            message: 'Enter the role ID of the employee:'
        },
        {
            type: 'number',
            name: 'manager_id',
            message: 'Enter the manager ID of the employee:'
        }
    ]).then((answers) => {
        client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err, res) => {
            if (err) {
                console.error('Error adding employee:', err);
            }
            else {
                console.log('Employee added successfully');
            }
            startApp();
        });
    });
}
// Update an employee role
function updateEmployeeRole() {
    inquirer.prompt([
        {
            type: 'number',
            name: 'employee_id',
            message: 'Enter the ID of the employee you want to update:'
        },
        {
            type: 'number',
            name: 'role_id',
            message: 'Enter the new role ID of the employee:'
        }
    ]).then((answers) => {
        client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id], (err, res) => {
            if (err) {
                console.error('Error updating employee role:', err);
            }
            else {
                console.log('Employee role updated successfully');
            }
            startApp();
        });
    });
}
startApp();
// As time permits, I would like to add a function that creates and seeds the database with the schema.sql and seeds.sql files when the app is started.
