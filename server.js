const db = require('./db/connection');
const inquirer = require('inquirer');
const res = require('express/lib/response');

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
                addDepartment();
            } else if (choices === 'Add a role') {
                addRole();
            } else if (choices === 'Add an employee') {
                addEmployee();
            } else if (choices === 'Update an employee role') {
                updateEmployeeRole();
            }
        })
}

const showDepartments = () => {
    db.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        console.table(res);
    });
    promptUser();
};

const showRoles = () => {
    db.query('SELECT * FROM emp_role', function (err, res) {
        if (err) throw err;
        console.table(res);
    })
    promptUser();
};

const showEmployees = () => {
    db.query('SELECT * FROM employee', function (err, res) {
        if (err) throw err;
        console.table(res);
    })
    promptUser();
};

const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: "department_name",
                type: "input",
                message: "Enter department name",
            }
        ])
        .then((input) => {
            if (input) {
                console.log(input);
                let sql = `INSERT INTO department (dept_name) VALUES ("${input.department_name}");`;

                db.query(sql, (err, res) => {
                    if (err) throw err;
                    promptUser();
                });
            }
        });

};

const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "What is the name of the role?"
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the employee's salary?"
        },
        {
            type: 'input',
            name: 'department',
            message: "What is the employee's department?"
        }
    ])
    showRoles();
};

const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
        },
        {
            type: 'input',
            name: 'lastName',
            message: "what is the employee's last name?",
        },
        {
            type: 'input',
            name: 'emp_role',
            message: "What is the employee's role?",
        },
        {
            type: 'input',
            name: 'manager',
            message: "Who is the employee's manager?"
        }
    ])
    .then(answers => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id)
                    VALUES (?,?,(SELECT id FROM emp_role WHERE title = ?))`;
        const inputs = [answers.firstName, answers.lastName, answers.role];

        db.promise().query(sql, inputs)
        .then( () => {
            console.log('New Employee Added')
            promptUser();
        })
    });
};

const updateEmployeeRole = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'updateRole',
            message: "Please select the employee you want to update role?",
            choices: emp_roles.title,
        }
    ])
};

promptUser();