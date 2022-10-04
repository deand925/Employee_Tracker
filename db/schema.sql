CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(30)
);

CREATE TABLE emp_role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES emp_role(id),
    manager_id INT DEFAULT NULL,
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);