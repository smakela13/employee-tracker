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
	const query = 'SELECT * FROM role';
	connection.query(query, (err, res) => {
		if (err) throw err;
		const rolesInfo = getRoleData(res);
		promptNewEmployee(rolesInfo.name, rolesInfo.data);
	});
}

function getRoleData(res) {
	const roleData = [];
	const roleNames = [];
	res.forEach((row) => {
		roleNames.push(row.title);
		roleData.push({
			title: row.title,
			id: row.id,
			salary: row.salary,
			department_id: row.department_id,
		});
	});
	return {name: roleNames, data: roleData}
}

function promptNewEmployee(roleNames, roleData) {
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
			const roleID = roleData.find(data => data.title === answer.role).id;
			// inserts to db
			insertNewEmployees(answer, roleID);
		});
}

function insertNewEmployees(answer, roleID) {
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
			employeeTracker();
		}
	);
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

function updateEmpRole() {
	let empsInfo = false;
	let rolesInfo = false;
	const query = 'SELECT * FROM employee';
	connection.query(query, (err, res) => {
		if (err) throw err;
		empsInfo = getEmpData(res);
	});

	const roleQuery = 'SELECT * FROM role';
	connection.query(roleQuery, (err, res) => {
		if (err) throw err;
		rolesInfo = getRoleData(res);
	});

	if (empsInfo && rolesInfo) {
		console.log(res.length + ' employees found!');
		console.log(rolesInfo, 'rolesInfo');
		promptEmpUpdate(empsInfo, rolesInfo);
	}

	// connection.query('UPDATE employee SET ? WHERE ?',
	// 	[{
	// 		role_id: 3
	// 	},
	// 	{
	// 		id: 7
	// 	}]
	// );
}

// TODO: Add a getEmpData() that resembles getRoleData()
function getEmpData(res) {
	const empData = [];
	const empNames = [];
	res.forEach((row) => {
		empNames.push(row.first_name + ' ' + row.last_name);
		empData.push({
			first_name: row.first_name,
			last_name: row.last_name,
			role_id: row.role_id,
			manager_id: row.manager_id,
		});
	});
	return { name: empNames, data: empData };
}

function promptEmpUpdate(empObj, roleObj) {
	console.log("empUpdate", roleObj);
	inquirer
		.prompt([
			{
				name: 'employee',
				type: 'list',
				message: 'Provide the name of the employee you wish to update.',
				choices: empObj.name,
			},
			{
				name: 'role',
				type: 'list',
				message:
					'Provide the role title of the employee you wish to update.',
				choices: roleObj.name,
			},
		])
		.then((answer) => {
			console.log('answer');
			console.log(empObj.find((data) => data.name === answer.employee).data.role_id);
			const empInfo = empObj.find(data => data.name === answer.employee).data.role_id;
			console.log(empInfo);
			const roleInfo = roleObj.find(data => data.name === answer.role).id;
			insertUpdatedEmployee(answer, empInfo, roleInfo);
		});
}

function insertUpdatedEmployee(answer, empInfo, roleInfo) {
				connection.query(
				'UPDATE employee SET ? WHERE ?',
				{
					first_name: answer.first_name,
					role_id: roleID
				},
				(err, res) => {
					if (err) throw err;
					console.log(`${answer.first_name} was successfully updated.`);
					employeeTracker();
				}
			);
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
	const query = 'SELECT * FROM department';
	connection.query(query, (err, res) => {
		if (err) throw err;
		});
		inquirer
			.prompt([
				{
					name: 'name',
					type: 'input',
					message: 'Provide the name of your department.',
				},
			])
			.then((answer) => {
				connection.query(
					'INSERT INTO department SET ?',
					{
						name: answer.name,
					},
					(err, res) => {
						if (err) throw err;
						console.log(`${answer.name} was successfully added.`);
						employeeTracker();
					}
				);
			});
}

function exit() {
	connection.end();
}