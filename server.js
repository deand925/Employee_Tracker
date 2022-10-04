const db = require('./db/connection');
const inquirer = require('inquirer');

// Prompt User for Choices
const promptUser = () => {
    inquirer.prompt([
        {
            name: 'choices',
            type: 'list',
            message: 'Please select an option:',
            choices: [
                'View all departments',
                'View all rolles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role'
            ]
        }
    ])
        .then((answers) => {
            const { choices } = answers;

            if (choices === 'View all departments') {
                showDepartments();
            } else if (choices === 'View all rolles') {
                showRoles();
            } else if (choices === 'View all employees') {
                showEmployees();
            } else if (choices === 'Add a department') {
                showAddDepartment();
            } else if (choices === 'Add a role') {
                showAddRole();
            } else if (choices === 'Add an employee') {
                showAddEmployee();
            } else if (choices === 'Update an employee role') {
                showUpdateEmployeeRole();
            }
        })
}

const showDepartments = () => {
    db.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        console.log(res);
    });
    promptUser();
};

const showRoles = () => {

    promptUser();
};

const showEmployees = () => {

    promptUser();
};

const showAddDepartment = () => {
    db.query("INSERT INTO department (id, dept_name) VALUES (5, 'enigineer')",
        function (err, res) {
            if (err) throw err;
            console.log(res);
        }
    );
    promptUser();
};

const showAddRole = () => {

    promptUser();
};

const showAddEmployee = () => {

    promptUser();
};

const showUpdateEmployeeRole = () => {

    promptUser();
};

