const connection = require('./lib/connection');
const inquirer = require('inquirer');

inquirer
    .prompt([
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
            ],
        },
    ])
    .then((answers) => {
        switch (answers.action) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
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
            default:
                console.log('Invalid action.');    
        }
    });

    function viewAllDepartments() {
        connection.query('SELECT * FROM departments', (err, results) => {
            if (err) throw err;
            //Format and display department data
        });
    }

    function viewAllRoles() {
        connection.query('SELECT * FROM roles', (err, results) => {
            if (err) throw err;
            //Format and display role data
        });
    }

    function viewAllEmployees() {
        connection.query('SELECT * FROM employees', (err, results) => {
            if (err) throw err;
            //Format and display employee data
        });
    }

    function addDepartment() {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'departmentName',
                    message: 'Enter the name of the department:',
                }
            ])
            .then((answers) => {
                // Add the department to the database
            })
    }

    function addRole() {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'roletName',
                    message: 'Enter the name of the role:',
                }
            ])
            .then((answers) => {
                // Add the role to the database
            })
    }

    function addEmployee() {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'employeeName',
                    message: 'Enter the name of the employee:',
                }
            ])
            .then((answers) => {
                // Add the employee to the database
            })
    }

    function updateEmployeeRole() {

    }