<?php
require_once 'class/Constant.php';
require_once 'class/General.php';
require_once 'class/DbMysql.php';
require_once 'class/TskTask.php';

$apiName = 'task';
$isTransaction = false;
$formData = array('success'=>false, 'result'=>'', 'error'=>'', 'errmsg'=>'');
$result = '';
date_default_timezone_set("Asia/Kuala_Lumpur");

$fnMain = new TskTask();

try {
    DbMysql::connect();
    $urlArr = $fnMain->getUrlArr($_SERVER['REQUEST_URI'], $apiName);
    $fnMain->checkJwt(apache_request_headers());
    $fnMain->isLogged = Constant::$isLogged;
    DbMysql::$isLogged = Constant::$isLogged;

    $requestMethod = $_SERVER['REQUEST_METHOD'];
    $fnMain->logDebug('API', $apiName, __LINE__, 'Request method = '.$requestMethod.', URL = '.$_SERVER['REQUEST_URI']);

    if ('GET' === $requestMethod) {
        if (!isset($urlArr[1])) {
            throw new Exception('[line: ' . __LINE__ . '] - Wrong GET Request');
        }
        if ($urlArr[1] === 'list' && isset($urlArr[2])) {
            $result = $fnMain->getList($urlArr[2]);
        } else if ($urlArr[1] === 'summary' && $urlArr[2] === 'all') {
            $result = $fnMain->getListSummaryAll();
        } else if ($urlArr[1] === 'ref' && $urlArr[2] === 'mainTask') {
            $result = $fnMain->getRefMainTask();
        } else if (is_numeric($urlArr[1]) && !isset($urlArr[2])) {
            $result = $fnMain->getEdit(intval($urlArr[1]));
        } else {
            throw new Exception('[line: ' . __LINE__ . '] - Wrong GET Request');
        }
        $formData['result'] = $result;
        $formData['success'] = true;
    }
    else if ('POST' === $requestMethod) {
        if (isset($urlArr[1])) {
            throw new Exception('[line: ' . __LINE__ . '] - Wrong POST Request');
        }
        $bodyParams = json_decode(file_get_contents("php://input"), true);
        DbMysql::beginTransaction();
        $isTransaction = true;
        $taskId = $fnMain->insertForm($bodyParams);
        $fnMain->set($taskId);
        $fnMain->saveAudit(3, 'taskId = '.$taskId.', task name = '.$fnMain->tskTask['taskName']);
        DbMysql::commit();
        $formData['errmsg'] = Constant::$task['create'];
        $formData['success'] = true;
    }
    else if ('PUT' === $requestMethod) {
        if (!isset($urlArr[1])  || !is_numeric($urlArr[1]) || isset($urlArr[2])) {
            throw new Exception('[line: ' . __LINE__ . '] - Wrong PUT Request');
        }
        $taskId = intval($urlArr[1]);
        $bodyParams = json_decode(file_get_contents("php://input"), true);
        DbMysql::beginTransaction();
        $isTransaction = true;
        $fnMain->set($taskId);
        $fnMain->updateForm($taskId, $bodyParams);
        $isClosedBefore = $fnMain->tskTask['statusId'] === 4 || $fnMain->tskTask['statusId'] === 7;
        $isClosedAfter = $bodyParams['statusId'] === 4 || $bodyParams['statusId'] === 7;
        if (!$isClosedBefore && $isClosedAfter) {
            // if done, update tsk_task_time now and if exist
            // if done, update tsk_task_checklist to incomplete if exist
            if ($fnMain->tskTask['taskIsMain'] === 1) {
                $subTaskList = $fnMain->getSubTaskList($taskId);
                foreach ($subTaskList as $subTaskId) {
                    $fnMain->update($subTaskId, array('taskDateClose'=>'NOW()', 'statusId'=>7), array('statusId'=>'NOT IN|4,7'));
                    // if done main task, update tsk_task_time now for all sub if exist
                    // if done main task, update tsk_task_checklist to incomplete for all sub if exist
                }
                $fnMain->updateMainTaskDate($taskId);
            }
        }
        $fnMain->saveAudit(4, 'taskId = '.$taskId.', task name = '.$fnMain->tskTask['taskName']);
        DbMysql::commit();
        $formData['errmsg'] = Constant::$task['update'];
        $formData['success'] = true;
    } else {
        throw new Exception('[line: ' . __LINE__ . '] - Wrong Request Method');
    }
    DbMysql::close();
} catch (Exception $e) {
    try {
        if ($isTransaction) {
            DbMysql::rollback();
        }
        DbMysql::close();
    } catch (Exception $ex) {
        $fnMain->logError('API', $apiName, __LINE__, $e->getMessage());
    }
    $formData['error'] = strpos($e->getMessage(), '] -') ? substr($e->getMessage(), strpos($e->getMessage(), '] -') + 4) : substr($e->getMessage(), strripos($e->getMessage(), '] ') + 2);
    $formData['errmsg'] = $e->getCode() === 31 ? $formData['error'] : Constant::$err['default'];
    $fnMain->logError('API', $apiName, __LINE__, $e->getMessage());
}

echo json_encode($formData);
