<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>AAS</title>
</head>
<body>
<nav class="navbar has-background-primary-dark" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="https://bulma.io">
      <img src="images/logo.jpg" >
      <h1 class="title is-size-4 has-text-white">Automated Assessment System (AAS)</h1>
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
        <a class="button is-light" href="logout.php">Logout</a>
      </div>
    </div>
  </div>
</nav>
<div class="columns mr-6">
    <div class="column">
        <div class="card mx-auto" style="width: 30%;">
            <header class="card-header text-center title"> 
            <center>
            <h1><font color="grey">Welcome <span id="username"></span></font></h1>
            </center>
            </header>
            <center>
            <div class="card-content">
                <p>You can share a Google Sheet containing student information (Name, ID, Email) and create another Google Sheet containing questions and corresponding marking rubrics in a specified format.</p>
            </div>
            </center>
        </div>
        <div class="card mx-auto" style="width: 35%;">
        <div class="card border-0">
            <div class="card-header bg-primary text-center p-4">
                <h2 class="text-white m-0">Start the Automatic Assessment Process</h2>
            </div>
            <div class="card-body rounded-bottom bg-white p-5">
              <form id="assessmentForm">
                <div class="mb-3 row">
                    <label for="info_url" class="form-label">URL of Information Sheet:</label>
                    <input type="url" name="info_url" id="info_url" class="form-control" placeholder="info.Gsheet.com" required />
                </div>
                <div class="mb-3 row">
                    <label for="quest_url" class="form-label">URL of Question & Rubrics Sheet:</label>
                    <input type="url" name="quest_url" id="quest_url" class="form-control" placeholder="question.Gsheet.com" required />
                </div>
                <div class="mb-3 row">
                    <label for="deadline" class="form-label">Submission Deadline:</label>
                    <input type="date" name="deadline" id="deadline" class="form-control" required />
                </div>
                <div>
                    <button class="btn btn-primary btn-lg btn-block" type="submit" id="submitBtn">Assess the Students</button>
                </div>
              </form>
            </div>
        </div>
        </div>
    </div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://apis.google.com/js/api.js"></script>
<script>
$(document).ready(function() {
    $('#assessmentForm').submit(function(event) {
        event.preventDefault();
        var info_url = $('#info_url').val();
        var quest_url = $('#quest_url').val();
        var deadline = $('#deadline').val();
        var requestData = {
            info_url: info_url,
            quest_url: quest_url,
            deadline: deadline
        };
        $.ajax({
            type: 'POST',
            url: 'process_data.php', // Specify the URL for processing data
            data: requestData,
            success: function(response) {
                console.log(response); // Log the response
                alert(response); // Show an alert with the response
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText); // Log the error message
                alert("Error: " + xhr.responseText); // Show an alert with the error message
            }
        });
    });

    // Function to initialize Google API client
    function initClient() {
        gapi.client.init({
            'apiKey': 'AIzaSyDsxg1tN3iBNwsPG4wTxNOAloouHUK0FEQ', // Replace with your API key
            'clientId': '779111636513-5g4igneqv6q1gkdqqbqf6i87es598baq.apps.googleusercontent.com', // Replace with your OAuth 2.0 client ID
            'scope': 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/forms https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile',
            'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest', 'https://www.googleapis.com/discovery/v1/apis/forms/v1/rest', 'https://www.googleapis.com/discovery/v1/apis/sheets/v4/rest']
        }).then(function() {
            console.log('Google API client initialized');
        });
    }

    // Load Google API client
    gapi.load('client', initClient);
});
</script>
</body>
</html>
