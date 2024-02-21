<?php
    require_once('vendor/autoload.php');
    $google = new Google_Client();

    $google->setClientId('779111636513-5g4igneqv6q1gkdqqbqf6i87es598baq.apps.googleusercontent.com');
    $google->setClientSecret('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');
    $google->setRedirectUri('http://localhost/CSE299/CSE299/input.php');
    $google->addScope('email');
    $google->addScope('profile');

    session_start();

?>