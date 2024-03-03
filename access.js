// function doPost(e) {
//   try {
//     // Parse incoming JSON data
//     var requestData = JSON.parse(e.postData.contents);

//     // Extract necessary data from the request
//     var infoUrl = requestData.infoUrl;
//     var questUrl = requestData.questUrl;
//     var deadline = requestData.deadline;

//     // Access Google Sheets
//     var ssQuestions = SpreadsheetApp.openByUrl(questUrl);
//     var ssStudents = SpreadsheetApp.openByUrl(infoUrl);
    
//     var questionsSheet = ssQuestions.getSheetByName("Sheet1"); // Adjust sheet name accordingly
//     var studentsSheet = ssStudents.getSheetByName("Sheet1"); // Adjust sheet name accordingly
    
//     // Create a new Google Form
//     var form = FormApp.create('Project Form');
    
//     // Retrieve questions from the sheet starting from cell A2 and add them to the form as short answer questions
//     var lastRow = questionsSheet.getLastRow();
//     var questions = questionsSheet.getRange("A2:A" + lastRow).getValues();
//     questions.forEach(function(question) {
//       if (question[0]) { // Check if the cell is not empty
//         form.addTextItem()
//           .setTitle(question[0]); // Assuming questions are in the first column
//       }
//     });
    
//     // Get the form URL
//     var formUrl = form.getPublishedUrl();
    
//     // Send the form link to students via email
//     var emailColumn = studentsSheet.getRange('C2:C' + studentsSheet.getLastRow()).getValues(); // Assuming emails are in column C
//     emailColumn.forEach(function(emailAddress) {
//       var email = emailAddress[0];
//       var message = 'Dear student,\n\nHere is the link to the form: ' + formUrl;
//       // Add deadline to the message
//       message += '\n\nSubmission Deadline: ' + deadline;
//       MailApp.sendEmail(email, 'Project Form Link', message);
//     });

//     // Return a response
//     return ContentService.createTextOutput('Form creation and email sending successful');
//   } catch (error) {
//     console.error('Error in sending emails:', error);
//     return ContentService.createTextOutput('An error occurred in sending emails: ' + error.message);
//   }
// }


function doPost(e) {
  try {
    // Parse incoming JSON data
    var requestData = JSON.parse(e.postData.contents);

    // Extract necessary data from the request
    var infoUrl = requestData.infoUrl;
    var questUrl = requestData.questUrl;
    var deadline = requestData.deadline;

    // Access Google Sheets
    var ssQuestions = SpreadsheetApp.openByUrl(questUrl);
    var ssStudents = SpreadsheetApp.openByUrl(infoUrl);

    var questionsSheet = ssQuestions.getSheetByName("Sheet1");
    var studentsSheet = ssStudents.getSheetByName("Sheet1");

    // Create a new Google Form
    var form = FormApp.create('Project Form');

    // Retrieve questions from the sheet starting from cell A2 and add them to the form as short answer questions
    var lastRow = questionsSheet.getLastRow();
    var questions = questionsSheet.getRange("A2:A" + lastRow).getValues();
    questions.forEach(function(question) {
      if (question[0]) {
        form.addTextItem()
          .setTitle(question[0]);
      }
    });

    // Get the form URL
    var formUrl = form.getPublishedUrl();

    // Send the form link to students via email
    var emailColumn = studentsSheet.getRange('C2:C' + studentsSheet.getLastRow()).getValues();
    emailColumn.forEach(function(emailAddress) {
      var email = emailAddress[0];
      var message = 'Dear student,\n\nHere is the link to the form: ' + formUrl;
      message += '\n\nSubmission Deadline: ' + deadline;
      MailApp.sendEmail(email, 'Project Form Link', message);
    });

    // Return a response
    return ContentService.createTextOutput('Form creation and email sending successful');
  } catch (error) {
    console.error('Error in sending emails:', error);
    return ContentService.createTextOutput('An error occurred in sending emails: ' + error.message);
  }
}

function doGet(e) {
  try {
    // Extract query parameters from the request
    var qUrl = e.parameter.qUrl;
    var sUrl = e.parameter.sUrl;
    var deadline = e.parameter.deadline;

    // Call doPost function with extracted parameters
    var result = doPost({
      postData: {
        contents: JSON.stringify({
          infoUrl: sUrl,
          questUrl: qUrl,
          deadline: deadline
        })
      }
    });

    return ContentService.createTextOutput(result);
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService.createTextOutput('An error occurred in doGet: ' + error.message);
  }
}
