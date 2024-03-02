<?php
require_once('vendor/autoload.php'); // Include the Google API client library

use Google\Client;
use Google\Service\Sheets;
use Google\Service\Forms;
use Google\Service\Oauth2;

// Function to extract data from Google Sheets
function extract_sheet_data($client, $sheet_url)
{
    $service = new Sheets($client); // Initialize Google Sheets service

    $spreadsheetId = getSpreadsheetIdFromUrl($sheet_url);

    // Get the dimensions of the spreadsheet
    $response = $service->spreadsheets->get($spreadsheetId);
    $sheets = $response->getSheets();
    $sheetProperties = $sheets[0]->getProperties();
    $gridProperties = $sheetProperties->getGridProperties();
    $rowCount = $gridProperties->getRowCount();
    $columnCount = $gridProperties->getColumnCount();

    $range = "A1:{$rowCount}{$columnCount}";

    $response = $service->spreadsheets_values->get($spreadsheetId, $range);
    $values = $response->getValues();

    return $values;
}

// Function to create a Google Form
function create_google_form($client, $quest_data, $question_column)
{
    $service = new Forms($client); // Initialize Google Forms service

    $form = new Google_Service_Forms_Form();
    $form->setTitle('Automatically Generated Form');

    // Add questions from the specified column
    foreach ($quest_data as $row) {
        $question = new Google_Service_Forms_TextItem();
        $question->setTitle($row[$question_column]);
        $form->add($question);
    }

    // Create the form
    $createdForm = $service->forms->create($form);

    return $createdForm->getId();
}

// Function to send form to emails
function send_form_to_emails($client, $info_data, $email_column, $form_id, $deadline)
{
    $service = new Forms($client); // Initialize Google Forms service

    foreach ($info_data as $row) {
        $email = $row[$email_column];
        $formUrl = "https://docs.google.com/forms/d/e/$form_id/viewform";
        $subject = "Assessment Form for Submission";
        $message = "Please fill out the assessment form by the deadline: $deadline\n$formUrl";

        // Send email to the student's email address
        // You can use PHP's mail() function or any other email sending library here
    }
}

// Main code starts here
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $client = new Google_Client();
    $client->setApplicationName('Automated Assessment System (AAS)');
    $client->setScopes([
        Google_Service_Sheets::SPREADSHEETS,
        Google_Service_Oauth2::USERINFO_PROFILE,
        Google_Service_Forms::FORMS,
        Google_Service_Drive::DRIVE, // Include Google Drive scope
        // Add more scopes if needed
    ]);
    $client->setDeveloperKey('AIzaSyDsxg1tN3iBNwsPG4wTxNOAloouHUK0FEQ'); // Replace with your API key

    // Get form data from the request
    $quest_url = $_POST['quest_url'];
    $info_url = $_POST['info_url'];
    $deadline = $_POST['deadline'];

    // Extract data from Google Sheets
    $quest_data = extract_sheet_data($client, $quest_url);
    $info_data = extract_sheet_data($client, $info_url);

    // Determine question and email columns
    $question_column = null;
    $email_column = null;
    foreach ($quest_data[0] as $key => $value) {
        if (stripos($value, 'question') !== false) {
            $question_column = $key;
        } elseif (stripos($value, 'email') !== false) {
            $email_column = $key;
        }
    }

    if ($question_column === null || $email_column === null) {
        echo "Error: Unable to find question or email column.";
        exit();
    }

    // Create Google Form
    $form_id = create_google_form($client, $quest_data, $question_column);

    // Send form to emails
    send_form_to_emails($client, $info_data, $email_column, $form_id, $deadline);

    echo "Assessment process initiated. Forms will be sent to students.";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Automated Assessment System (AAS)</title>
</head>
<body>
    <h1>Automated Assessment System (AAS)</h1>
    <form method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>">
        <label for="quest_url">Question Spreadsheet URL:</label><br>
        <input type="text" id="quest_url" name="quest_url"><br>
        <label for="info_url">Email Spreadsheet URL:</label><br>
        <input type="text" id="info_url" name="info_url"><br>
        <label for="deadline">Deadline:</label><br>
        <input type="date" id="deadline" name="deadline"><br><br>
        <input type="submit" value="Submit">
    </form>
</body>
</html>
