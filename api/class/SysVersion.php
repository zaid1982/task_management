<?php

class SysVersion extends General {

    function __construct ($userId=0, $isLogged=false) {
        $this->userId = $userId;
        $this->isLogged = $isLogged;
    }

    /**
     * @return array
     * @throws Exception
     */
    public function getRef (): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            $result = array();
            $versionArr = DbMysql::selectAll('sys_version');
            foreach ($versionArr as $version) {
                $result[$version['versionName']] = $version['versionNo'];
            }
            return $result;
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }

}