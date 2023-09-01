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
     * @return array
     * @throws Exception
     */
    public function get (int $taskTimeId): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($taskTimeId, 'taskTimeId');
            return DbMysql::select($this::$tableName, array('taskTimeId'=>$taskTimeId), true);
        } catch (Exception|Throwable $ex) {
            throw new Exception('[' . __CLASS__ . ':' . __FUNCTION__ . '] ' . $ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param int $taskId
     * @return array
     * @throws Exception
     */
    public function getList (int $taskId): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($taskId, 'taskId');
            return DbMysql::selectAll($this::$tableName, array('taskId'=>$taskId));
        } catch (Exception|Throwable $ex) {
            throw new Exception('[' . __CLASS__ . ':' . __FUNCTION__ . '] ' . $ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param int $taskId
     * @return array
     * @throws Exception
     */
    public function getCurrent (int $taskId): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($taskId, 'taskId');
            return DbMysql::select($this::$tableName, array('taskId'=>$taskId, 'taskTimeEnd'=>'IS NULL'));
        } catch (Exception|Throwable $ex) {
            throw new Exception('[' . __CLASS__ . ':' . __FUNCTION__ . '] ' . $ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param int $taskId
     * @param string|null $estimateTime
     * @return array
     * @throws Exception
     */
    public function getTotalSpent (int $taskId, string|null $estimateTime): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($taskId, 'taskId');
            parent::checkEmptyString($estimateTime, 'estimateTime');
            $returnArr = array('totalSpent'=>'00:00:00', 'class'=>'text-danger');
            $sqlResult = DbMysql::selectSql(
                    /** @lang text */
                    "SELECT 
                            SEC_TO_TIME(SUM(TIME_TO_SEC(task_time_amount))) AS time_spent
                        FROM tsk_task_time",
                array('taskId'=>$taskId));
            $timeSpent = $sqlResult['timeSpent'];
            if ($timeSpent !== null) {
                $returnArr['totalSpent'] = $timeSpent;
                $returnArr['class'] = $timeSpent > $estimateTime ? 'text-danger' : 'text-success';
            }
            return $returnArr;
        } catch (Exception|Throwable $ex) {
            throw new Exception('[' . __CLASS__ . ':' . __FUNCTION__ . '] ' . $ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param array $inputParams
     * @return int
     * @throws Exception
     */
    public function insert (array $inputParams): int {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkMandatoryArray($inputParams, array('taskId', 'taskTimeStart'));
            return DbMysql::insert($this::$tableName, $inputParams);
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
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
    public function updateTimeAmount (int $taskTimeId): void {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($taskTimeId, 'taskTimeId');
            DbMysql::update($this::$tableName, array('taskTimeAmount'=>"|TIMEDIFF(task_time_end, task_time_start)"), array('taskTimeId'=>$taskTimeId));
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }
}