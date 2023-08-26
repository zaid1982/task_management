<?php

class TskTaskTime extends General {

    public int $taskTimeId;
    private static string $tableName = 'tsk_task_time';
    function __construct (int $userId=0, bool $isLogged=false) {
        $this->userId = $userId;
        $this->isLogged = $isLogged;
    }

    /**
     * @param int $taskTimeId
     * @param array $inputParams
     * @throws Exception
     */
    public function update (int $taskTimeId, array $inputParams): void {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($taskTimeId, 'taskTimeId');
            parent::checkEmptyArray($inputParams, 'inputParams');
            DbMysql::update($this::$tableName, $inputParams, array('taskTimeId'=>$taskTimeId));
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }
}