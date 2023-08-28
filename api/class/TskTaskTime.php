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

    /**
     * @param int $taskId
     * @param array $inputParams
     * @param array $whereParams
     * @throws Exception
     */
    public function updateByTask (int $taskId, array $inputParams, array $whereParams=array()): void {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($taskId, 'taskId');
            parent::checkEmptyArray($inputParams, 'inputParams');
            $taskTimeArr = DbMysql::selectAll($this::$tableName, array_merge(array('taskId'=>$taskId), $whereParams));
            foreach ($taskTimeArr as $taskTime) {
                $this->update($taskTime['taskTimeId'], $inputParams);
                if (array_key_exists('taskTimeEnd', $inputParams)) {
                    $this->updateTimeAmount($taskTime['taskTimeId']);
                }
            }
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param int $taskTimeId
     * @throws Exception
     */
    private function updateTimeAmount (int $taskTimeId): void {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($taskTimeId, 'taskTimeId');
            DbMysql::update($this::$tableName, array('taskTimeAmount'=>"|TIMEDIFF(task_time_end, task_time_start)"), array('taskTimeId'=>$taskTimeId));
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }
}