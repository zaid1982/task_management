<?php

class TskRecurring extends General {

    private static $tableName = 'tsk_recurring';

    function __construct (int $userId=0, bool $isLogged=false) {
        $this->userId = $userId;
        $this->isLogged = $isLogged;
    }

    /**
     * @param array $recurring
     * @return int
     * @throws Exception
     */
    public function runRecurring (array $recurring): int {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            $dueDate = new DateTime($recurring['recurringDue']);
            $taskName = $recurring['recurringName'];
            if ($recurring['recurringType'] === 'Monthly') {
                $recurringMonth = $recurring['recurringMonth'] === 12 ? 1 : $recurring['recurringMonth'] + 1;
                $recurringYear = $recurring['recurringMonth'] === 12 ? $recurring['recurringYear'] + 1 : $recurring['recurringYear'];
                $taskName .= ' - '.parent::getMonthShort($recurringMonth).' '.($recurringYear-2000);
                $dueDate->modify('+ 1 month');
                if ($recurring['recurringRule'] === 'End of month') {
                    if (intval($dueDate->format('j')) < 4) {
                        $dueDate->modify('- 4 day');
                    }
                    $dueDate->setDate($dueDate->format('Y'), $dueDate->format('n'), $dueDate->format('t'));
                } else {
                    if (intval($dueDate->format('j')) < 4 && $recurring['recurringCycleDay'] > 28) {
                        $dueDate->modify('- 4 day');
                    }
                    $dueDate->setDate($dueDate->format('Y'), $dueDate->format('n'), $recurring['recurringCycleDay']);
                    if (intval($dueDate->format('j')) < 4 && $recurring['recurringCycleDay'] > 28) {
                        $dueDate->modify('- 4 day');
                    }
                }
                $taskId = DbMysql::insert('tsk_task', array('taskName'=>$taskName, 'folderId'=>$recurring['recurringFolder'], 'taskDescription'=>$recurring['recurringDescription'], 'taskTags'=>$recurring['recurringTags'],
                    'taskYear'=>$recurringYear, 'taskMonth'=>$recurringMonth, 'taskAssignee'=>1, 'taskDateDue'=>$dueDate->format('Y-m-d'), 'taskPriority'=>$recurring['recurringPriority'], 'recurringId'=>$recurring['recurringId'],
                    'taskTimeEstimate'=>$recurring['recurringTimeEstimate'], 'taskAmount'=>$recurring['recurringAmount']));
                DbMysql::update($this::$tableName, array('recurringYear'=>$recurringYear, 'recurringMonth'=>$recurringMonth, 'recurringDue'=>$dueDate->format('Y-m-d'), 'recurringTimestamp'=>'NOW()'), array('recurringId'=>$recurring['recurringId']));
            } else {
                $recurringYear = $recurring['recurringYear'] + 1;
                $taskName .= ' - '.($recurring['$recurringYear']-2000);
                $dueDate->setDate((intval($dueDate->format('Y')) + 1), $dueDate->format('n'), $dueDate->format('j'));
                $taskId = DbMysql::insert('tsk_task', array('taskName'=>$taskName, 'folderId'=>$recurring['recurringFolder'], 'taskDescription'=>$recurring['recurringDescription'], 'taskTags'=>$recurring['recurringTags'],
                    'taskYear'=>$recurringYear, 'taskAssignee'=>1, 'taskDateDue'=>$dueDate->format('Y-m-d'), 'taskPriority'=>$recurring['recurringPriority'], 'recurringId'=>$recurring['recurringId'],
                    'taskTimeEstimate'=>$recurring['recurringTimeEstimate'], 'taskAmount'=>$recurring['recurringAmount']));
                DbMysql::update($this::$tableName, array('recurringYear'=>$recurringYear, 'recurringDue'=>$dueDate->format('Y-m-d'), 'recurringTimestamp'=>'NOW()'), array('recurringId'=>$recurring['recurringId']));
            }
            return $taskId;
        } catch (Exception|Throwable $ex) {
            throw new Exception('[' . __CLASS__ . ':' . __FUNCTION__ . '] ' . $ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @return int
     * @throws Exception
     */
    public function runDailyRecurring (): int {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            $updateCnt = 0;
            $today = new DateTime();
            $recurringArr = DbMysql::selectAll($this::$tableName, array('recurringDue'=>'<|'.$today->format('Y-m-d'), 'recurringTimestamp'=>'<|'.$today->format('Y-m-d').' 00:00:00'));
            foreach ($recurringArr as $recurring) {
                $this->runRecurring($recurring);
                $updateCnt++;
            }
            return $updateCnt;
        } catch (Exception|Throwable $ex) {
            throw new Exception('[' . __CLASS__ . ':' . __FUNCTION__ . '] ' . $ex->getMessage(), $ex->getCode());
        }
    }
}