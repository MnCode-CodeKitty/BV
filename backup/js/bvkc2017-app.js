var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1Owv5v8WZoHpOCi1dxEJBxPO71FZQbqKhe-QyL2FfF7E/edit#gid=0';
var publicCourseSheetUrl = 'https://docs.google.com/spreadsheets/d/1Owv5v8WZoHpOCi1dxEJBxPO71FZQbqKhe-QyL2FfF7E/edit#gid=1555010656';


// Reset the form on load/reload just to be safe
//$('#regForm').reset();

// Hide the 2nd and 3rd Divs Until we are ready for them
col1.style.display = 'inline';
col2.style.display = 'none';

// Setup student box
var studentBoxTemplateSource = $("#studentBoxTemplate").html();

// *** SELECT COURSES ***
// Compile the Handlebars template for teachers

var CourseTemplate = Handlebars.compile($('#courseTemplate').html());

function getCourses() {
  var courseQuery = 'select A, B, D, E, F, G, H, I where G < F';
  $('#courseRecord').sheetrock({
    url: publicCourseSheetUrl,
    query: courseQuery,
    //fetchSize: 15,
    rowTemplate: CourseTemplate
  });
  //var studentBoxCompile = Handlebars.compile(studentBoxTemplateSource);
  studentInfo();
}

// *** SELECT STUDENT ***
// Compile the Handlebars template for teachers
var StudentTemplate = Handlebars.compile($('#studentTemplate').html());

// Build the teacher query and pull it from the sheet
function getStudents(grade) {
  var studentQuery = 'select A, B where E = ' + window.myGrade + ' and D = ' + window.myTeacher;
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
  getCourses();
}

// *** SELECT STUDENTS ***
function studentInfo() {
  var selSession1 = 'Course 1 Name';
  var selSession2 = 'Course 2 Name';
  document.getElementById("studentBox").innerHTML = `
    <font><strong><u>Your Class Registration:</u></strong></font>
    <p>
    Student: <strong>${selStudent}</strong><br />
    Grade:  <strong>${selGrade}</strong><br />
    Teacher: <strong>${selTeacher}</strong><br />
    Class 1: <strong>${selSession1}</strong><br />
    Class 1: <strong>${selSession2}</strong>
    </p>
    `;
}

// *** FORM RESET BUTTON ***
function formReset() {
  location.reload();
}

function submitStudent() {
/*    var coursesContainer = $( '<div/>' );
    coursesContainer.html('test');
   coursesContainer.appendTo( $( 'body' ) ); */ 
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