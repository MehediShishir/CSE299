function createAndSendFormWithDeadline(qUrl, sUrl, deadline) {
  // Access Google Sheets
  var questionsSheet = SpreadsheetApp.openByUrl(qUrl).getSheetByName("Sheet1");
  var studentsSheet = SpreadsheetApp.openByUrl(sUrl).getSheetByName("Sheet1");

  // Create a new Google Form
  var form = FormApp.create('Assessment Form');

  // Retrieve questions from the sheet starting from cell A2 and add them to the form as short answer questions
  var lastRowQuestions = questionsSheet.getLastRow();
  var questions = questionsSheet.getRange("A2:A" + lastRowQuestions).getValues();
  questions.forEach(function(question) {
    if (question[0]) { // Check if the cell is not empty
      form.addTextItem()
        .setTitle(question[0]); // Assuming questions are in the first column
    }
  });

  // Get the form URL
  var formUrl = form.getPublishedUrl();

  // Send the form link to students via email along with the deadline
  var lastRowStudents = studentsSheet.getLastRow();
  var emailColumn = studentsSheet.getRange('C2:C' + lastRowStudents).getValues(); // Assuming emails are in column C
  for (var i = 0; i < lastRowStudents; i++) {
    var emailAddress = emailColumn[i][0];
    var message = 'Dear student,\n\nHere is the link to the assessment form: ' + formUrl + 
                  '\n\nDeadline for submission: ' + deadline;
    MailApp.sendEmail(emailAddress, 'Assessment Form Link and Deadline', message);
  }

  // Schedule form closure after the deadline
  var triggerDate = new Date(deadline);
  ScriptApp.newTrigger('closeForm')
      .timeBased()
      .at(triggerDate)
      .create();
}

// Function to close the form
function closeForm() {
  var form = FormApp.getActiveForm();
  form.setAcceptingResponses(false); // Close the form for responses
}

// Function to handle form submission event
function onFormSubmit(e) {
  var formResponses = e.values; // Retrieve all form responses
  
  // Create a new spreadsheet to store responses
  var newSS = SpreadsheetApp.create('Responses Spreadsheet'); // Replace 'Responses' with your desired spreadsheet name
  var sheet = newSS.getActiveSheet();
  
  // Set up the headers
  sheet.getRange('A1').setValue('Name');
  sheet.getRange('B1').setValue('Email');

  // Add headers for each response item
  for (var i = 0; i < formResponses.length; i++) {
    sheet.getRange(1, i + 3).setValue('Response ' + (i + 1)); // Start from column C
  }
  
  // Add header for Obtained Marks
  sheet.getRange(1, formResponses.length + 3).setValue('Obtained Marks');

  // Append the form submission data and generated marks
  var userName = e.namedValues['Name'][0]; // Assuming 'Name' is the header of the name column
  var userEmail = e.namedValues['Email'][0]; // Assuming 'Email' is the header of the email column
  var rowData = [userName, userEmail].concat(formResponses);
  
  // Generate random marks between 1 and 10 and append them to the row
  var totalResponses = formResponses.length;
  for (var j = 0; j < totalResponses; j++) {
    var randomMarks = Math.floor(Math.random() * 10) + 1; // Generate random marks between 1 and 10
    rowData.push(randomMarks);
  }
  
  sheet.appendRow(rowData);

  // Store the spreadsheet URL in the global variable
  var responseSpreadsheetUrl = newSS.getUrl();

  // Send email to the script owner with the spreadsheet URL
  var scriptOwnerEmail = Session.getActiveUser().getEmail();
  var subject = 'New Response Spreadsheet Created';
  var message = 'Hello,\n\nA new response spreadsheet has been created: ' + responseSpreadsheetUrl;
  MailApp.sendEmail(scriptOwnerEmail, subject, message);
}
