const inquirer = require('inquirer');
const consoleTable = require('console.table');
const connection = require('./config/connection');

connection.connect((err) => {
	if (err) throw err;
	employeeTracker();
});

const employeeTracker = () => {
	inquirer
		.prompt({
			name: 'action',
			type: 'list',
			message: 'What would you like to do?',
			choices: [
				'View All Employees',
				'Add Employee',
				'Remove Employee',
				'Update Employee Role',
				'View All Roles',
				'Add Role',
				'Remove Role',
				'View All Departments',
				'Add Department',
				'Remove Department',
				'Exit',
			],
		})
		.then((answer) => {
			switch (answer.action) {
				case 'View All Employees':
					viewEmployees();
					break;

				case 'Add Employee':
					addEmployee();
					break;

				case 'Remove Employee':
					removeEmployee();
					break;

				case 'Update Employee Role':
					updateEmpRole();
					break;

				case 'View All Roles':
					viewRoles();
					break;

				case 'Add Role':
					addRole();
					break;

				case 'Remove Role':
					removeRole();
					break;

				case 'View All Departments':
					viewDepartments();
					break;

				case 'Add Department':
					addDepartment();
					break;

				case 'Remove Department':
					removeDepartment();
					break;

				case 'Exit':
					exit();
					break;

				default:
					console.log(`Invalid action: ${answer.action}`);
					break;
			}
		});
};

function viewEmployees() {
	const query = 'SELECT * FROM employee';
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.log(res.length + ' employees found!');
		console.table('Current Employees:', res);
		employeeTracker();
	});
};

function addEmployee() {
	inquirer.prompt([
		{
			name: 'first_name',
			type: 'input',
			message: 'Provide the first name of your employee.'
		},
		{
			name: 'last_name',
			type: 'input',
			message: 'Provide the last name of your employee.'
		},
		{
			name: 'role',
			type: 'list',
			choices: function () {
				const roleArr = [];
				for (let i = 0; i < res.length; i++) {
					roleArr.push(res[i].title);
				}
				return roleArr;
			},
			message: 'Provide the role for your employee.'
		}
	]).then((answer) => {
		connection.query('SELECT * INSERT INTO employee SET ?',
			{
				first_name: answer.first_name,
				last_name: answer.last_name,
				role_id: answer.role,
				manager_id: answer.manager_id
			},
			(err, res) => {
				if (err) throw err
				console.log(`${answer.first_name} ${answer.last_name} was successfully added.`)
				employeeTracker();
			}
		);
	});
};

function viewEmployees() {
	const query = 'SELECT * FROM employee';
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.log(res.length + ' employees found!');
		console.table('Current Employees:', res);
		employeeTracker();
	});
};

function viewRoles() {
	const query = 'SELECT * FROM role';
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.log(res.length + ' employees found!');
		console.table('Current Employees by Manager:', res);
		employeeTracker();
	});
};

function addRole() {
	inquirer.prompt([
		{
			name: 'first_name',
			type: 'input',
			message: 'Provide the first name of your employee.'
		},
		{
			name: 'last_name',
			type: 'input',
			message: 'Provide the last name of your employee.'
		},
		{
			name: 'role',
			type: 'list',
			choices: function () {
				const roleArr = [];
				for (let i = 0; i < array.length; i++) {
					roleArr.push(array[i].title);
				}
				return roleArr;
			},
			message: 'Provide the role for your employee.'
		}
	]).then((answer) => {
		connection.query('SELECT * INSERT INTO employee SET ?',
			{
				first_name: answer.first_name,
				last_name: answer.last_name,
				role_id: role_id,
				manager_id: answer.manager_id
			},
			(err, res) => {
			if (err) throw err;
          console.log(`${answer.first_name} ${answer.last_name} was successfully added.`);
          employeeTracker();
        }
      );
    });
};

function viewDepartments() {
	const query = 'SELECT * FROM department';
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.log(res.length + ' employees found!');
		console.table('Current Employees by Department:', res);
		employeeTracker();
	});
};

function addDepartment() {
	inquirer.prompt([
		{
			name: 'first_name',
			type: 'input',
			message: 'Provide the first name of your employee.'
		},
		{
			name: 'last_name',
			type: 'input',
			message: 'Provide the last name of your employee.'
		},
		{
			name: 'role',
			type: 'list',
			choices: function () {
				const roleArr = [];
				for (let i = 0; i < array.length; i++) {
					roleArr.push(array[i].title);
				}
				return roleArr;
			},
			message: 'Provide the role for your employee.'
		}
	]).then((answer) => {
		connection.query('SELECT * INSERT INTO employee SET ?',
			{
				first_name: answer.first_name,
				last_name: answer.last_name,
				role_id: role_id,
				manager_id: answer.manager_id
			},
			(err, res) => {
			if (err) throw err;
          console.log(`${answer.first_name} ${answer.last_name} was successfully added.`);
          employeeTracker();
        }
      );
    });
};