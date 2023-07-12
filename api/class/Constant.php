<?php

class Constant {
    public static $dbUserName = 'root';
    public static $dbUserPassword = 'password';
    public static $dbName = 'task_management';
    public static $dbHost = 'localhost';
    //public static $redisHost = '127.0.0.1';
    //public static $redisPort = 6379;
    public static $isLogged = true;
    public static $folderDebug = '../../../logs/task_management/debug/';
    //public static $folderDebug = 'C:\Users\User\logs\task_management\\';
    public static $folderError = '../../../logs/task_management/error/';
    public static $url = '//localhost/task_management/api/';

    public static $err = array(
        'default' => 'Error on system. Please contact Administrator!'
    );

}