//import .Env
require('dotenv').config();

const { name } = require('ejs');
const { request, response } = require('express');
//import Express
let express = require('express');

//create app server
let app = express();

//let app set view engine and ejs
app.set('view engine', 'ejs');

//Middleware
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }));

//Global student array
studentArray = [];

//Route to index page
app.get('/', (request, response) => {
    response.render('index.ejs')
});

//Route to View All page
app.get('/view', (request, response) => {
    response.render('view.ejs')
});

//Route to Update page
app.get('/update', (request, response) => {
    response.render('update.ejs')
});

//Route to Delete
app.get('/delete', (request, response) => {
    response.render('delete.ejs')
});

//Route to process-student page
app.post('/process-students', (request, response) => {
    //Get variables from the body 
    let name = request.body.txtName;
    let surname = request.body.txtSurname;
    let id = request.body.txtIDno;

    //Get DOB from ID
    let DOB = id.substring(0, 6);
    let year = DOB.substring(0,2);
    let month = DOB.substring(2, 5);
    let day = DOB.substring(5);

    //Currrent Year
    const date = new Date();
    let thisYear = date.getFullYear();

    //Calculate Age
    let age = thisYear - ((+year) + 1900);

    //Gender Check
    let genderCheck = id.substring(6, 10);
    let gender = '';

    if ((+genderCheck) >= 0000 && (+genderCheck) <= 4999) {
        gender = 'Female';
    }
    if ((+genderCheck) >= 5000 && (+genderCheck) <= 9999) {
        gender = 'Male';
    }

    //Citiezenship
    let citizen = id.substring(10, 11);
    let citizenship = '';

    if ((+citizen) == 0) {
        citizenship = 'SA citizen';
    }
    else {
        citizenship = 'Permanent resident';
    }

    //Checksum to Verify ID number
    let checkSum = id.substring(12);
    let valid = '';
    if (id.length == 13) {
        valid = 'Valid ';
    }
    if (id.length != 13) {
        valid = 'Not Valid';
    }

    //Store variables into an object
    let data = {
        name,
        surname,
        id,
        DOB,
        age,
        gender,
        citizenship,
        valid
    }

    //Store Object into an Array
    studentArray.push(data);

    //Display Information 
    response.send(`${name} ${surname} Added.`);
});

//Route to view page
app.post('/view-students', (request, response) => {
    response.send(studentArray);
    /*for (let index = 0; index < studentArray.length; index++) {
        //const element = array[index];
        response.send(`Name: ${studentArray[index].name}\nSurname: ${studentArray[index].surname}\nID No.: ${studentArray[index].id}\nAge: ${studentArray[index].age}\nGender: ${studentArray[index].gender}\nCitizen: ${studentArray[index].citizenship}\nValid: ${studentArray[index].valid}`);
        console.log(`Name: ${studentArray[index].name}\nSurname: ${studentArray[index].surname}\nID No.: ${studentArray[index].id}\nAge: ${studentArray[index].age}\nGender: ${studentArray[index].gender}\nCitizen: ${studentArray[index].citizenship}\nValid: ${studentArray[index].valid}`);
    }*/
});

//Route to Update pade
app.post('/update-students', (request, response) => {
    let id = request.body.txtIDno;
    //Find index of specific object using findIndex method.    
    objIndex = studentArray.findIndex((obj => obj.id == id));

    let name = request.body.txtName;
    let surname = request.body.txtSurname;

    //Update object's name property.
    studentArray[objIndex].name = name;
    studentArray[objIndex].surname = surname;
    studentArray[objIndex].id = id;

    //Display
    response.send(`Student with ID: ${id} Updated`);
});

//Route to Delete page
app.post('/delete-students', (request, response) => {
    let id = request.body.txtIDno;
    //Find index of specific object using filter method.    
    //studentArray.remove((obj => obj.id == id));

    for(var i=0; i < studentArray.length; i++) {
        if(studentArray[i].id == id)
        {
           studentArray.splice(i,1);
        }
     }
    //Display
    response.send(`Student with ID: ${id} Deleted`);
});

//import .Env variables
let PORT = process.env.PORT || 4081;
let HOST = process.env.HOST;

//method to listen to app
app.listen(PORT, HOST, (request, response) => {
    console.log(`This App is Listening on ${HOST}:${PORT}`);
});