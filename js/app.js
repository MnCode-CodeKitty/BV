// The publicCourseSheetUrl is the Courses tab of the sheet.  Copy from the address bar including gid!
var publicCourseSheetUrl = 'https://docs.google.com/spreadsheets/d/1ahvjoSrfz1ooVPsczocDg_s4xYy4l5lZx-3k-1lktBg/edit#gid=1553165956';

// The publicSpreadSheetUrl is the Students tab of the sheet.  Copy from the address bar including gid!
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1ahvjoSrfz1ooVPsczocDg_s4xYy4l5lZx-3k-1lktBg/edit#gid=1351766409';

document.getElementById("studentBox").innerHTML = "<center><h3>Your info will go here!</h3></center>";

// Hide the 2nd and 3rd Divs Until we are ready for them
col1.style.display = 'inline';
col2.style.display = 'none';
col3.style.display = 'none';
col4.style.display = 'none';

// Setup student box
var studentBoxTemplateSource = $("#studentBoxTemplate").html();

// *** SELECT COURSES ***
// Compile the Handlebars template for teachers

var session1Template = Handlebars.compile($('#session1Template').html());

function getSession1() {
  var session1Query = `
  select A, B, D, E, F, G, H, I 
  where G < F 
  and I contains ${window.myGrade}
  `;
  
  $('#courseRecord').sheetrock({
    url: publicCourseSheetUrl,
    query: session1Query,
    //fetchSize: 15,
    rowTemplate: session1Template
  });
  studentInfo('','');
}

var session2Template = Handlebars.compile($('#session2Template').html());

function getSession2() {
  var session2Query = `
  select A, B, D, E, F, G, H, I 
  where H < F 
  and I contains ${window.myGrade}
  and D != '${TheSession1Title}'
  `;
  
  $('#courseRecord2').sheetrock({
    url: publicCourseSheetUrl,
    query: session2Query,
    //fetchSize: 15,
    rowTemplate: session2Template
  });
  col2.style.display = 'none';
  col3.style.display = 'inline'; 
}

function confirmationPage () {
  
  document.getElementById("confirmInfo").innerHTML = `
    <font><strong><u>Your Kids College Registration:</u></strong></font>
    <p>
    Student: <strong>${selStudent}</strong><br />
    Grade:  <strong>${selGrade}</strong><br />
    Teacher: <strong>${selTeacher}</strong><br />
    Class 1: <strong>${TheSession1Title}</strong><br />
    Class 2: <strong>${TheSession2Title}</strong>
    </p>
    <button id="confirmRegister" onclick="confirmRegister()">Yes, this is what I want!</button>
    <input id="resetButton" type="reset" value="Start Over" onclick="formReset()">
      `;
  headerWrapper.style.display = 'none';
  col3.style.display = 'none'; 
  col4.style.display = 'inline';
  
  // URL OF AppScript WEBAPP 'NNCode-KidsCollege-Birchview-2017':
  // https://script.google.com/macros/s/AKfycbwuYHmyQmqmKgju-WtQrILbGVIXQLxsZ81JSgMXTBvOK_RDfO--/exec
}

function confirmRegister(){
  var regTimeStamp = Date.now;
//if choices aren't full - would that be calling the registerHelper/seatsleft function again?
        $.post("https://script.google.com/macros/s/AKfycbww5HQk-6rSsALlQ84MLn5Eb9RqOsDQf05yqHjLuGWjWdSPHyM/exec",
        {
          Timestamp: regTimeStamp,
          Student: selStudent,
          Grade: selGrade,
          Teacher: selTeacher,
          Session1: TheSession1Title,
          Session2: TheSession2Title
        });
        alert(`
              Thank you for registering for
              Birchview Kids College 2019!\n
              We hope you enjoy ${TheSession1Title} 
              and ${TheSession2Title}!\n
              See you on April 26!\n
              `);
  
   //else post error message about choice being full, please choose again
  //alert(`
  //        I'm sorry, your class is full and no
  //       longer accepting registrations.
  //        Please try your choices again!
  //            `);
  //      
        formReset();
  
   // });
}

// *** SELECT STUDENT ***

// Compile the Handlebars template for teachers
var StudentTemplate = Handlebars.compile($('#studentTemplate').html());

// Build the teacher query and pull it from the sheet
function getStudents(grade) {
  var studentQuery = 'select A, B, C where E = ' + window.myGrade + ' and D = ' + window.myTeacher;
  $('#students').sheetrock({
    url: publicSpreadsheetUrl,
    query: studentQuery,
    //fetchSize: 15,
    rowTemplate: StudentTemplate
  });
}

// *** SELECT TEACHER ***

// Compile the Handlebars template for teachers
var TeacherTemplate = Handlebars.compile($('#teacherTemplate').html());

// Build the teacher query and pull it from the sheet
function getTeachers(grade) {
  var teacherQuery = 'select D,sum(F) where E = ' + grade + ' group by D';
  $('#teachers').sheetrock({
    url: publicSpreadsheetUrl,
    query: teacherQuery,
    fetchSize: 15,
    rowTemplate: TeacherTemplate
  });
}

// *** SELECT GRADE ***
function selectGrade(selectObject) {
  selGrade = selectObject.value;
  myGrade = `"${selGrade}"`;
  getTeachers(myGrade);
  document.getElementById('teachers').focus();
}

// *** SELECT TEACHERS ***
function selectTeachers(selectObject) {
  selTeacher = selectObject.value;
  myTeacher = `"${selTeacher}"`;
  getStudents(myTeacher);
  document.getElementById('students').focus();
}

// *** SELECT STUDENTS ***
function selectStudents(selectObject) {
  selStudent = selectObject.value;
  myStudent = `"${selTeacher}"`;
  //$('#submitButton').focus();
  getSession1();
}

var TheSession1Title = '';

function chooseSession1(mySession1Title){
  TheSession1Title = mySession1Title;
  studentInfo(TheSession1Title,'');
  // CODE HERE TO UPDATE SPREADSHEET WITH SESSION 1 CHOICE
  getSession2();
}

var TheSession2Title = '';

function chooseSession2(mySession2Title){
  TheSession2Title = mySession2Title;
  studentInfo(TheSession1Title,TheSession2Title);
  // CODE HERE TO UPDATE SPREADSHEET WITH SESSION 2 CHOICE
    
  confirmationPage();
  
}

// *** SELECT STUDENTS ***
function studentInfo(session1Choice,session2Choice) {
  var selSession1 = session1Choice;
  var selSession2 = session2Choice;
  document.getElementById("studentBox").innerHTML = `
    <font><strong><u>Your Class Registration:</u></strong></font>
    <p>
    Student: <strong>${selStudent}</strong><br />
    Grade:  <strong>${selGrade}</strong><br />
    Teacher: <strong>${selTeacher}</strong><br />
    Class 1: <strong>${selSession1}</strong><br />
    Class 2: <strong>${selSession2}</strong>
    </p>
    `;
}

// *** FORM RESET BUTTON ***
function formReset() {
  location.reload();
}

function submitStudent() {
  col1.style.display = 'none';
  col2.style.display = 'inline'; 
}


Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

Handlebars.registerHelper("seatsleft", function(limit, registered) {
  var available = limit - registered;
  console.log(available);
  return available;
});
