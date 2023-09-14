<?php

class TskRecurringChecklist extends General {

    public int $recurringChecklistId;
    private static string $tableName = 'tsk_recurring_checklist';

    function __construct (int $userId=0, bool $isLogged=false) {
        $this->userId = $userId;
        $this->isLogged = $isLogged;
    }

    /**
     * @param int $recurringChecklistId
     * @return array
     * @throws Exception
     */
    public function get (int $recurringChecklistId): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($recurringChecklistId, 'recurringChecklistId');
            return DbMysql::select($this::$tableName, array('recurringChecklistId'=>$recurringChecklistId), true);
        } catch (Exception|Throwable $ex) {
            throw new Exception('[' . __CLASS__ . ':' . __FUNCTION__ . '] ' . $ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param int $recurringId
     * @return array
     * @throws Exception
     */
    public function getList (int $recurringId): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($recurringId, 'recurringId');
            return DbMysql::selectAll($this::$tableName, array('recurringId'=>$recurringId));
        } catch (Exception|Throwable $ex) {
            throw new Exception('[' . __CLASS__ . ':' . __FUNCTION__ . '] ' . $ex->getMessage(), $ex->getCode());
        }
    }
}