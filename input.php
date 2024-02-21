<?php
    require_once('setup.php');
    if(isset($_GET['code'])){
        $token = $google->fetchAccessTokenWithAuthCode($_GET['code']);
        if(!isset($token["error"])){
            $google->setAccessToken($token['access_token']);
            $service = new Google_Service_Oauth2($google);

            $data=$service->userinfo->get();
            #print_r($data);

            echo "<br>Name: " .$data['name'];
            echo "<br> <img src='".$data['picture']."'>";

            $_SESSION['name'] = $data['name'];
            $_SESSION['pic'] = $data['picture'];
            $_SESSION['email'] = $data['email'];

        }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Input</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <div class="container">
        <h1 class="title">Automated Assessment System (AAS)</h1>
    </div>
    <div class="container">
        <h1 class="card" style ="width:400px; margin:80px auto;"></h1>
        <img class="card-img-top" src="<?php echo $_SESSION['picture']?>" style="width:100%">
    </div>
</body>
</html>
