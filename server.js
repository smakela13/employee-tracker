// Loads the modules required to run the application
const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('./config/connection');

// Connection to the database
connection.connect((err) => {
	if (err) throw err;
	employeeTracker();
});

// The main menu of the application
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

// Allows user to view employees, then takes user back to the menu
function viewEmployees() {
	const query = 'SELECT * FROM employee';
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.table(' Current Employees:', res);
		employeeTracker();
	});
}

/* First step in allowing a user to add an employee.
Queries the database and then calls for the next function promptNewEmployee */
function addEmployee() {
	const query = 'SELECT * FROM role';
	connection.query(query, (err, res) => {
		if (err) throw err;
		const rolesInfo = getRoleData(res);
		promptNewEmployee(rolesInfo.name, rolesInfo.data);
	});
}

/* Prompts the user to enter information on the new employee,
then calls for the next function that inserts the new information into the database */
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
			const roleID = roleData.find((data) => data.title === answer.role).id;
			// inserts to db
			insertNewEmployees(answer, roleID);
		});
}

// Inserts the new employee into the database, then takes user back to the menu
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
			console.log(`${answer.first_name} ${answer.last_name} was successfully added.`);
			employeeTracker();
			viewEmployees();
		}
	);
}

/* First step in allowing a user to remove an employee.
Queries the database and then calls for the next function promptRemoveEmployee */
function removeEmployee() {
	let empsInfo = false;
	const query = 'SELECT * FROM employee';
	connection.query(query, (err, res) => {
		if (err) throw err;
		empsInfo = getEmpData(res);
		promptRemoveEmployee(empsInfo);
	});
}

/* Prompts the user to choose which employee to remove,
then calls for the next function that removes the employee from the database */
function promptRemoveEmployee(empObj) {
	inquirer
		.prompt([
			{
				name: 'employee',
				type: 'list',
				message: 'Provide the name of the employee you wish to remove.',
				choices: empObj.name,
			},
		])
		.then((answer) => {
			const empInfo = empObj.data.find((worker) => worker.first_name + ' ' + worker.last_name === answer.employee).id;
			// inserts to db
			removeEmployeeDB(answer.employee, empInfo);
		});
}

// Removes the employee from the database, then takes user back to the menu
function removeEmployeeDB(name, empInfo) {
	connection.query(
		'DELETE FROM employee WHERE ?',
		{
			id: empInfo
		},
		(err, res) => {
			if (err) throw err;
			console.log(`${name} was successfully removed.`);
			employeeTracker();
			viewEmployees();
		}
	);
}

/* Begins the process of updating an employee role, which queries 
the database and then calls for prompting the user to fill out the form */
function updateEmpRole() {
	let empsInfo = false;
	let rolesInfo = false;
	const query = 'SELECT * FROM employee';
	connection.query(query, (err, res) => {
		if (err) throw err;
		empsInfo = getEmpData(res);

		const roleQuery = 'SELECT * FROM role';
		connection.query(roleQuery, (err, res) => {
			if (err) throw err;
			rolesInfo = getRoleData(res);

			promptEmpUpdate(empsInfo, rolesInfo);
		});
	});
}

/* Prompts the user to enter the updated employee role information, then 
calls for inserting the new information into database */
function promptEmpUpdate(empObj, roleObj) {
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
			const empInfo = empObj.data.find((worker) => worker.first_name + ' ' + worker.last_name === answer.employee).role_id;
			const roleInfo = roleObj.data.find((job) => job.title === answer.role).id;
			insertUpdatedEmployee(answer.employee, empInfo, roleInfo);
		});
}

// Inserts the updated employee role into the database, then takes user back to the menu
function insertUpdatedEmployee(name, empInfo, roleInfo) {
	connection.query(
		'UPDATE employee SET ? WHERE ?',
		[{
			role_id: roleInfo
		},
		{
			id: empInfo
		}],
		(err, res) => {
			if (err) throw err;
			console.log(`${name} was successfully updated.`);
			employeeTracker();
			viewEmployees();
		}
	);
}

// Allows user to view the roles, then takes user back to the menu
function viewRoles() {
	const query = 'SELECT * FROM role';
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.table(' Current Roles:', res);
		employeeTracker();
	});
}

/* Begins the process of adding a new role, which starts with querying 
the database and calling the next function to start */
function addRole() {
	const roleNames = [];
	const departmentNames = {};
	const query =
		'SELECT * FROM role INNER JOIN department ON role.department_id = department.id';
	connection.query(query, (err, res) => {
		if (err) throw err;
		res.forEach((row) => {
			roleNames.push(row.title);
			departmentNames[row.name] = row.department_id;
		});
		promptNewRole(departmentNames);
	});
}

// Prompts user for the new role information
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

// Inserts the new role to the database, then takes user back to the menu
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
			viewRoles();
		}
	);
}

/* First step in allowing a user to remove a role.
Queries the database and then calls for the next function promptRemoveRole */
function removeRole() {
	let rolesInfo = false;
	const query = 'SELECT * FROM role';
	connection.query(query, (err, res) => {
		if (err) throw err;
		rolesInfo = getRoleData(res);
		promptRemoveRole(rolesInfo);
	});
}

/* Prompts the user to choose which role to remove,
then calls for the next function that removes the role from the database */
function promptRemoveRole(roleObj) {
	inquirer
		.prompt([
			{
				name: 'role',
				type: 'list',
				message: 'Provide the name of the role title you wish to remove.',
				choices: roleObj.name,
			},
		])
		.then((answer) => {
			const roleInfo = roleObj.data.find((job) => job.title === answer.role).id;
			// inserts to db
			removeRoleDB(answer.role, roleInfo);
		});
}

// Removes the employee from the database, then takes user back to the menu
function removeRoleDB(name, roleInfo) {
	connection.query(
		'DELETE FROM role WHERE ?',
		{
			id: roleInfo
		},
		(err, res) => {
			if (err) throw err;
			console.log(`${name} was successfully removed.`);
			employeeTracker();
			viewRoles();
		}
	);
}

// Allows user to view a department, then takes user back to the menu
function viewDepartments() {
	const query = 'SELECT * FROM department';
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.table(' Current Departments:', res);
		employeeTracker();
	});
}

// Allows user to add a department, then takes user back to the menu
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
					viewDepartments();
				}
			);
		});
}

// Gets the role data for the user
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
	return { name: roleNames, data: roleData };
}

// Gets the employee data for the user
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
			id: row.id,
		});
	});
	return { name: empNames, data: empData };
}

// Allows user to exit the app by ending the connection
function exit() {
	connection.end();
}
