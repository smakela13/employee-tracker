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
				'View All Employees by Department',
				'View All Employees by Manager',
				'Add Employee',
				'Remove Employee',
				'Update Employee Role',
				'Update Employee Manager',
				'View All Roles',
				'Add Department',
				'Remove Department',
				'Add Role',
        'Remove Role',
        'View Budget by Department',
			],
		})
		.then((answer) => {
			switch (answer.action) {
				case 'View All Employees':
					viewEmployees();
					break;

				case 'View All Employees by Department':
					viewEmpDepartments();
					break;

				case 'View All Employees by Manager':
					viewEmpManagers();
					break;

				case 'Add Employee':
					addEmployee();
					break;

				case 'Remove Employee':
					removeEmployee();
					break;

				case 'Update Employee':
					updateEmployee();
					break;

				case 'Update Employee Role':
					updateEmpRole();
					break;

				case 'Update Employee Manager':
					updateEmpManager();
					break;

				case 'View All Roles':
					viewRoles();
					break;

				case 'Add Department':
					addDepartment();
					break;

				case 'Remove Department':
					removeDepartment();
					break;

				case 'Add Role':
					addRole();
					break;

				case 'Remove Role':
					removeRole();
					break;

				case 'View Budget by Department':
					viewBudget();
					break;

				default:
					console.log(`Invalid action: ${answer.action}`);
					break;
			}
		});
};
