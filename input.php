<!-- input.php -->
<?php
require_once('setup.php');

if(isset($_GET['code'])){
    $token = $google->fetchAccessTokenWithAuthCode($_GET['code']);
    if(!isset($token["error"])){
        $google->setAccessToken($token['access_token']);
        $service = new Google_Service_Oauth2($google);

        $data = $service->userinfo->get();
        #print_r($data);
        $_SESSION['name'] = $data['name'];
        $_SESSION['pic'] = $data['picture'];
        $_SESSION['email'] = $data['email'];

        // Set up Google API client
        $client = new Google_Client();
        $client->setApplicationName('Your Application Name');
        $client->setScopes([
            Google_Service_Sheets::SPREADSHEETS_READONLY,
            Google_Service_Sheets::SPREADSHEETS,
            Google_Service_Drive::DRIVE_READONLY,
            Google_Service_Drive::DRIVE_FILE,
            'https://www.googleapis.com/auth/forms', // Add the Forms scope manually
        ]);
        $client->setAuthConfig('/credentials_file.json');
        $client->setAccessType('offline');

        // Authenticate with Google APIs
        if ($client->isAccessTokenExpired()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
            file_put_contents('path_to_your_access_token.json', json_encode($client->getAccessToken()));
        }

        // Get access token
        $accessToken = json_decode(file_get_contents('path_to_your_access_token.json'), true);
        $client->setAccessToken($accessToken);

        // Initialize Google Forms service
        $formsService = new Google_Service_Forms($client);
        $formsService = new Google_Service_Forms($client);
        $driveService = new Google_Service_Drive($client);

        // Ask for user inputs
        $questionsSheetId = readline("Enter the ID of the Google Sheet containing questions: ");
        $emailsSheetId = readline("Enter the ID of the Google Sheet containing email accounts: ");
        $deadline = readline("Enter the deadline for the form (YYYY-MM-DD): ");

        // Define the range for questions and emails
        $questionsRange = 'Sheet1!A1:D'; // Adjust the range as per your sheet structure
        $emailsRange = 'Sheet1!A1:B'; // Adjust the range as per your sheet structure

        // Get the values from the Google Sheet containing questions
        $questionsResponse = $sheetsService->spreadsheets_values->get($questionsSheetId, $questionsRange);
        $questionsValues = $questionsResponse->getValues();

        // Create a new Google Form
        $form = new Google_Service_Forms_Form();
        $form->setTitle('Your Form Title');

        // Add questions to the form
        foreach ($questionsValues as $row) {
            $question = new Google_Service_Forms_TextItem();
            $question->setTitle($row[0]); // Assuming the question is in the first column
            $form->add($question);
        }

        // Save the form
        $form = $formsService->forms->create($form);

        echo '<center><h1>Form created successfully!</h1>';
        echo '<p>Form ID: ' . $form->getId() . '</p></center>';

        // Get email addresses from the Google Sheet
        $emailsResponse = $sheetsService->spreadsheets_values->get($emailsSheetId, $emailsRange);
        $emailsValues = $emailsResponse->getValues();

        // Send the form to email addresses
        foreach ($emailsValues as $email) {
            // Send the form link to the email
            $formLink = "https://docs.google.com/forms/d/{$form->getId()}/viewform";
            $subject = "Form for Assessment";
            $message = "Dear user,\n\nHere is the link to the assessment form: $formLink\n\nDeadline: $deadline";
            mail($email[1], $subject, $message);
        }

        // Wait for the deadline
        echo "Form sent to emails. Waiting for the deadline...\n";
        sleep(10); // You might want to adjust the time based on your needs

        // Get answers from the form
        $answers = []; // Assume you are storing answers in an array
        // ... Fetch the answers using Google Forms API or other methods

        // Record answers to a new Google Sheet
        $answersSheetId = 'your_google_answers_sheet_id';
        $answersRange = 'Sheet1!A1:D'; // Adjust the range as per your sheet structure

        // Write answers to the Google Sheet
        $values = [];
        foreach ($answers as $answer) {
            $values[] = [$answer];
        }
        $body = new Google_Service_Sheets_ValueRange([
            'values' => $values
        ]);
        $params = [
            'valueInputOption' => 'RAW'
        ];
        $result = $sheetsService->spreadsheets_values->append($answersSheetId, $answersRange, $body, $params);
        printf("%d cells appended.", $result->getUpdates()->getUpdatedCells());
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
