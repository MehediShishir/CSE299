<!-- input.php -->
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
            <form action="">
                
                <button class="button is-success is-outlined ml-4" formaction="">Share Google Sheet</button>
                
            </form>
            </center>
        

            

        <div class="card mx-auto" style="width: 35%;">
        <div class="card border-0">
            <div class="card-header bg-primary text-center p-4">
                <h2 class="text-white m-0">Start the Automatic Assessment Process</h2>
            </div>
            <div class="card-body rounded-bottom bg-white p-5">
            <div class="card-body rounded-bottom bg-white p-5">
              <form action="">
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