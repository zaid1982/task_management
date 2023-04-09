<?php

class Constant {
    public static $dbUserName = 'root';
    public static $dbUserPassword = 'password';
    public static $dbName = 'task_management';
    public static $dbHost = 'localhost';
    //public static $redisHost = '127.0.0.1';
    //public static $redisPort = 6379;
    public static $isLogged = true;
    public static $folderDebug = 'C:\Users\User\logs\task_management\\';
    public static $url = '//localhost:8082/task_management/api/';

    public static $err = array(
        'default' => 'Error on system. Please contact Administrator!'
    );

}