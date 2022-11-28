/*************************************************************************
* WEB322– Assignment 5
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Humayra Amin Student ID: 123088213 Date:27 November 2022 
*
* Your app’s URL (from Heroku) : 
*
*************************************************************************/ 
var express = require("express");
var multer = require("multer");
var exphbs = require("express-handlebars");
var fs = require("fs");
var path = require("path");
var data_service = require("./data-service.js")

var app = express();
var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.engine(".hbs", exphbs.engine({
    extname:".hbs" ,
    defaultLayout: "main",
    helpers:{
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') + '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
}}));

app.set("view engine", ".hbs");
var storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    } 
});
var upload = multer({storage: storage});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.post("/employees/add", function(req, res){
    data_service.addEmployee(req.body).then(() => {
        res.redirect("/employees")
    }).catch((err)=>{
        res.status(500).render("employees", {message: "Unable to Add Employee"});
    });
});

app.post("/employee/update", function(req, res){ 
    data_service.updateEmployee(req.body).then(() => {
        res.redirect("/employees")
    }).catch((err)=>{
        res.status(500).render("employees", {message: "Unable to Update Employee"});
    });
});

app.get("/employees/add", function(req, res){
    data_service.getDepartments().then((data) => {
        res.render("addEmployee", {departments: data})
    }).catch((err) => {
        res.render("addEmployee", {departments: []})
    })
});

app.get("/employees", function(req, res){
    if(req.query.status){
        data_service.getEmployeesByStatus(req.query.status).then((data) => {
            if(data.length > 0){
                res.render("employees", {employees: data});
            }
            else{
                res.render("employees", {message: "no results"});
            }
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
    else if(req.query.department){
        data_service.getEmployeesByDepartment(req.query.department).then((data) => {
            if(data.length > 0){
                res.render("employees", {employees: data});

            }
            else{
                res.render("employees", {message: "no results"});
            }
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
    else if(req.query.manager){
        data_service.getEmployeesByManager(req.query.manager).then((data) => {
            if(data.length > 0){
                res.render("employees", {employees: data});

            }
            else{
                res.render("employees", {message: "no results"});
            }
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
    else{
        data_service.getAllEmployees().then((data) => {
            if(data.length > 0){
                res.render("employees", {employees: data});

            }
            else{
                res.render("employees", {message: "no results"});
            }
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
});

app.get("/employee/:value", function(req, res){
    let viewData = {};

    data_service.getEmployeeByNum(req.params.value).then((data) => {
        if (data) {
            viewData.employee = data; 
        } else {
            viewData.employee = null; 
        }
    }).catch(() => {
        viewData.employee = null; 
    }).then(data_service.getDepartments)
    .then((data) => {
        viewData.departments = data; 

        for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.employee.department) {
                viewData.departments[i].selected = true;
            }
        }
    }).catch(() => {
        viewData.departments = []; 
    }).then(() => {
        if (viewData.employee == null) { 
            res.status(404).send("Employee Not Found");
        } 
        else {
            res.render("employee", { viewData: viewData }); 
        }
    });
});

app.get("/employees/delete/:value", function(req, res){
    data_service.deleteEmployeebyNum(req.params.value).then((data) => {
        res.redirect("/employees");
    })
});

app.get("/departments", function(req, res){
    data_service.getDepartments().then((data) => {
        if(data.length > 0){
            res.render("departments", {departments: data});

        }
        else{
            res.render("departments", {message: "no results"});
        }
    }).catch((err) => {
        res.json({message: err})
    })
});

app.get("/departments/add", function(req, res){
    res.render(path.join(__dirname + "/views/addDepartment.hbs"));
});

app.post("/departments/add", function(req, res){
    data_service.addDepartment(req.body).then(() => {
        res.redirect("/departments")
    }).catch((err)=>{
        res.status(500).render("departments", {message: "Unable to Add Department"});
    });
});

app.post("/departments/update", function(req, res){ 
    data_service.updateDepartment(req.body).then(() => {
        res.redirect("/departments")
    }).catch((err)=>{
        res.status(500).render("departments", {message: "Unable to Update Department"});
    });
});

app.get("/department/:value", function(req, res){
    data_service.getDepartmentById(req.params.value).then((data) => {
        res.render("department", { departments: data });
    }).catch((err) => {
        res.status(404).send("Department Not Found");
    })
});


app.post("/images/add", upload.single("imageFile"), function(req, res){
    res.redirect("/images");
});

app.get("/images/add", function(req, res){
    res.render(path.join(__dirname, "/views/addImage.hbs"));
});

app.get("/images", (req,res) => {
    fs.readdir("./public/images/uploaded", function(err,items) {
        res.render("images", { image: items });
    })
});

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.get("/", function(req, res){
    res.render(path.join(__dirname, "/views/home.hbs"));
});

app.get("/about", function(req, res){
    res.render(path.join(__dirname, "/views/about.hbs"));
});



app.use((req, res) => {
  res.status(404).send("Page not available!");
});




data_service.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart)
}).catch(() => {
    console.log("Unable to initialize")
});