<?php
    require_once('setup.php');
    if(isset($_GET['code'])){
        $token = $google->fetchAccessTokenWithAuthCode($_GET['code']);
        if(!isset($token["error"])){
            $google->setAccessToken($token['access_token']);
            $service = new Google_Service_Oauth2($google);

            $data=$service->userinfo->get();
            #print_r($data);
            $_SESSION['name'] = $data['name'];
            $_SESSION['pic'] = $data['picture'];
            $_SESSION['email'] = $data['email'];

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
                            echo"<h1><font color= black>Welcome " . $_SESSION['name'] . "</font></h1>";
                            ?>
            </div>
    </div>

</div>
</nav>
</body>
</html>
