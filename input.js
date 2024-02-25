<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Automated Assessment System</title>
</head>
<body>
    <!-- Your HTML content here -->

    <script src="https://apis.google.com/js/api.js"></script>
    <script>
        // Load Google APIs
        gapi.load('client:auth2', initClient);

        function initClient() {
            // Initialize Google API client with your client ID
            gapi.client.init({
                apiKey: 'YOUR_API_KEY',
                clientId: 'YOUR_CLIENT_ID',
                discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
                scope: 'https://www.googleapis.com/auth/spreadsheets'
            }).then(function() {
                // Client is initialized, you can now use Google APIs
                fetchDataFromGoogleSheet();
            });
        }

        function fetchDataFromGoogleSheet() {
            var infoUrl = document.getElementById('info_url').value;
            var questUrl = document.getElementById('quest_url').value;

            // Fetch data from the provided URLs using Google Sheets API
            gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: getSheetIdFromUrl(infoUrl),
                range: 'Sheet1' // Adjust the range as needed
            }).then(function(response) {
                var infoData = response.result.values;
                // Process infoData
            });

            gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: getSheetIdFromUrl(questUrl),
                range: 'Sheet1' // Adjust the range as needed
            }).then(function(response) {
                var questData = response.result.values;
                // Process questData
                createGoogleForm(questData);
            });
        }

        function createGoogleForm(questData) {
            // Use questData to create a Google Form
            // Example:
            var form = FormApp.create('Assessment Form');
            // Add questions to the form based on questData
        }

        function extractEmails(infoData) {
            var emails = [];
            // Extract emails from the infoData
            // Example:
            for (var i = 1; i < infoData.length; i++) {
                emails.push(infoData[i][2]); // Assuming email is in the third column
            }
            return emails;
        }

        function sendEmailsWithFormLink(emails, formUrl) {
            var subject = 'Assessment Form for Students';
            var message = 'Dear Student,\n\nPlease complete the assessment form by clicking the link below:\n' + formUrl;
            // Send emails to each email address in the emails array
            // Example:
            emails.forEach(function(email) {
                // Send email using your email sending method (e.g., Gmail API)
            });
        }

        function getSheetIdFromUrl(url) {
            var regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
            var match = url.match(regex);
            if (match && match.length > 1) {
                return match[1];
            }
            return null;
        }
    </script>
</body>
</html>
