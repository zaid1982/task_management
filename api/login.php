<?php
require_once 'library/Constant.php';
require_once 'library/Alert.php';
require_once 'library/General.php';
require_once 'library/DbMysql.php';
require_once 'class/SysUser.php';

$apiName = 'login';
$isTransaction = false;
$formData = array('success'=>false, 'result'=>'', 'error'=>'', 'errmsg'=>'');
$result = '';
date_default_timezone_set("Asia/Kuala_Lumpur");

$fnMain = new SysUser();

try {
    DbMysql::connect();
    $fnMain->isLogged = Constant::$isLogged;
    DbMysql::$isLogged = Constant::$isLogged;

    $requestMethod = $_SERVER['REQUEST_METHOD'];
    $fnMain->logDebug('API', $apiName, __LINE__, 'Request method = '.$requestMethod.', URL = '.$_SERVER['REQUEST_URI']);
    $urlArr = $fnMain->getUrlArr($_SERVER['REQUEST_URI'], $apiName);

    if ('POST' === $requestMethod) {
        if (isset($urlArr[1])) {
            throw new Exception('[line: ' . __LINE__ . '] - Wrong POST Request');
        }
        $bodyParams = json_decode(file_get_contents("php://input"), true);
        DbMysql::beginTransaction();
        $isTransaction = true;
        $result = $fnMain->checkLogin($bodyParams['username'], $bodyParams['password']);
        $fnMain->saveAudit(1, $bodyParams['username']);
        DbMysql::commit();
        $formData['result'] = $result;
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


