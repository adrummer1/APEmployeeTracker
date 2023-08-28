const connection = require("./lib/connection");
const inquirer = require("inquirer");

const promptUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        default:
          console.log("Invalid action.");
      }
    });
};

// Functions for supplying database content
const viewAllDepartments = () => {
  const sql = `SELECT department.id AS id, department.dep_name AS department FROM department`;
  connection.promise().query(sql, (err, res) => {
    if (err) throw error;
    promptUser();
  });
};

const viewAllRoles = () => {
  const sql = `SELECT role.id, role.title, department.dep_name AS department 
                    FROM role INNER JOIN department ON role.department.id = department.id`;
  connection.promise().query(sql, (err, res) => {
    if (err) throw error;
    promptUser();
  });
};

const viewAllEmployees = () => {
  const sql = `SELECT employee.id, employee.first_name, emplyee.last_name,
                    role.title, department.dep_name AS department, role.salary 
                    FROM employee, role, department WHERE departement.id = role.department.id 
                    AND role.id = employee.role_id ORDER BY emplyee.id ASC`;
  connection.promise().query(sql, (err, res) => {
    if (err) throw error;
    promptUser();
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What is the name of the new department?",
      },
    ])
    .then((answer) => {
      let sql = `INSERT INTO department (dep_name) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (err, res) => {
        if (err) throw error;
        viewAllDepartments();
      });
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newRole",
        message: "What is the name of the new role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the new role?",
      },
      {
        type: "input",
        name: "department",
        message: "What department will this new role be in?",
      },
    ])
    .then((answer) => {
      let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
      connection.query(sql, answer.newRole, (err, res) => {
        if (err) throw error;
        viewAllRoles();
      });
    });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the first name of the new employee?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the last name of the new employee?",
      },
      {
        type: "input",
        name: "role",
        message: "What is the role of the new employee?",
      },
      {
        type: "input",
        name: "manager",
        message: "Who is the manager of the new employee?",
      },
    ])
    .then((answer) => {
      let sql = `INSER INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
      connection.query(sql, answer.newEmployee, (err, res) => {
        if (err) throw error;
        viewAllEmployees;
      });
    });
};

const updateEmployeeRole = () => {
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, 
                    role.id AS "role_id" FROM employee, role, department WHERE
                    department.id AND role.id = employee.role_id`;
  connection.promise().query(sql, (err, res) => {
    if (err) throw error;
    let employeeNames = [];
    response.forEach((employee) => {
      employeeNames.push(`${employee.first_name} ${employee.last_name}`);
    });
    let sql = `SELECT role.id, role.title FROM role`;
    connection.promise().query(sql, (err, res) => {
      if (error) throw error;
      let rolesArray = [];
      response.forEach((role) => {
        rolesArray.push(role.title);
      });
      inquierer
        .prompt([
          {
            type: "list",
            name: "chosenEmployee",
            message: "Which employee has a new role?",
            choices: employeeNames,
          },
          {
            type: "list",
            name: "chosenRole",
            message: "What is their new role?",
            choices: rolesArray,
          },
        ])
        .then((answer) => {
          let newTitleId, employeeId;
          response.forEach((role) => {
            if (answer.chosenRole === role.title) {
              newTitleId = role.id;
            }
          });

          response.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });
          let updateSql = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
          connection.query(updateSql, [newTitleId, employeeId], (err) => {
            if (err) throw error;
            promptUser();
          });
        });
    });
  });
};
