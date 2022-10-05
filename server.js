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
                'View all roles',
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
            } else if (choices === 'View all roles') {
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
    const sql = `SELECT department.id,
                department.dept_name AS department
                FROM department`;

    db.query(sql, function (err, res) {
        if (err) throw err;
        console.log('******** DEPARTMENT ********')
        console.table(res);
        promptUser();
    });
};

const showRoles = () => {
    const sql = `SELECT emp_role.id,
    emp_role.title,
    emp_role.salary,
    department.dept_name AS department
    FROM emp_role
    LEFT JOIN department
    ON emp_role.department_id = department.id
    ORDER BY department`;

    db.query(sql, function (err, res) {
        if (err) throw err;
        console.log('******************* ROLES ***********************')
        console.table(res);
        promptUser();
    })
};

const showEmployees = () => {
    const sql = `SELECT e.id, 
                e.first_name AS firstName, 
                e.last_name AS lastName,
                emp_role.title,
                emp_role.salary,
                department.dept_name AS department,
                CONCAT(employee.first_name, ' ', employee.last_name) AS manager
                FROM employee AS e
                LEFT JOIN emp_role
                ON e.role_id = emp_role.id
                LEFT JOIN department
                ON emp_role.department_id = department.id
                LEFT JOIN employee
                ON e.manager_id = employee.id
                ORDER BY department`;

    db.query(sql, function (err, res) {
        if (err) throw err;
        console.log('************************************** EMPLOYEE ******************************************')
        console.table(res);
        promptUser();
    })
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

const addRole = async () => {
    try {
        const sql = `SELECT department.id,
        department.dept_name AS department
        FROM department`;

        let [departments] = await db.promise().query(sql);

        let formattedDepts = departments.map((dp) => {
            return { name: dp.department, value: dp.id }
        })

        let answers = await inquirer.prompt([
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
                type: 'list',
                name: 'department',
                message: "What is the employee's department?",
                choices: formattedDepts
            }
        ])
        const selectsql = `INSERT INTO emp_role (title, salary, department_id)
                    VALUES (?,?,?)`;
        const inputs = [answers.name, answers.salary, answers.department];

        await db.promise().query(selectsql, inputs)
        console.log('New Role Added')
        promptUser();
    } catch (error) {
        console.log(error);
    }
};


const addEmployee = async () => {
    try {
        const sql = `SELECT emp_role.id,
        emp_role.title,
        emp_role.salary,
        department.dept_name AS department
        FROM emp_role
        LEFT JOIN department
        ON emp_role.department_id = department.id
        ORDER BY department`;

        let [emp_role] = await db.promise().query(sql);

        let formattedRole = emp_role.map((er) => {
            return { name: er.title, value: er.id }
        })

        const empsql = `SELECT * FROM employee`;

        let [employees] = await db.promise().query(empsql);

        let formattedEmp = employees.map((e) => {
            return { name: e.first_name + ' ' + e.last_name, value: e.id }
        })
        let answers = await inquirer.prompt([
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
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: formattedRole
            },
            {
                type: 'list',
                name: 'manager',
                message: "Who is the employee's manager?",
                choices: formattedEmp
            }
        ])
        const usersql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES (?,?,?,?)`;
        const inputs = [answers.firstName, answers.lastName, answers.role, answers.manager];

        db.promise().query(usersql, inputs)
        console.log('New Employee Added')
        promptUser();

    } catch (error) {
        console.log(error);
    }
};

const updateEmployeeRole = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'updateID',
            message: "Please select the employee ID you want to update role?",
            choices: [1, 2, 3, 4, 5, 6]
        },
        {
            type: 'input',
            name: 'updateRole',
            message: "Please enter the new role ID for the employeee"
        }
    ])
        .then(answers => {
            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
            const inputs = [answers.updateRole, answers.updateID];

            db.promise().query(sql, inputs)
                .then(() => {
                    console.log('Employee Role Changed')
                    promptUser();

                })
        })
};

promptUser();