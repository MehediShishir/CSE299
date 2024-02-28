<?php
require_once('setup.php');

if (isset($_GET['code'])) {
    $token = $google->fetchAccessTokenWithAuthCode($_GET['code']);
    if (!isset($token["error"])) {
        $google->setAccessToken($token['access_token']);
        $service = new Google_Service_Oauth2($google);

        $data = $service->userinfo->get();
        $_SESSION['name'] = $data['name'];
        $_SESSION['pic'] = $data['picture'];
        $_SESSION['email'] = $data['email'];
    }
}

if (isset($_POST['submit'])) {
    $info_url = $_POST['info_url'];
    $quest_url = $_POST['quest_url'];
    $deadline = $_POST['deadline'];

    // Extract data from Google Sheets
    $info_data = extract_sheet_data($info_url);
    $quest_data = extract_sheet_data($quest_url);

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
    $form_id = create_google_form($quest_data, $question_column);

    // Send form to emails
    send_form_to_emails($info_data, $email_column, $form_id, $deadline);

    echo "Assessment process initiated. Forms will be sent to students.";
}

function extract_sheet_data($sheet_url)
{
    $client = getClient(); // Function to get Google API client
    $service = new Google_Service_Sheets($client);

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

function create_google_form($quest_data, $question_column)
{
    $client = getClient(); // Function to get Google API client
    $service = new Google_Service_Forms($client);

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

function send_form_to_emails($info_data, $email_column, $form_id, $deadline)
{
    $client = getClient(); // Function to get Google API client
    $service = new Google_Service_Forms($client);

    foreach ($info_data as $row) {
        $email = $row[$email_column];
        $formUrl = "https://docs.google.com/forms/d/e/$form_id/viewform";
        $subject = "Assessment Form for Submission";
        $message = "Please fill out the assessment form by the deadline: $deadline\n$formUrl";
        // Implement code to send email using PHP's mail function or a mail library
        // Example using PHP's mail function:
        // mail($email, $subject, $message);
    }
}

?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
    <title>AAS</title>

</head>
<body>
<nav class="navbar has-background-primary-dark" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="https://bulma.io">
      <img src="images/logo.jpg" >
      <h1 class="title is-size-4 has-text-white">  Automated Assessment System (AAS)</h1>
    </a>

    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div class="navbar-end">
      <div class="navbar-item">
          <div class="buttons">
            <a class="button is-light" href="logout.php">
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
<nav>
<div class="coloumns mr-6">
    <div class="coloum">
        <div class="class">
            <header class="card-header title"> </header>
            <div class="card-content">
            <?php
                            echo"<center><h1><font color= black>Welcome " . $_SESSION['name'] . "</font></h1></center>";
                            
                            ?>
            </div>
    </div>

</div>
</nav>
</body>
</html>
