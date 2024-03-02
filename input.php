<?php
require_once('setup.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\OAuth;

if (isset($_GET['code'])) {
    $token = $google->fetchAccessTokenWithAuthCode($_GET['code']);
    if (!isset($token["error"])) {
        $google->setAccessToken($token['access_token']);
        $service = new Google_Service_Oauth2($google);

        $data = $service->userinfo->get();
        $_SESSION['name'] = $data['name'];
        $_SESSION['pic'] = $data['picture'];
        $_SESSION['email'] = $data['email'];
        $_SESSION['token_uri'] = 'https://oauth2.googleapis.com/token'; // Save the token URI
    }
}

if (isset($_POST['submit'])) {
    try {
        $info_url = $_POST['info_url'];
        $quest_url = $_POST['quest_url'];
        $deadline = $_POST['deadline'];

        // Extract data from Google Sheets
        if (!isValidSheetUrl($info_url) || !isValidSheetUrl($quest_url)) {
            throw new Exception("Invalid Google Sheets URL");
        }

        try {
            $info_data = extract_sheet_data($info_url);
            $quest_data = extract_sheet_data($quest_url);
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            exit();
        }
        
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
    } catch (Google\Service\Exception $e) {
        // Handle the exception
        echo "Error fetching spreadsheet data: " . $e->getMessage();
        // You can log the error or perform other actions as needed
    }
}


function getSpreadsheetIdFromUrl($url) {
    // Extract the spreadsheet ID from the URL
    $parts = explode('/', $url);
    $spreadsheetId = end($parts);
    return $spreadsheetId;
}

// Function to validate Google Sheets URL
function isValidSheetUrl($url) {
    return preg_match('/^https:\/\/docs.google.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)\/edit/', $url);
}

function extract_sheet_data($sheet_url)
{
    $client = getClient(); // Function to get Google API client
    $service = new Google_Service_Sheets($client);

    $spreadsheetId = getSpreadsheetIdFromUrl($sheet_url);

    try {
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

        if (empty($values)) {
            throw new Exception("No data found in the spreadsheet");
        }

        return $values;
    } catch (Google\Service\Exception $e) {
        // Log the error for debugging purposes
        error_log('Error fetching spreadsheet data: ' . $e->getMessage());
        // Return a specific error message
        throw new Exception("Error fetching spreadsheet data: " . $e->getMessage());
    }
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
    $service = new Google_Service_Gmail($client); // Change to Gmail service

    foreach ($info_data as $row) {
        $email = $row[$email_column];
        $formUrl = "https://docs.google.com/forms/d/e/$form_id/viewform";
        $subject = "Assessment Form for Submission";
        $message = "Please fill out the assessment form by the deadline: $deadline\n$formUrl";

        // Use the token URI for OAuth 2.0 authentication
        if (isset($_SESSION['token_uri'])) {
            $tokenUri = $_SESSION['token_uri'];
        } else {
            echo "Error: Token URI not found in session.";
            exit();
        }

        // Send email using PHPMailer
        $mail = new PHPMailer(true);

        try {
            //Server settings
            $mail->SMTPDebug = SMTP::DEBUG_SERVER;
            $mail->SMTPDebug = SMTP::DEBUG_OFF;                      // Enable verbose debug output
            $mail->isSMTP();                                         // Send using SMTP
            $mail->Host       = 'smtp.gmail.com';                    // Default SMTP server to send through
            $mail->SMTPAuth   = true;                                // Enable SMTP authentication
            $mail->Username   = $_SESSION['email'];                  // SMTP username
            $mail->Password   = '';                                  // SMTP password - leave blank for OAuth
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;      // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
            $mail->Port       = 587;                                 // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above
            //Recipients
            $mail->setFrom($_SESSION['email'], $_SESSION['name']);
            $mail->addAddress($email);               // Name is optional

            // Content
            $mail->isHTML(true);                                  // Set email format to HTML
            $mail->Subject = $subject;
            $mail->Body    = $message;

            // OAuth 2.0 authentication with Gmail
            $mail->oauth(
                [
                    'user' => $_SESSION['email'],
                    'clientId' => '779111636513-5g4igneqv6q1gkdqqbqf6i87es598baq.apps.googleusercontent.com',
                    'clientSecret' => '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',
                    'tokenUri' => $tokenUri,
                ]
            );

            // Update PHPMailer SMTPDebug
            $mail->SMTPDebug = SMTP::DEBUG_SERVER;

            $mail->send();
            echo 'Message has been sent';
        } catch (Exception $e) {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }
    }
}

function getClient()
{
    $client = new Google_Client();
    $client->setApplicationName('Automated Assessment System (AAS)');
    $client->setScopes([
        Google_Service_Sheets::SPREADSHEETS_READONLY, // Use SPREADSHEETS_READONLY scope
        Google_Service_Oauth2::USERINFO_PROFILE,
        Google_Service_Gmail::GMAIL_SEND,
        Google_Service_Drive::DRIVE,
        // Add more scopes if needed
    ]);

    // Set the API key
    $client->setDeveloperKey('AIzaSyDsxg1tN3iBNwsPG4wTxNOAloouHUK0FEQ');

    // Other configurations as needed

    return $client;
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
      <h1 class="title is-size-4 has-text-white">    Automated Assessment System (AAS)</h1>
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


<nav>
<div class="coloumns mr-6">
    <div class="coloum">
        <div class="card mx-auto" style="width: 30%;">
        
            <header class="card-header text-center title "> 
            <center>
            <?php
                            echo"<h1><font color= grey>Welcome " . $_SESSION['name'] . "</font></h1>";
                            
                            ?>
                            </center>
            </header>
            </div>
            <center>
            <div class="card-content">
                <p >
                    You can share a Google Sheet containing student information (Name, ID, Email)<br>
                    and  Create another Google Sheet containing questions 
                    and corresponding marking rubrics in a specified format.<br>
              
                </p>
            </div>
            </center>
        

            

        <div class="card mx-auto" style="width: 35%;">
        <div class="card border-0">
            <div class="card-header bg-primary text-center p-4">
                <h2 class="text-white m-0">Start the Automatic Assessment Process</h2>
            </div>
            <div class="card-body rounded-bottom bg-white p-5">
            <div class="card-body rounded-bottom bg-white p-5">
              <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                <div class="mb-3 row">
                    <label for="info_url" class="form-label">URL of Information Sheet:</label>
                    <input type="url" name="info_url" id="info_url" class="form-control" placeholder="info.Gsheet.com" required="required" />
                </div>
                <div class="mb-3 row">
                    <label for="quest_url" class="form-label">URL of Question & Rubrics Sheet:</label>
                    <input type="url" name="quest_url" id="quest_url" class="form-control" placeholder="question.Gsheet.com" required="required" />
                </div>
                <div class="mb-3 row">
                    <label for="deadline" class="form-label">Submission Deadline:</label>
                    <input type="date" name="deadline" id="deadline" class="form-control" placeholder="Submission Deadline" required="required" />
                </div>
                <div>
                    <button class="btn btn-primary btn-lg btn-block" type="submit" id="submit" value="submit" name="submit">Assess the Students</button>
                </div>

              </form>
            </div>
            </div>
        
    </div>
</div>
</div>
</div>
    </div>

</div>
</nav>

</nav>
</body>
</html>