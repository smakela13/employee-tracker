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
}

function addEmployee() {
	const roleData = [];
	const roleNames = [];
	const query = 'SELECT * FROM role';
	connection.query(query, (err, res) => {
		if (err) throw err;
		res.forEach((row) => {
			roleNames.push(row.title);
			roleData.push({
				title: row.title,
				id: row.id,
				salary: row.salary,
				department_id: row.department_id,
			});
		});
	});

	inquirer
		.prompt([
			{
				name: 'first_name',
				type: 'input',
				message: 'Provide the first name of your employee.',
			},
			{
				name: 'last_name',
				type: 'input',
				message: 'Provide the last name of your employee.',
			},
			{
				name: 'role',
				type: 'list',
				message: 'Provide the role for your employee.',
				choices: roleNames,
			},
			{
				name: 'manager_id',
				type: 'input',
				message: 'Provide the manager id for your employee.',
			},
		])
		.then((answer) => {
			// Get and store roleID from roleData
			let roleID = 0;
			roleData.forEach((data) => {
				if (data.title === answer.role) {
					roleID = data.id;
				}
			});
			console.log(`id ${roleID} ${answer.role} ${answer.manager_id} `);
			// inserts to db
			connection.query(
				'INSERT INTO employee SET ?',
				{
					first_name: answer.first_name,
					last_name: answer.last_name,
					role_id: roleID,
					manager_id: answer.manager_id,
				},
				(err, res) => {
					if (err) throw err;
					console.log(
						`${answer.first_name} ${answer.last_name} was successfully added.`
					);
					console.table('Current Employees:', res);
					employeeTracker();
				}
			);
		});
}

function viewEmployees() {
	const query = 'SELECT * FROM employee';
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.log(res.length + ' employees found!');
		console.table('Current Employees:', res);
		employeeTracker();
	});
}

function viewRoles() {
	const query = 'SELECT * FROM role';
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.log(res.length + ' employees found!');
		console.table('Current Employees by Manager:', res);
		employeeTracker();
	});
}

function addRole() {
	const roleNames = [];
	const departmentNames = {};
	const query = 'SELECT * FROM role INNER JOIN department ON role.department_id = department.id';
	connection.query(query, (err, res) => {
		if (err) throw err;
		res.forEach((row) => {
			roleNames.push(row.title);
			departmentNames[row.name] = row.department_id;
		});
		promptNewRole(departmentNames);
	});
}

function promptNewRole(departments) {
	inquirer
		.prompt([
			{
				name: 'title',
				type: 'input',
				message: 'Provide add a role title for your company.',
			},
			{
				name: 'salary',
				type: 'input',
				message: 'Provide the salary for your role.',
			},
			{
				name: 'department_id',
				type: 'list',
				message: 'Provide the department id for your role.',
				choices: Object.keys(departments),
			},
		])
		.then((answer) => {
			insertNewRole(answer, departments);
		});
}

function insertNewRole(answer, departments) {
	connection.query(
		'INSERT INTO role SET ?',
		{
			title: answer.title,
			salary: answer.salary,
			department_id: departments[answer.department_id],
		},
		(err, res) => {
			if (err) throw err;
			console.log(`${answer.title} was successfully added.`);
			employeeTracker();
		}
	);
}

function viewDepartments() {
	const query = 'SELECT * FROM department';
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.log(res.length + ' employees found!');
		console.table('Current Employees by Department:', res);
		employeeTracker();
	});
}

function addDepartment() {
	inquirer
		.prompt([
			{
				name: 'first_name',
				type: 'input',
				message: 'Provide the first name of your employee.',
			},
			{
				name: 'last_name',
				type: 'input',
				message: 'Provide the last name of your employee.',
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
				message: 'Provide the role for your employee.',
			},
		])
		.then((answer) => {
			connection.query(
				'SELECT * INSERT INTO employee SET ?',
				{
					first_name: answer.first_name,
					last_name: answer.last_name,
					role_id: role_id,
					manager_id: answer.manager_id,
				},
				(err, res) => {
					if (err) throw err;
					console.log(
						`${answer.first_name} ${answer.last_name} was successfully added.`
					);
					employeeTracker();
				}
			);
		});
}
