<?php

class TskTask extends General {

    public int $taskId;
    public array $tskTask;
    private static string $tableName = 'tsk_task';
    private static string $sqlInfo = /** @lang text */
        "SELECT
            tmn.task_name AS main_task_name,
            IF (tcl.task_id IS NOT NULL, 1, 0) AS is_checklist,
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
        LEFT JOIN (SELECT task_id, SUM(IF(status_id=6,task_checklist_weightage,0))/SUM(task_checklist_weightage)*100 AS percentage_done FROM tsk_task_checklist GROUP BY task_id) tcl ON tcl.task_id = tsk.task_id
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
     * @param int $taskId
     * @return array
     * @throws Exception
     */
    public function getEdit (int $taskId): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($taskId, 'taskId');
            $tskTask = DbMysql::select($this::$tableName, array('taskId'=>$taskId), 1);
            $returnArr = parent::arraySpliceAssoc($tskTask, array('taskId', 'taskName', 'folderId', 'taskAssignee', 'taskPriority', 'taskMainId', 'taskDateDue', 'taskAmount', 'taskDescription', 'statusId'));
            $returnArr['tags'] = $this->getTagsArr($tskTask['taskTags']);
            $returnArr['isMain'] = 'Normal';
            $returnArr['timeEstimate'] = null;
            $returnArr['startDate'] = null;
            $returnArr['startTime'] = null;
            if ($tskTask['taskIsMain'] === 1) {
                $returnArr['isMain'] = 'Main';
            } else if ($tskTask['taskMainId'] !== null) {
                $returnArr['isMain'] = 'Sub';
            }
            if ($tskTask['taskIsMain'] !== 1 && $tskTask['taskTimeEstimate'] !== null) {
                $returnArr['timeEstimate'] = $this->getTimeEstimateDisplay($tskTask['taskTimeEstimate']);
                $returnArr['timeEstimateInList'] = $this->getIsTimeEstimateInList($returnArr['timeEstimate']);
            }
            if ($tskTask['taskDateStart'] !== null) {
                $returnArr['startDate'] = substr($tskTask['taskDateStart'], 0, 10);
                $returnArr['startTime'] = substr($tskTask['taskDateStart'], 11, 5);
            }
            return $returnArr;
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
            parent::checkMandatoryArray($inputParams, array('taskName', 'folderId', 'taskAssignee', 'taskTags', 'taskPriority'));
            if ($inputParams['timeEstimate'] === null && $inputParams['startDate'] !== null) {
                throw new Exception(Alert::$task['errStartDateNoEstimate'], 31);
            }
            if ($inputParams['isMain'] === 'Sub') {
                parent::checkMandatoryArray($inputParams, array('taskMainId'));
            }
            $inputParams['taskCreatedBy'] = $this->userId;
            if ($inputParams['isMain'] === 'Sub' && isset($inputParams['taskTimeEstimate'])) {
                DbMysql::update($this::$tableName, array('taskTimeEstimate'=>"|IF(ISNULL(task_time_estimate), '".$inputParams['taskTimeEstimate']."', ADDTIME(task_time_estimate, '".$inputParams['taskTimeEstimate']."'))"), array('taskId'=>$inputParams['taskMainId']));
            }
            return DbMysql::insert($this::$tableName, $inputParams);
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param array $inputParams
     * @return int
     * @throws Exception
     */
    public function insertForm (array $inputParams): int {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($this->userId, 'userId');
            $params = parent::arraySpliceAssoc($inputParams, array('taskName', 'folderId', 'moduleId', 'taskAssignee', 'taskTags', 'taskPriority', 'taskMainId', 'taskDateDue', 'taskAmount', 'taskDescription'));
            parent::checkMandatoryArray($params, array('taskName', 'folderId', 'taskAssignee', 'taskTags', 'taskPriority'), true,
                array('Task Name', 'Folder', 'Assignee', 'Tags', 'Priority'));
            if ($inputParams['timeEstimate'] === null && $inputParams['startDate'] !== null) {
                throw new Exception(Alert::$task['errStartDateNoEstimate'], 31);
            }
            $params['taskCreatedBy'] = $this->userId;
            if ($inputParams['isMain'] === 'Main') {
                $params['taskIsMain'] = 1;
            } else  {
                if ($inputParams['isMain'] === 'Sub') {
                    parent::checkMandatoryArray($params, array('taskMainId'), true, array('Main Task'));
                }
                $params['taskTimeEstimate'] = $this->getTimeEstimateDb($inputParams['timeEstimate']);
                if ($inputParams['startDate'] !== null && $params['taskTimeEstimate'] !== null) {
                    $params['taskDateStart'] = $inputParams['startDate'].($inputParams['startTime'] !== null ? ' '.$inputParams['startTime'].':00' : '');
                    $params['taskDateEnd'] = "|ADDTIME('".$params['taskDateStart']."', '".$params['taskTimeEstimate']."')";
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

    /**
     * @param int $taskId
     * @param array $inputParams
     * @param array $whereParams
     * @throws Exception
     */
    public function update (int $taskId, array $inputParams, array $whereParams=array()): void {
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
     * @param int $taskId
     * @param array $inputParams
     * @throws Exception
     */
    public function updateForm (int $taskId, array $inputParams): void {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($taskId, 'taskId');
            $params = parent::arraySpliceAssoc($inputParams, array('taskName', 'taskTags', 'taskPriority', 'taskDateDue', 'taskAmount', 'taskDescription', 'statusId'));
            parent::checkMandatoryArray($params, array('taskName', 'taskTags', 'taskPriority', 'statusId'), true, array('Task Name', 'Tags', 'Priority', 'Status'));
            if ($inputParams['timeEstimate'] === null && $inputParams['startDate'] !== null) {
                throw new Exception(Alert::$task['errStartDateNoEstimate'], 31);
            }
            $tskTask = $this->get($taskId);
            if ($params['statusId'] === 5 && $inputParams['startDate'] === null && $tskTask['taskIsMain'] === 0) {
                throw new Exception(Alert::$task['errStartDateInProgress'], 31);
            }
            if ($params['statusId'] === 4 || $params['statusId'] === 7) {
                $params['taskDateClose'] = 'NOW()';
            }
            if ($tskTask['taskIsMain'] === 0) {
                $params['taskTimeEstimate'] = $this->getTimeEstimateDb($inputParams['timeEstimate']);
                $params['taskDateStart'] = null;
                $params['taskDateEnd'] = null;
                if ($inputParams['startDate'] !== null && $params['taskTimeEstimate']) {
                    $params['taskDateStart'] = $inputParams['startDate'].($inputParams['startTime'] !== null ? ' '.$inputParams['startTime'].':00' : '');
                    $params['taskDateEnd'] = "|ADDTIME('".$params['taskDateStart']."', '".$params['taskTimeEstimate']."')";
                }
                if ($tskTask['taskMainId'] !== null && $tskTask['taskTimeEstimate'] !== $params['taskTimeEstimate']) {
                    if ($tskTask['taskTimeEstimate'] !== null) {
                        DbMysql::update($this::$tableName, array('taskTimeEstimate'=>"|SUBTIME(task_time_estimate, '".$tskTask['taskTimeEstimate']."')"), array('taskId'=>$tskTask['taskMainId']));
                    }
                    if ($params['taskTimeEstimate'] !== null) {
                        DbMysql::update($this::$tableName, array('taskTimeEstimate'=>"|IF(ISNULL(task_time_estimate), '".$params['taskTimeEstimate']."', ADDTIME(task_time_estimate, '".$params['taskTimeEstimate']."'))"), array('taskId'=>$tskTask['taskMainId']));
                    }
                }
            }
            DbMysql::update($this::$tableName, $params, array('taskId'=>$taskId));
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param int $taskId
     * @return array
     * @throws Exception
     */
    public function getSubTaskList (int $taskId): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($taskId, 'taskId');
            $returnArr = array();
            $taskArr = DbMysql::selectAll($this::$tableName, array('taskMainId'=>$taskId));
            foreach ($taskArr as $task) {
                $returnArr[] = $task['taskId'];
            }
            return $returnArr;
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param int $taskId
     * @throws Exception
     */
    public function updateMainTaskEndDate (int $taskId): void {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($taskId, 'taskId');
            $taskDates = DbMysql::selectSql(
                    /** @lang text */
                    "SELECT 
                        DATE(MAX(task_date_end)) AS date_end
                    FROM tsk_task",
                array('taskMainId'=>$taskId));
            DbMysql::update($this::$tableName, array('taskDateEnd'=>$taskDates['dateEnd']), array('taskId'=>$taskId));
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param string $timeEstimate
     * @return string|null
     * @throws Exception
     */
    private function getTimeEstimateDisplay (string $timeEstimate): string|null {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyString($timeEstimate, 'timeEstimate');
            $partials = explode(':', $timeEstimate);
            if (count($partials) !== 3) {
                return null;
            }
            $returnVal = '';
            if ($partials[0] === '01') {
                $returnVal = '1 hour ';
            } else if ($partials[0] !== '00') {
                $returnVal = intval($partials[0]).' hours ';
            }
            if ($partials[1] !== '00') {
                $returnVal .= $partials[1].' minutes';
            }
            return rtrim($returnVal);
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param string|null $timeEstimateDisplay
     * @return bool
     * @throws Exception
     */
    private function getIsTimeEstimateInList (string|null $timeEstimateDisplay): bool {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            if ($timeEstimateDisplay === null) {
                return false;
            }
            parent::checkEmptyString($timeEstimateDisplay, 'timeEstimate');
            $timeDisplayArr = array('10 minutes', '15 minutes', '20 minutes', '30 minutes', '40 minutes', '45 minutes', '50 minutes',
                '1 hour', '1 hour 15 minutes', '1 hour 30 minutes', '1 hour 45 minutes', '2 hours', '2 hours 30 minutes', '3 hours', '4 hours', '5 hours', '6 hours');
            if (in_array($timeEstimateDisplay, $timeDisplayArr)) {
                return true;
            }
            return false;
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param string $tags
     * @return array
     * @throws Exception
     */
    private function getTagsArr (string $tags): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyString($tags, 'tags');
            $tagDisplayArr = array('', 'personal', 'vm', 'sales', 'hr', 'meeting', 'payment', 'doc', 'coding', 'cr', 'bugs', 'config', 'support');
            $tagArr = explode(',', $tags);
            $returnArr = array();
            foreach ($tagArr as $tag) {
                $returnArr[] = array_search($tag, $tagDisplayArr);
            }
            return $returnArr;
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param string|null $timeEstimate
     * @return string|null
     * @throws Exception
     */
    private function getTimeEstimateDb (string|null $timeEstimate): string|null {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            $returnVal = null;
            if (substr($timeEstimate, 2) === ' minutes') {
                $returnVal = '00:'.substr($timeEstimate, 0, 2).':00';
            } else if (substr($timeEstimate, 1) === ' hours') {
                $returnVal = '0'.substr($timeEstimate, 0, 1).':00:00';
            } else if ($timeEstimate === '1 hour') {
                $returnVal = '01:00:00';
            } else if ($timeEstimate === '1 hour 15 minutes') {
                $returnVal = '01:15:00';
            } else if ($timeEstimate === '1 hour 30 minutes') {
                $returnVal = '01:30:00';
            } else if ($timeEstimate === '1 hour 45 minutes') {
                $returnVal = '01:45:00';
            } else if ($timeEstimate === '2 hours 30 minutes') {
                $returnVal = '02:30:00';
            }
            return $returnVal;
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }
}