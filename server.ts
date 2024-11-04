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
            // case 'View all employees':
            //     viewEmployees();
            //     break;
            // case 'Add a department':
            //     addDepartment();
            //     break;
            // case 'Add a role':
            //     addRole();
            //     break;
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

startApp();
// View all employees
// Add a department
// Add a role
// Add an employee
// Update an employee role
