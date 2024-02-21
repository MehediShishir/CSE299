<?php
    require_once('setup.php');
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
          <a class="button is-primary mr-6" href="<?php echo $google->createAuthUrl()?>">

            <img src="images/google.png" >
            <strong>Log in with google</strong>
          </a>
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
                <p >
                 This ambitious project aims to create a cutting-edge web-based system that leverages the power of Large Language Models (LLMs) and innovative prompt engineering.
                 Its primary goal is to revolutionize the student assessment process by automatically evaluating student answers against predefined rubrics,
                 all while lightening the marking workload for educators and delivering prompt feedback to students.
                </p>
            </div>
    </div>

</div>
</nav>
</body>
</html>