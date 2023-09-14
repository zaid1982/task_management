<?php
require_once 'library/Constant.php';
require_once 'library/Alert.php';
require_once 'library/General.php';
require_once 'library/DbMysql.php';
require_once 'class/TskTask.php';
require_once 'class/TskTaskChecklist.php';

$apiName = 'taskChecklist';
$isTransaction = false;
$formData = array('success'=>false, 'result'=>'', 'error'=>'', 'errmsg'=>'');
$result = '';
date_default_timezone_set("Asia/Kuala_Lumpur");

$fnMain = new TskTaskChecklist();

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
        } else {
            throw new Exception('[line: ' . __LINE__ . '] - Wrong GET Request');
        }
        $formData['result'] = $result;
        $formData['success'] = true;
    }
    else if ('POST' === $requestMethod) {
        if (!isset($urlArr[1]) || !is_numeric($urlArr[1]) || isset($urlArr[2])) {
            throw new Exception('[line: ' . __LINE__ . '] - Wrong POST Request');
        }
        $taskId = intval($urlArr[1]);
        $bodyParams = json_decode(file_get_contents("php://input"), true);
        $fnTask->set($taskId);
        if ($fnTask->tskTask['statusId'] === 4 || $fnTask->tskTask['statusId'] === 7) {
            throw new Exception(Alert::$taskChecklist['errIsClose'], 31);
        }
        DbMysql::beginTransaction();
        $isTransaction = true;
        $fnMain->insert($taskId, $bodyParams, true);
        $fnMain->saveAudit(10, 'taskId = '.$taskId.', task name = '.$fnTask->tskTask['taskName'].', checklist name = '.$bodyParams['taskChecklistName']);
        DbMysql::commit();
        $formData['errmsg'] = Alert::$taskChecklist['add'];
        $formData['success'] = true;
    }
    else if ('PUT' === $requestMethod) {
        if (!isset($urlArr[1])) {
            throw new Exception('[line: ' . __LINE__ . '] - Wrong PUT Request');
        }
        DbMysql::beginTransaction();
        $isTransaction = true;
        if ($urlArr[1] === 'done' && isset($urlArr[2]) && is_numeric($urlArr[2])) {
            $taskChecklistId = intval($urlArr[2]);
            $taskChecklist = $fnMain->get($taskChecklistId);
            $fnTask->set($taskChecklist['taskId']);
            $fnMain->update($taskChecklistId, array('statusId'=>6));
            $fnMain->saveAudit(12, 'taskId = '.$taskChecklist['taskId'].', task name = '.$fnTask->tskTask['taskName'].', checklist name = '.$taskChecklist['taskChecklistName']);
            $fnMain->errMsg = Alert::$taskChecklist['done'];
        } else if ($urlArr[1] === 'open' && isset($urlArr[2]) && is_numeric($urlArr[2])) {
            $taskChecklistId = intval($urlArr[2]);
            $taskChecklist = $fnMain->get($taskChecklistId);
            $fnTask->set($taskChecklist['taskId']);
            $fnMain->update($taskChecklistId, array('statusId'=>3));
            $fnMain->saveAudit(13, 'taskId = '.$taskChecklist['taskId'].', task name = '.$fnTask->tskTask['taskName'].', checklist name = '.$taskChecklist['taskChecklistName']);
            $fnMain->errMsg = Alert::$taskChecklist['open'];
        } else if (is_numeric($urlArr[1]) && !isset($urlArr[2])) {
            $bodyParams = json_decode(file_get_contents("php://input"), true);
            $taskChecklistId = intval($urlArr[1]);
            $taskChecklist = $fnMain->get($taskChecklistId);
            $fnTask->set($taskChecklist['taskId']);
            $fnMain->update($taskChecklistId, $bodyParams);
            $fnMain->saveAudit(11, 'taskId = '.$taskChecklist['taskId'].', task name = '.$fnTask->tskTask['taskName'].', checklist name = '.$bodyParams['taskChecklistName']);
            $fnMain->errMsg = Alert::$taskChecklist['update'];
        } else {
            throw new Exception('[line: ' . __LINE__ . '] - Wrong PUT Request');
        }
        DbMysql::commit();
        $formData['errmsg'] = $fnMain->errMsg;
        $formData['success'] = true;
    }
    else if ('DELETE' === $requestMethod) {
        if (!isset($urlArr[1]) || !is_numeric($urlArr[1]) || isset($urlArr[2])) {
            throw new Exception('[line: ' . __LINE__ . '] - Wrong DELETE Request');
        }
        $taskChecklistId = intval($urlArr[1]);
        $taskChecklist = $fnMain->get($taskChecklistId);
        $fnTask->set($taskChecklist['taskId']);
        if ($fnTask->tskTask['statusId'] === 4 || $fnTask->tskTask['statusId'] === 7) {
            throw new Exception(Alert::$taskChecklist['errIsClose'], 31);
        }
        DbMysql::beginTransaction();
        $isTransaction = true;
        $fnMain->delete($taskChecklistId);
        $fnMain->saveAudit(14, 'taskId = '.$taskChecklist['taskId'].', task name = '.$fnTask->tskTask['taskName'].', checklist name = '.$taskChecklist['taskChecklistName']);
        DbMysql::commit();
        $formData['errmsg'] = Alert::$taskTime['delete'];
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
