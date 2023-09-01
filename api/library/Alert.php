<?php

class Alert {
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
        'create' => 'Task successfully added!',
        'update' => 'Task successfully updated!',
        'close' => 'Task successfully closed!',
        'errStartDateInProgress' => 'Please insert Start Date to change status to In Progress!',
        'errStartDateNoEstimate' => 'Please insert Time Estimate to plan Start Date!'
    );

    public static array $taskTime = array(
        'update' => 'Task Time successfully updated!',
        'start' => 'Time Track successfully started!',
        'stop' => 'Time Track successfully stopped!',
        'errIsMain' => 'Main Task is not allowed to use Time Track!',
        'errNoStartDate' => 'Please plan the Start Date to use Time Track!',
        'errIsClose' => 'Closed Task is not allowed to use Time Track!'
    );
}