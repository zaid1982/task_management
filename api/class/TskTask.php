<?php

class TskTask extends General {

    public int $taskId;
    public array $tskTask;
    private static string $tableName = "tsk_task";
    private static string $sqlInfo = /** @lang text */
        "SELECT
            tmn.task_name AS main_task_name,
            IF (
                tcl.task_id IS NULL, 
                CASE 
                    WHEN mpc.task_main_id IS NOT NULL THEN mpc.perc_done
                    WHEN tsk.status_id = 4 THEN 100 
                    WHEN tsk.status_id = 5 THEN 50 
                    ELSE 0 
                END, 
                tcl.percentage_done
            ) AS progress,
            mpc.main_total_task,
            mpc.main_total_done,
            ttm.time_spent,
	        IF(tsk.task_date_close IS NOT NULL, DATEDIFF(tsk.task_date_due, DATE(tsk.task_date_close)), DATEDIFF(tsk.task_date_due, CURDATE())) AS lateness,
            IF(ttm.time_spent IS NOT NULL AND tsk.task_time_estimate IS NOT NULL, ROUND(TIME_TO_SEC(ttm.time_spent)/TIME_TO_SEC(tsk.task_time_estimate), 2), NULL) AS efficiency,
            tsk.*
        FROM tsk_task tsk
        LEFT JOIN (SELECT task_id, SEC_TO_TIME(SUM(TIME_TO_SEC(task_time_amount))) AS time_spent FROM tsk_task_time GROUP BY task_id) ttm ON ttm.task_id = tsk.task_id
        LEFT JOIN (SELECT task_id, SUM(task_checklist_weightage) AS percentage_done FROM tsk_task_checklist WHERE status_id = 6 GROUP BY task_id) tcl ON tcl.task_id = tsk.task_id
        LEFT JOIN tsk_task tmn ON tmn.task_id = tsk.task_main_id 
        LEFT JOIN (SELECT
                task_main_id,
                COUNT(*) AS main_total_task,
                SUM(IF(status_id = 4, 1, 0)) AS main_total_done,
                ROUND(SUM(IF(status_id = 4, 1, 0))/COUNT(*)*100) AS perc_done
            FROM tsk_task
            WHERE task_main_id IS NOT NULL
            GROUP BY task_main_id) mpc ON mpc.task_main_id = tsk.task_id";

    function __construct (int $userId=0, bool $isLogged=false) {
        $this->userId = $userId;
        $this->isLogged = $isLogged;
    }

    /**
     * @param int $taskId
     * @return array
     * @throws Exception
     */
    public function get (int $taskId): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($taskId, 'taskId');
            return DbMysql::select($this::$tableName, array('taskId'=>$taskId), true);
        } catch (Exception|Throwable $ex) {
            throw new Exception('[' . __CLASS__ . ':' . __FUNCTION__ . '] ' . $ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param int $taskId
     * @throws Exception
     */
    public function set (int $taskId): void {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($taskId, 'taskId');
            $this->taskId = $taskId;
            $this->tskTask = $this->get($taskId);
        } catch (Exception|Throwable $ex) {
            throw new Exception('[' . __CLASS__ . ':' . __FUNCTION__ . '] ' . $ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param string $type
     * @return array
     * @throws Exception
     */
    public function getList (string $type): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyString($type, 'type');
            $sqlWhere = array();
            $sqlOrderBy = '';
            $sqlOrderDirection = '';
            $dateNow = new DateTime();
            if ($type === 'overdue') {
                $sqlWhere['tsk.statusId'] = 'IN|3,5';
                $sqlWhere['tsk.taskDateDue'] = 'IS NOT NULL';
                $sqlWhere['tsk.taskDateDue '] = '<|'.$dateNow->format('Y-m-d');
                $sqlOrderBy = 'taskDateDue';
            }
            else if ($type === 'today') {
                $sqlWhere['tsk.statusId'] = 'IN|3,5';
                $sqlWhere['tsk.taskDateDue'] = $dateNow->format('Y-m-d');
                $sqlOrderBy = 'isnull(tsk.taskDateStart), tsk.taskDateStart';
            }
            else if ($type === 'future') {
                $sqlWhere['tsk.statusId'] = 'IN|3,5';
                $sqlWhere['tsk.taskDateDue'] = 'IS NOT NULL';
                $sqlWhere['tsk.taskDateDue '] = '>|'.$dateNow->format('Y-m-d');
                $sqlOrderBy = 'taskDateDue';
            }
            else if ($type === 'unscheduled') {
                $sqlWhere['tsk.statusId'] = 'IN|3,5';
                $sqlWhere['tsk.taskDateDue'] = 'IS NULL';
                $sqlOrderBy = 'tsk.taskId';
            }
            else if ($type === 'done') {
                $sqlWhere['tsk.statusId'] = 'NOT IN|3,5';
                $sqlOrderBy = 'taskDateClose';
                $sqlOrderDirection = 'DESC';
            }
            return DbMysql::selectSqlAll($this::$sqlInfo, $sqlWhere, 0, false, $sqlOrderBy, $sqlOrderDirection);
        } catch (Exception|Throwable $ex) {
            throw new Exception('[' . __CLASS__ . ':' . __FUNCTION__ . '] ' . $ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @return array
     * @throws Exception
     */
    public function getListSummaryAll (): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            $dateNow = new DateTime();
            $dateStr = $dateNow->format('Y-m-d');
            return DbMysql::selectSql(
                /** @lang text */
                "SELECT
                    SUM(IF(task_date_due = '".$dateStr."' AND status_id IN (3,5), 1, 0)) AS total_today,	
                    SUM(IF(task_date_due IS NOT NULL AND task_date_due < '".$dateStr."' AND status_id IN (3,5), 1, 0)) AS total_overdue,	
                    SUM(IF(task_date_due IS NOT NULL AND task_date_due > '".$dateStr."' AND status_id IN (3,5), 1, 0)) AS total_future,	
                    SUM(IF(task_date_due IS NULL AND status_id IN (3,5), 1, 0)) AS total_unscheduled,	
                    SUM(IF(status_id NOT IN (3,5), 1, 0)) AS total_done
                FROM tsk_task");
        } catch (Exception|Throwable $ex) {
            throw new Exception('[' . __CLASS__ . ':' . __FUNCTION__ . '] ' . $ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @return array
     * @throws Exception
     */
    public function getRefMainTask (): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            return DbMysql::selectAll($this::$tableName, array('taskIsMain'=>1, 'statusId'=>'IN|3,5'), 1);
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
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
            parent::checkEmptyInteger($this->userId, 'userId');
            $params = parent::arraySpliceAssoc($inputParams, array('taskName', 'folderId', 'taskAssignee', 'taskTags', 'taskPriority', 'taskMainId', 'taskDateDue', 'taskAmount', 'taskDescription'));
            parent::checkMandatoryArray($params, array('taskName', 'folderId', 'taskAssignee', 'taskTags', 'taskPriority'), true,
                array('Task Name', 'Folder', 'Assignee', 'Tags', 'Priority'));
            $params['taskCreatedBy'] = $this->userId;
            if ($inputParams['isMain'] === 'Main') {
                $params['taskIsMain'] = 1;
            } else  {
                if ($inputParams['isMain'] === 'Sub') {
                    parent::checkMandatoryArray($params, array('taskMainId'), true, array('Main Task'));
                }
                if ($inputParams['timeEstimate'] !== null) {
                    $timeEstimate = $inputParams['timeEstimate'];
                    if (substr($timeEstimate, 2) === ' minutes') {
                        $params['taskTimeEstimate'] = '00:'.substr($timeEstimate, 0, 2).':00';
                    } else if (substr($timeEstimate, 1) === ' hours') {
                        $params['taskTimeEstimate'] = '0'.substr($timeEstimate, 0, 1).':00:00';
                    } else if ($timeEstimate === '1 hour') {
                        $params['taskTimeEstimate'] = '01:00:00';
                    } else if ($timeEstimate === '1 hour 15 minutes') {
                        $params['taskTimeEstimate'] = '01:15:00';
                    } else if ($timeEstimate === '1 hour 30 minutes') {
                        $params['taskTimeEstimate'] = '01:30:00';
                    } else if ($timeEstimate === '1 hour 45 minutes') {
                        $params['taskTimeEstimate'] = '01:45:00';
                    } else if ($timeEstimate === '2 hours 30 minutes') {
                        $params['taskTimeEstimate'] = '02:30:00';
                    }
                }
                if ($inputParams['startDate'] !== null) {
                    $params['taskDateStart'] = $inputParams['startDate'].($inputParams['startTime'] !== null ? ' '.$inputParams['startTime'].':00' : '');
                    if ($inputParams['timeEstimate'] !== null) {
                        $params['taskDateEnd'] = "|ADDTIME('".$params['taskDateStart']."', '".$params['taskTimeEstimate']."')";
                    }
                }
                if ($inputParams['isMain'] === 'Sub' && isset($params['taskTimeEstimate'])) {
                    DbMysql::update($this::$tableName, array('taskTimeEstimate'=>"|IF(ISNULL(task_time_estimate), '".$params['taskTimeEstimate']."', ADDTIME(task_time_estimate, '".$params['taskTimeEstimate']."'))"), array('taskId'=>$params['taskMainId']));
                }
            }
            return DbMysql::insert($this::$tableName, $params);
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }
}