<?php
require_once 'library/Constant.php';
require_once 'library/Alert.php';
require_once 'library/General.php';
require_once 'library/DbMysql.php';
require_once 'class/TskTask.php';
require_once 'class/TskTaskTime.php';
require_once 'class/TskTaskChecklist.php';

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
        $formData['errmsg'] = Alert::$task['add'];
        $formData['success'] = true;
    }
    else if ('PUT' === $requestMethod) {
        if (!isset($urlArr[1])) {
            throw new Exception('[line: ' . __LINE__ . '] - Wrong PUT Request');
        }
        if ($urlArr[1] === 'done' && isset($urlArr[2]) && is_numeric($urlArr[2])) {
            $isShortcut = true;
        } else if (is_numeric($urlArr[1]) && !isset($urlArr[2])) {
            $isShortcut = false;
        } else {
            throw new Exception('[line: ' . __LINE__ . '] - Wrong PUT Request');
        }
        DbMysql::beginTransaction();
        $isTransaction = true;
        if ($isShortcut) {
            $taskId = intval($urlArr[2]);
            $statusId = 4;
            $fnMain->set($taskId);
            $fnMain->update($taskId, array('taskDateClose'=>'NOW()', 'statusId'=>$statusId));
        } else {
            $taskId = intval($urlArr[1]);
            $bodyParams = json_decode(file_get_contents("php://input"), true);
            $statusId = $bodyParams['statusId'];
            $fnMain->set($taskId);
            $fnMain->updateForm($taskId, $bodyParams);
        }
        $fnTaskTime = new TskTaskTime($fnMain->userId, Constant::$isLogged);
        if (($fnMain->tskTask['statusId'] === 3 || $fnMain->tskTask['statusId'] === 5) && ($statusId === 4 || $statusId === 7)) {
            $fnTaskChecklist = new TskTaskChecklist($fnMain->userId, Constant::$isLogged);
            $fnTaskChecklist->updateByTask($taskId, array('statusId'=>7), array('statusId'=>3));
            if ($fnMain->tskTask['taskIsMain'] === 1) {
                $subTaskList = $fnMain->getSubTaskList($taskId);
                foreach ($subTaskList as $subTaskId) {
                    $fnMain->update($subTaskId, array('taskDateClose'=>'NOW()', 'statusId'=>7), array('statusId'=>'NOT IN|4,7'));
                    $fnTaskTime->closeByTask($subTaskId, array('taskTimeEnd'=>'NOW()'), array('taskTimeEnd'=>'IS NULL'));
                    $fnTaskChecklist->updateByTask($subTaskId, array('statusId'=>7), array('statusId'=>3));
                    $subTask = $fnMain->get($subTaskId);
                    $fnMain->saveAudit(5, 'taskId = '.$subTaskId.', task name = '.$subTask['taskName']);
                }
                $fnMain->updateMainTaskEndDate($taskId);
                $fnMain->saveAudit(6, 'taskId = '.$taskId.', task name = '.$fnMain->tskTask['taskName']);
            } else {
                if ($fnMain->tskTask['statusId'] === 5) {
                    $fnTaskTime->closeByTask($taskId, array('taskTimeEnd'=>'NOW()'), array('taskTimeEnd'=>'IS NULL'));
                }
                $fnMain->saveAudit(5, 'taskId = '.$taskId.', task name = '.$fnMain->tskTask['taskName']);
            }
            $fnMain->errMsg = Alert::$task['close'];
        } else {
            if ($fnMain->tskTask['statusId'] === 3 && $statusId === 5) {
                $fnTaskTime->setTskTask($fnMain->get($taskId));
                $fnTaskTime->insert($taskId);
            }
            $fnMain->saveAudit(4, 'taskId = '.$taskId.', task name = '.$fnMain->tskTask['taskName']);
            $fnMain->errMsg = Alert::$task['update'];
        }
        DbMysql::commit();
        $formData['errmsg'] = $fnMain->errMsg;
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
    $formData['errmsg'] = $e->getCode() === 31 ? $formData['error'] : Alert::$err['default'];
    $fnMain->logError('API', $apiName, __LINE__, $e->getMessage());
}

echo json_encode($formData);
