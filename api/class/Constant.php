<?php

class Constant {
    public static string $dbUserName = 'root';
    //public static string $dbUserName = 'zaid';
    public static string $dbUserPassword = 'password';
    //public static string $dbUserPassword = 'Amlyda@1982';
    public static string $dbName = 'task_management';
    //public static string $dbHost = 'metadatasystem.my';
    public static string $dbHost = 'localhost';
    //public static string $redisHost = '127.0.0.1';
    //public static string $redisPort = 6379;
    public static bool $isLogged = true;
    public static string $folderDebug = '../../../logs/task_management/debug/';
    //public static string $folderDebug = 'C:\Users\User\logs\task_management\\';
    public static string $folderError = '../../../logs/task_management/error/';
    public static string $url = '//localhost/task_management/api/';

    public static array $err = array(
        'default' => 'Error on system. Please contact Administrator!'
    );

    public static array $user = array(
        'errNotExist' => 'Invalid user. Please register!',
        'errPassword' => 'Incorrect Password!',
        'errPasswordCurrent' => 'Incorrect Current Password!',
        'errPasswordNewSame' => 'New Password must not similar with current password!',
        'errImageEmpty' => 'Profile picture not uploaded correctly!',
        'errMyKadExist' => 'Mykad No __ already registered!',
        'errRoleExist' => '_1 role from _2 department already registered for this user!',
        'submitNew' => '__ successfully registered. Activation email will be send to the user.',
        'activate' => 'New Password successfully saved and activated!',
        'update' => '__ information successfully updated!',
        'changePassword' => 'New Password successfully saved!',
        'resetPassword' => 'Password successfully reset and email will be send to user!'
    );

    public static array $task = array(
        'create' => 'Task successfully added!'
    );
}