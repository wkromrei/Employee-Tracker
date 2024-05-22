const inquirer = require('inquirer');
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'Drumset#3', // ! Change this to your own password
  database: 'employees_db',
});

async function mainPrompt() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'action',
      choices: [
        'View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 
        'Add Role', 'View All Departments', 'Add Department', 'Quit'
      ],
    },
  ]);

  switch (answers.action) {
    case "View All Employees":
      await showAllEmployees();
      break;
    case "Add Employee":
      await addEmployee();
      break;
    case "View All Roles":
      await showAllRoles();
      break;
    case "View All Departments":
      await showAllDepartments();
      break;
    case "Add Role":
      await addRole();
      break;
    case "Add Department":
      await addDepartment();
      break;
    case "Quit":
      console.log("Goodbye!");
      pool.end(); // Close the pool connection
      return; // Exit the function to end the loop
  }

  // Call mainPrompt again to loop back to the main menu
  mainPrompt();
}

async function showAllEmployees() {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM employees");
    console.table(res.rows);
  } finally {
    client.release();
  }
}

async function addEmployee() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      message: 'What is their first name?',
      name: 'firstName'
    },
    {
      type: 'input',
      message: 'What is their last name?',
      name: 'lastName'
    },
    {
      type: 'input',
      message: 'What is their role id?',
      name: 'roleId'
    },
    {
      type: 'input',
      message: 'What is their manager id?',
      name: 'managerId'
    }
  ]);

  try {
    await pool.query(
      'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', 
      [answers.firstName, answers.lastName, answers.roleId, answers.managerId]
    );
    console.log(`Added ${answers.firstName} ${answers.lastName} to the database`);
  } catch (err) {
    console.error("Error adding employee to the database", err);
  }
}

async function showAllRoles() {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM roles");
    console.table(res.rows);
  } finally {
    client.release();
  }
}

async function addRole() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      message: 'What is the ID# of the role (unused previously)?',
      name: 'roleId'
    },
    {
      type: 'input',
      message: 'What is the name of the role?',
      name: 'roleName'
    },
    {
      type: 'input',
      message: 'What is salary of the role?',
      name: 'salaryAmount'
    },
    {
      type: 'list',
      message: 'What department does the role belong to?',
      name: 'department',
      choices: ['1', '2', '3', '4']
    },
  ]);

  try {
    await pool.query(
      'INSERT INTO roles (id, title, salary, department) VALUES ($1, $2, $3, $4)', 
      [answers.roleId, answers.roleName, answers.salaryAmount, answers.department]
    );
    console.log(`Added ${answers.roleName} to the database`);
  } catch (err) {
    console.error("Error adding role to the database", err);
  }
}

async function addDepartment() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      message: 'What is the name of the department?',
      name: 'departmentName'
    }
  ]);

  try {
    await pool.query(
      'INSERT INTO departments (name) VALUES ($1)', 
      [answers.departmentName]
    );
    console.log(`Added ${answers.departmentName} to the database`);
  } catch (err) {
    console.error("Error adding department to the database", err);
  }
}

async function showAllDepartments() {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM departments");
    console.table(res.rows);
  } finally {
    client.release();
  }
}

// Start the prompt loop
mainPrompt();
