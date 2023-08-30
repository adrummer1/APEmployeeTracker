// Required imports
const connection = require("./lib/connection");
const inquirer = require("inquirer");
const figlet = require("figlet");

// Console header
function renderFigletText() {
  figlet("Employee Manager", (err, data) => {
    if (err) {
      console.log("Error rendering figlet...");
      console.dir(err);
    }
    console.log(data);
    console.log();
    console.log();
    promptUser();
  });
};

renderFigletText();

// Application's initial user prompts
const promptUser = () => {
  inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "View employees by manager",
          "View employees by department",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Update employee manager",
          "View budget by department",
          "Delete a department",
          "Delete a role",
          "Delete an employee",
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
        case "View employees by manager":
          viewEmployeesByManager();
          break;
        case "View employees by department":
          viewEmployeesByDepartment();
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
        case "Update employee manager":
          updateEmployeeManager();
          break;
        case "View budget by department":
          viewDepartmentBudget();
          break;
        case "Delete a department":
          deleteDepartment();
          break;
        case "Delete a role":
          deleteRole();
          break;
        case "Delete an employee":
          deleteEmployee();
          break;
        default:
          console.log("Invalid action.");
      }
    });
};

// Functions for supplying database content for viewAll
const viewAllDepartments = async () => {
  try {
    const sql = `SELECT department.id AS id, department.dep_name AS department FROM department`;
    const [rows, fields] = await connection.promise().query(sql);
    console.table(rows);
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
    console.table(rows);
    promptUser();
  } catch (err) {
    throw err;
  }
};

const viewAllEmployees = async () => {
  try {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name,
              role.title, department.dep_name AS department, role.salary, 
              CONCAT(manager.first_name, '', manager.last_name) AS manager_name
              FROM employee JOIN role ON role.id = employee.role_id 
              JOIN department ON department.id = role.dep_id
              LEFT JOIN employee AS manager ON manager.id = employee.manager_id
              ORDER BY employee.id ASC`;
    const [rows, fields] = await connection.promise().query(sql);
    console.table(rows);
    promptUser();
  } catch (err) {
    throw err;
  }
};

// Functions to add data to the database 
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
          if (err) {
            throw error;
          }
          viewAllEmployees();
        }
      );
    });
};

// Function to update the employee role
const updateEmployeeRole = async () => {
  try {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, 
                    role.id AS "role_id" FROM employee, role, department WHERE
                    department.id AND role.id = employee.role_id`;
    const employees = await connection.promise().query(sql);
    let employeeNames = employees[0].map(
      (employee) => `${employee.first_name} ${employee.last_name}`
    );

    let roleSql = `SELECT role.id, role.title FROM role`;
    const roles = await connection.promise().query(roleSql);
    let rolesArray = roles[0].map((role) => role.title);

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
    roles[0].forEach((role) => {
      if (answer.chosenRole === role.title) {
        newTitleId = role.id;
      }
    });

    employees[0].forEach((employee) => {
      if (`${employee.first_name} ${employee.last_name}` === answer.chosenEmployee) {
        employeeId = employee.id;
      }
    });

    let updateSql = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
    await connection.promise().query(updateSql, [newTitleId, employeeId]);

    await viewAllEmployees();
  } catch (error) {
    throw error;
  }
};

// BONUS functions to delete data from the database
const deleteDepartment = () => {
  inquirer.prompt([
      {
        type: "input",
        name: "departmentID",
        message: "Enter the ID of the department you want to delete:",
      }
    ])
    .then((answer) => {
      let sql = `DELETE FROM department where id = ?`;
      connection.query(sql, [answer.departmentID], (err, res) => {
        if (err) throw err;
        console.log("Department deleted successfully.");
        viewAllDepartments();
      });
    });
  };

  const deleteRole = () => {
    inquirer.prompt([
        {
          type: "input",
          name: "roleID",
          message: "Enter the ID of the role you want to delete:",
        }
      ])
      .then((answer) => {
        let sql = `DELETE FROM role WHERE id = ?`;
        connection.query(sql, [answer.roleID], (err, res) => {
          if (err) {
            throw err;
          }
          console.log("Role deleted successfully.");
          viewAllRoles();
        });
      });
    };

    const deleteEmployee = () => {
      inquirer.prompt([
          {
            type: "input",
            name: "employeeID",
            message: "Enter the ID of the employee you want to delete:",
          }
        ])
        .then((answer) => {
          let sql = `DELETE FROM employee WHERE id = ?`;
          connection.query(sql, [answer.employeeID], (err, res) => {
            if (err) {
              throw err;
            };
            console.log("Employee deleted successfully.");
            viewAllEmployees();
          });
        });
      };

      // BONUS functions to view employees based on their manager or department
      const viewEmployeesByManager = async (managerName) => {
        inquirer.prompt([
          {
            type: "input",
            name: "managerId",
            message: "Please provide a manager ID:",
          }
        ]) .then(async (answer) => {
          try {
            const sql = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id,
                      role.title, department.dep_name AS department, role.salary, 
                      CONCAT(manager.first_name, '', manager.last_name) AS manager_name
                      FROM employee JOIN role ON role.id = employee.role_id 
                      JOIN department ON department.id = role.dep_id
                      LEFT JOIN employee AS manager ON manager.id = employee.manager_id
                      WHERE employee.manager_id = "${answer.managerId}"
                      ORDER BY employee.id ASC`;
            const [rows, fields] = await connection.promise().query(sql);
            console.table(rows);
            promptUser();
          } catch (err) {
            throw err;
          }
        });
      };

      const viewEmployeesByDepartment = async (managerName) => {
        inquirer.prompt([
          {
            type: "input",
            name: "departmentId",
            message: "Pleae provide a department ID:",
          }
        ]) .then(async (answer) => {
          try {
            const sql = `SELECT employee.id, employee.first_name, employee.last_name, department.id,
                      role.title, department.dep_name AS department, role.salary, 
                      CONCAT(manager.first_name, '', manager.last_name) AS manager_name
                      FROM employee JOIN role ON role.id = employee.role_id 
                      JOIN department ON department.id = role.dep_id
                      LEFT JOIN employee AS manager ON manager.id = employee.manager_id
                      WHERE department.id = "${answer.departmentId}"
                      ORDER BY employee.id ASC`;
            const [rows, fields] = await connection.promise().query(sql);
            console.table(rows);
            promptUser();
          } catch (err) {
            throw err;
          }
        });
      };

      // BONUS funcion to update an employee manager
      const updateEmployeeManager = async () => {
        try {
          let sql = `SELECT employee.id, employee.first_name, employee.last_name, 
                          role.id AS "role_id" FROM employee, role, department WHERE
                          department.id AND role.id = employee.role_id`;
          const employees = await connection.promise().query(sql);
          let employeeNames = employees[0].map(
            (employee) => `${employee.first_name} ${employee.last_name}`
          );
      
          const employeeChoices = employeeNames.map((name) => ({ name}));
      
          const answer = await inquirer.prompt([
            {
              type: "list",
              name: "chosenEmployee",
              message: "Which employee has a new manager?",
              choices: employeeChoices,
            },
            {
              type: "list",
              name: "chosenManager",
              message: "Who is their new manager?",
              choices: employeeChoices,
            },
          ]);
      
          let newManagerId, employeeId;
          employees[0].forEach((employee) => {
            if (`${employee.first_name} ${employee.last_name}` === answer.chosenManager) {
              newManagerId = employee.id;
            }
          });
      
          employees[0].forEach((employee) => {
            if (`${employee.first_name} ${employee.last_name}` === answer.chosenEmployee) {
              employeeId = employee.id;
            }
          });
      
          let updateSql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;
          await connection.promise().query(updateSql, [newManagerId, employeeId]);
      
          await viewAllEmployees();
        } catch (error) {
          throw error;
        }
      };

      // BONUS function to view department budget
      const viewDepartmentBudget = async (departmentBudget) => {
        inquirer.prompt([
          {
            type: "input",
            name: "departmentId",
            message: "Pleae provide a department ID:",
          }
        ]) .then(async (answer) => {
        try {
          const sql = `SELECT SUM(role.salary) AS total_budget
          FROM employee
          JOIN role ON role.id = employee.role_id
          JOIN department ON department.id = role.dep_id
          WHERE department.id = ${answer.departmentId}`;
        const [rows, fields] = await connection.promise().query(sql);
        console.table(rows);
        promptUser();
        } catch (err) {
          throw err;
        }
      })
    };


