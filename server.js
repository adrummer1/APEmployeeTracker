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
const viewAllDepartments = async () => {
  try {
    const sql = `SELECT department.id AS id, department.dep_name AS department FROM department`;
    const [rows, fields] = await connection.promise().query(sql);
    promptUser();
  } catch (err) {
    throw err;
  }
};

const viewAllRoles = async () => {
  try {
    const sql = `SELECT role.id AS id, role.title AS title, role.salary AS salary, department.dep_name AS department 
              FROM role JOIN department ON role.dep_id = department.id`;
    const [rows, fields] = await connection.promise().query(sql);
    promptUser();
  } catch (err) {
    throw err;
  }
};

const viewAllEmployees = async () => {
  try {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name,
              role.title, department.dep_name AS department, role.salary 
              FROM employee, role, department WHERE department.id = role.dep_id 
              AND role.id = employee.role_id ORDER BY employee.id ASC`;
    const [rows, fields] = await connection.promise().query(sql);
    console.table(rows);
    promptUser();
  } catch (err) {
    throw err;
  }
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
      connection.query(sql, answer.departmentName, (err, res) => {
        if (err) throw err;
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
        message: "What is the department ID that this new role be in?",
      },
    ])
    .then((answer) => {
      let sql = `INSERT INTO role (title, salary, dep_id) VALUES (?, ?, ?)`;
      connection.query(
        sql,
        [answer.newRole, answer.salary, answer.department],
        (err, res) => {
          if (err) throw err;
          viewAllRoles();
        }
      );
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
        message: "What is the role ID for the role of the new employee?",
      },
      {
        type: "input",
        name: "manager",
        message: "Who is the manager ID for the manager of the new employee?",
      },
    ])
    .then((answer) => {
      let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
      connection.query(
        sql,
        [answer.firstName, answer.lastName, answer.role, answer.manager],
        (err, res) => {
          if (err) throw error;
          viewAllEmployees();
        }
      );
    });
};

const updateEmployeeRole = async () => {
  try {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, 
                    role.id AS "role_id" FROM employee, role, department WHERE
                    department.id AND role.id = employee.role_id`;
    const employees = await connection.promise().query(sql);
    let employeeNames = employees.map(
      (employee) => `${employee.first_name} ${employee.last_name}`
    );

    let roleSql = `SELECT role.id, role.title FROM role`;
    const roles = await connection.promise().query(roleSql);
    let rolesArray = roles.map((role) => role.title);

    const employeeChoices = employeeNames.map((name) => ({ name}));
    const roleChoices = rolesArray.map((title) => ({ name: title }));

    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "chosenEmployee",
        message: "Which employee has a new role?",
        choices: employeeChoices,
      },
      {
        type: "list",
        name: "chosenRole",
        message: "What is their new role?",
        choices: roleChoices,
      },
    ]);

    let newTitleId, employeeId;
    roles.forEach((role) => {
      if (answer.chosenRole === role.title) {
        newTitleId = role.id;
      }
    });

    employees.forEach((employee) => {
      if (`${employee.first_name} ${employee.last_name}`) {
        employeeId = employee.id;
      }
    });

    let updateSql = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
    await connection.promise().query(updateSql, [newTitleId, employeeId]);

    promptUser();
  } catch (error) {
    throw error;
  }
};
    
promptUser();

