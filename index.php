<?php
    require_once('setup.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Automated Assessment System (AAS)</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <div class="container">
        <h1 class="title">Automated Assessment System (AAS)</h1>
            <button type="submit" class="login-button">
                <a href="<?php echo $google->createAuthUrl()?>">Login with Google</a>
        </button>
    </div>
</body>
</html>
