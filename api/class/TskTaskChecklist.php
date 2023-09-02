<?php

class TskTaskChecklist extends General {

    public int $taskChecklistId;
    private static string $tableName = 'tsk_task_checklist';
    function __construct (int $userId=0, bool $isLogged=false) {
        $this->userId = $userId;
        $this->isLogged = $isLogged;
    }

    /**
     * @param int $taskChecklistId
     * @return array
     * @throws Exception
     */
    public function get (int $taskChecklistId): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($taskChecklistId, 'taskChecklistId');
            return DbMysql::select($this::$tableName, array('taskChecklistId'=>$taskChecklistId), true);
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
     * @param array $inputParams
     * @return int
     * @throws Exception
     */
    public function insertForm (int $taskId, array $inputParams): int {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($this->userId, 'userId');
            parent::checkMandatoryArray($inputParams, array('taskChecklistName', 'taskChecklistWeightage'), true, array('Description', 'Weightage'));
            $inputParams['taskId'] = $taskId;
            return DbMysql::insert($this::$tableName, $inputParams);
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param int $taskChecklistId
     * @param array $inputParams
     * @throws Exception
     */
    public function update (int $taskChecklistId, array $inputParams): void {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($taskChecklistId, 'taskChecklistId');
            parent::checkEmptyArray($inputParams, 'inputParams');
            DbMysql::update($this::$tableName, $inputParams, array('taskChecklistId'=>$taskChecklistId));
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
            DbMysql::update($this::$tableName, $inputParams, array_merge(array('taskId'=>$taskId), $whereParams));
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param int $taskChecklistId
     * @throws Exception
     */
    public function delete (int $taskChecklistId): void {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($taskChecklistId, 'taskChecklistId');
            DbMysql::delete($this::$tableName, array('taskChecklistId'=>$taskChecklistId));
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }
}