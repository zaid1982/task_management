<?php

class Constant {
    public static string $dbUserName = 'root';
    //public static string $dbUserName = 'zaid';
    public static string $dbUserPassword = 'password';
    //public static string $dbUserPassword = 'Amlyda@1982';
    public static string $dbName = 'task_management';
    public static string $dbHost = 'localhost';
    
    //public static string $redisHost = '127.0.0.1';
    //public static string $redisPort = 6379;

    public static bool $isLogged = true;
    //public static string $folderDebug = '../../../logs/task-management.metadatasystem.my/debug/';
    public static string $folderDebug = '../../../logs/task_management/debug/';
    //public static string $folderDebug = 'C:\Users\User\logs\task_management\\';
    //public static string $folderError = '../../../logs/task-management.metadatasystem.my/error/';
    public static string $folderError = '../../../logs/task_management/error/';
    public static string $url = '//localhost/task_management/api/';
}