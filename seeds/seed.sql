USE company_db;

INSERT INTO department(name)
VALUES ('UI/UX'), ('Database'), ('Web Dev'), ('Mobile Dev');

INSERT INTO role(title, salary, department_id)
VALUES ('Developer', 70000, 1), ('Senior Engineer', 120000, 2), ('Junior Developer', 50000, 3), ('Android Developer', 110000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Jack', 'Johnson', 1, 2), ('John', 'Jackson', 2, 4), ('Jen', 'Jacobs', 3, 2), ('Jim', 'Jameson', 4, 4);