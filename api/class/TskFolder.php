<?php

class TskFolder extends General {

    private static string $tableName = 'tsk_folder';

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
            return DbMysql::selectAll($this::$tableName, array(), 1);
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }
}