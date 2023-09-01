<?php
require_once 'library/Constant.php';
require_once 'library/Alert.php';
require_once 'library/General.php';
require_once 'library/DbMysql.php';
require_once 'class/TskTask.php';
require_once 'class/TskTaskTime.php';

$apiName = 'taskTime';
$isTransaction = false;
$formData = array('success'=>false, 'result'=>'', 'error'=>'', 'errmsg'=>'');
$result = '';
date_default_timezone_set("Asia/Kuala_Lumpur");

$fnMain = new TskTaskTime();

try {
    DbMysql::connect();
    $urlArr = $fnMain->getUrlArr($_SERVER['REQUEST_URI'], $apiName);
    $fnMain->checkJwt(apache_request_headers());
    $fnMain->isLogged = Constant::$isLogged;
    DbMysql::$isLogged = Constant::$isLogged;

    $requestMethod = $_SERVER['REQUEST_METHOD'];
    $fnMain->logDebug('API', $apiName, __LINE__, 'Request method = '.$requestMethod.', URL = '.$_SERVER['REQUEST_URI']);

    $fnTask = new TskTask($fnMain->userId, Constant::$isLogged);

    if ('GET' === $requestMethod) {
        if (!isset($urlArr[1])) {
            throw new Exception('[line: ' . __LINE__ . '] - Wrong GET Request');
        }
        if ($urlArr[1] === 'list' && isset($urlArr[2]) && is_numeric($urlArr[2])) {
            $result = $fnMain->getList(intval($urlArr[2]));
        } else if ($urlArr[1] === 'current' && isset($urlArr[2]) && is_numeric($urlArr[2])) {
            $result = $fnMain->getCurrent(intval($urlArr[2]));
        } else if ($urlArr[1] === 'totalSpent' && isset($urlArr[2]) && is_numeric($urlArr[2])) {
            $taskId = intval($urlArr[2]);
            $tskTask = $fnTask->get($taskId);
            $result = $fnMain->getTotalSpent($taskId, $tskTask['taskTimeEstimate']);
        } else {
            throw new Exception('[line: ' . __LINE__ . '] - Wrong GET Request');
        }
        $formData['result'] = $result;
        $formData['success'] = true;
    }
    else if ('POST' === $requestMethod) {
        if (!isset($urlArr[1]) || !is_numeric($urlArr[1]) || isset($urlArr[2])) {
            throw new Exception('[line: ' . __LINE__ . '] - Wrong PUT Request');
        }
        $taskId = intval($urlArr[1]);
        $bodyParams = json_decode(file_get_contents("php://input"), true);
        DbMysql::beginTransaction();
        $isTransaction = true;
        $fnTask->set($taskId);
        if ($fnTask->tskTask['taskIsMain'] === 1) {
            throw new Exception(Alert::$taskTime['errIsMain'], 31);
        }
        if ($fnTask->tskTask['taskDateStart'] === null || $fnTask->tskTask['taskTimeEstimate'] === null) {
            throw new Exception(Alert::$taskTime['errNoStartDate'], 31);
        }
        if ($fnTask->tskTask['statusId'] === 4 || $fnTask->tskTask['statusId'] === 7) {
            throw new Exception(Alert::$taskTime['errIsClose'], 31);
        }
        $fnMain->insert(array_merge(array('taskId'=>$taskId, 'taskTimeStart'=>'NOW()'), $bodyParams));
        if ($fnTask->tskTask['statusId'] === 3) {
            $fnTask->update($taskId, array('statusId'=>5));
            $fnMain->saveAudit(4, 'taskId = '.$taskId.', task name = '.$fnMain->$fnTask['taskName']);
        }
        if ($fnTask->tskTask['taskMainId'] !== null) {
            $taskMainId = $fnTask->tskTask['taskMainId'];
            $taskMain = $fnTask->get($taskMainId);
            if ($taskMain['statusId'] === 3) {
                $fnTask->update($taskMainId, array('taskDateStart' => 'CURDATE()', 'statusId' => 5));
                $fnMain->saveAudit(4, 'taskId = ' . $taskMainId . ', task name = ' . $taskMain['taskName']);
            }
        }
        $fnMain->saveAudit(8, 'taskId = '.$taskId.', task name = '.$fnTask->tskTask['taskName']);
        DbMysql::commit();
        $formData['errmsg'] = Alert::$taskTime['start'];
        $formData['success'] = true;
    }
    else if ('PUT' === $requestMethod) {
        if (!isset($urlArr[1])) {
            throw new Exception('[line: ' . __LINE__ . '] - Wrong PUT Request');
        }
        $bodyParams = json_decode(file_get_contents("php://input"), true);
        DbMysql::beginTransaction();
        $isTransaction = true;
        if ($urlArr[1] === 'stop' && isset($urlArr[2]) || is_numeric($urlArr[2])) {
            $taskTimeId = intval($urlArr[2]);
            $taskTime = $fnMain->get($taskTimeId);
            $fnTask->set($taskTime['taskId']);
            if ($fnTask->tskTask['taskIsMain'] === 1) {
                throw new Exception(Alert::$taskTime['errIsMain'], 31);
            }
            $fnMain->update($taskTimeId, array_merge(array('taskTimeEnd'=>'NOW()'), $bodyParams));
            $fnMain->updateTimeAmount($taskTimeId);
            $fnMain->saveAudit(9, 'taskId = '.$taskTime['taskId'].', task name = '.$fnTask->tskTask['taskName']);
            $fnMain->errMsg = Alert::$taskTime['stop'];
        } else if (is_numeric($urlArr[1]) && !isset($urlArr[2])) {
            $taskTimeId = intval($urlArr[1]);
            $taskTime = $fnMain->get($taskTimeId);
            $fnTask->set($taskTime['taskId']);
            $fnMain->update($taskTimeId, $bodyParams);
            $fnMain->saveAudit(7, 'taskId = '.$taskTime['taskId'].', task name = '.$fnTask->tskTask['taskName']);
            $fnMain->errMsg = Alert::$taskTime['update'];
        } else {
            throw new Exception('[line: ' . __LINE__ . '] - Wrong PUT Request');
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

