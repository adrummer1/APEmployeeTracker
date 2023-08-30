INSERT INTO department(dep_name)
VALUES ("Engineering"), ("Sales"), ("Accounting"), ("LEGAL"), ("Marketing");

INSERT INTO role(title, salary, dep_id)
VALUES("Engineer", 75000, 1), ("Senior Engineer", 120000, 1), ("Finance Director", 200000, 3), ("Chief Councel", 250000, 4), ("HR Specialist", 70000, 5);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Sam', 'Smith', 1, 2), ('Becky', 'Espinoza', 2, null), ('Lisa', 'Powell', 3, 2), ('Henry', 'Jackson', 2, 2), ('Amy', 'Jones', 4, null), ('Pat', 'Adams', 5, 3);