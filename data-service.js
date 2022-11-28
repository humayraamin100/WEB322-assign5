const Sequelize = require('sequelize');

var sequelize = new Sequelize("xlzlkmtc", "xlzlkmtc", "2VoLhvKVY0g5somsIe6KjYXdMEZATq5p", {
    host: "heffalump.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
    ssl: true
    },
    query:{raw: true}
});

var Employee = sequelize.define('Employee', {
    employeeNum: {
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    firstName:Sequelize.STRING,
    lastName:Sequelize.STRING,
    email:Sequelize.STRING,
    SSN:Sequelize.STRING,
    addressStreet:Sequelize.STRING,
    addressCity:Sequelize.STRING,
    addressState:Sequelize.STRING,
    addressPostal:Sequelize.STRING,
    maritalStatus:Sequelize.STRING,
    isManager:Sequelize.BOOLEAN,
    employeeManagerNum:Sequelize.INTEGER,
    status:Sequelize.STRING,
    department:Sequelize.INTEGER,
    hireDate:Sequelize.STRING
});

var Department = sequelize.define("Department", {
    departmentId:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

sequelize
    .authenticate().then(()=> 
        console.log("Connection success.")) 
    .catch((err)=>
        console.log("Unable to connect to DB.", err));

function initialize(){
    return new Promise((res,rej) => {
        sequelize.sync().then(
            res()
        ).catch(
            rej("no results returned")
        );
    });
}

function getAllEmployees(){
    return new Promise((res, rej) => {
        sequelize.sync().then(
            Employee.findAll({
                order: [
                    ['employeeNum', 'ASC']
                ]
            })
            .then((data) => {
                res(data);
            })
            .catch((err) => {
                rej("No results returned.")
            })
        )
    })
}

function getEmployeesByStatus(status){
    return new Promise((res, rej) => {
        Employee.findAll({
            where:{
                status: status
            }
        })
        .then((data) => {
            res(data);
        })
        .catch((err) => {
            rej("No results returned.")
        })
    })
}

function getEmployeesByDepartment(department){
    return new Promise((res, rej) => {
        Employee.findAll({
            where:{
                department: department
            }
        })
        .then((data) => {
            res(data);
        })
        .catch((err) => {
            rej("No results returned.")
        })
    })
}

function getEmployeesByManager(manager){
    return new Promise((res, rej) => {
        Employee.findAll({
            where:{
                employeeManagerNum: manager
            }
        })
        .then((data) => {
            res(data);
        })
        .catch((err) => {
            rej("No results returned.")
        })
    })
}

function getEmployeeByNum(num){
    return new Promise((res, rej) => {
        Employee.findAll({
            where:{
                employeeNum: num
            }
        })
        .then((data) => {
            res(data[0]);
        })
        .catch((err) => {
            rej("No results returned.")
        })
    })
}

function getManagers(){
    return new Promise((res, rej) => {
        Employee.findAll({
            where:{
                isManager: true
            }
        })
        .then((data) => {
            res(data);
        })
        .catch((err) => {
            rej("No results returned.")
        })
    })
}

function getDepartments(){
    return new Promise((res, rej) => {
        sequelize.sync().then(
            Department.findAll({
                order: [
                    ['departmentId', 'ASC']
                ]
            })
            .then((data) => {
                res(data);
            })
            .catch((err) => {
                rej("No results returned.")
            })
        )
    })
}

function addEmployee(employeeData){
    return new Promise(function (res, rej) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        
        for(const i in employeeData){
            if(employeeData[i] == ""){
                employeeData[i] = null
            }
        }

        Employee.create(employeeData).then(() => {
            res("Added a new employee")
        }).catch((err) => {
            rej("Unable to create employee")
        })
    });
}

function updateEmployee(employeeData){
    return new Promise(function (res, rej) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        
        for(const i in employeeData){
            if(employeeData[i] == ""){
                employeeData[i] = null
            }
        }

        Employee.update(employeeData, {where:{
            employeeNum: employeeData.employeeNum
        }}).then(() => {
            res("Employee has been updated")
        }).catch((err) => {
            rej("unable to update employee")
        })
    });
}

function addDepartment(departmentData){
    return new Promise(function(res, rej) {
        for(const i in departmentData){
            if(departmentData[i] == ""){
                departmentData[i] = null
            }
        }

        Department.create(departmentData)
        .then(() => {
            res("Added a new department")
        }).catch((err) => {
            rej("Unable to create department")
        })
    });
}

function updateDepartment(departmentData){
    return new Promise(function(res, rej) {
        for(const i in departmentData){
            if(departmentData[i] == ""){
                departmentData[i] = null
            }
        }

        Department.update(departmentData, {where: {
                departmentId: departmentData.departmentId
        }})
        .then(() =>{
            res("Deparment has been updated")
        }).catch((err) => {
            rej("Unable to update department")
        })
    });
}

function getDepartmentById(id){
    return new Promise((res, rej) => {
        Department.findAll({
            where:{
                departmentId: id
            }
        })
        .then((data) => {
            res(data[0]);
        })
        .catch(() => {
            rej("No results returned.")
        })
    })
}

function deleteEmployeebyNum(empNum){
    return new Promise((res, rej) => {
        sequelize.sync().then(
            Employee.destroy({
                where: {
                    employeeNum: empNum
                }
            })
            .then(() =>{
                res("Destroyed")
            })
            .catch((err) =>{
                rej("Failed to destroy")
            })
        )
    })
}
module.exports = {
    initialize, 
    getAllEmployees, 
    getManagers, 
    getDepartments, 
    addEmployee,
    getEmployeesByStatus,
    getEmployeesByDepartment,
    getEmployeesByManager,
    getEmployeeByNum,
    updateEmployee,
    addDepartment,
    updateDepartment,
    getDepartmentById,
    deleteEmployeebyNum,
}