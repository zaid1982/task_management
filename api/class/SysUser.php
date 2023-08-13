<?php

class SysUser extends General {

    public int $userIds;
    public string $userFullNames;
    public array $sysUser;
    private static string $tableName = 'sys_user';
    private static string $sqlInfo = /** @lang text */
        "SELECT
            sys_user.user_id,
            sys_user.user_name,
            sys_user.user_type,
            sys_user.user_first_name,
            sys_user.user_last_name,
            sys_user.user_mykad_no,
            sys_user.address_id,
            sys_user.user_contact_no,
            sys_user.user_email,
            sys_user.designation_id,
            sys_user.department_id,
            sys_user.user_staff_no,
            sys_user.user_time_created,
            sys_user.user_time_activate,
            sys_user.user_time_login,
            sys_user.user_signature,
            sys_user.status_id,
            sys_user.user_is_first_time,
            sys_user.upload_id,
            user_role.group_roles,
            role_list.roles
        FROM sys_user
        LEFT JOIN
        (
            SELECT 
                su.user_id, group_concat(CONCAT(g.group_short, ' - ', r.role_desc)) AS group_roles
            FROM sys_user_role su
            LEFT JOIN ref_role r ON r.role_id = su.role_id
            LEFT JOIN sys_group g ON g.group_id = su.group_id
            GROUP BY su.user_id
        ) user_role ON user_role.user_id = sys_user.user_id
        LEFT JOIN
        (
            SELECT 
                    user_id, GROUP_CONCAT(DISTINCT(role_id)) AS roles
            FROM sys_user_role
            GROUP BY user_id
        ) role_list ON role_list.user_id = sys_user.user_id";

    function __construct ($userId=0, $isLogged=false) {
        $this->userId = $userId;
        $this->isLogged = $isLogged;
    }

    /**
     * @param int $userId
     * @throws Exception
     */
    public function set (int $userId): void {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            parent::checkEmptyInteger($userId, 'userId');
            $this->sysUser = $this->get($userId);
            $this->userIds = $userId;
            $this->userFullNames = $this->sysUser['userFullName'];
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @return array
     * @throws Exception
     */
    public function getRef (): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            return DbMysql::selectSqlAll(/** @lang text */
                "SELECT user_id, user_full_name, user_short_name, status_id", array(), 1);
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param int $userId
     * @return array
     * @throws Exception
     */
    public function getInfo (int $userId): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            parent::checkEmptyInteger($userId, 'userId');
            return DbMysql::selectSql($this::$sqlInfo, array('sys_user.user_id'=>$userId), 1);
        } catch (Exception $ex) {
            throw new Exception('[' . __CLASS__ . ':' . __FUNCTION__ . '] ' . $ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * @param string $username
     * @param string $password
     * @return array
     * @throws Exception
     */
    public function checkLogin (string $username, string $password): array {
        try {
            parent::logDebug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            parent::checkEmptyString($username, 'username');
            parent::checkEmptyString($password, 'password');
            $user = DbMysql::select('sys_user', array('userName'=>$username));
            if (empty($user)) {
                throw new Exception(Constant::$user['errNotExist'], 31);
            }
            if ($user['userPassword'] !== md5($password)) {
                DbMysql::update('sys_user', array('userFailAttempt'=>$user['userFailAttempt'] + 1), array('userId'=>$user['userId']));
                DbMysql::commit();
                throw new Exception(Constant::$user['errPassword'], 31);
            }
            unset($user['userPassword']);
            unset($user['userPasswordTemp']);
            $this->userId = $user['userId'];
            $user['token'] = parent::createJwt($this->userId, $user['userName']);
            $user['roles'] = DbMysql::selectSqlAll(/** @lang text */
                "SELECT
                    ref_role.role_id AS roleId, 
                    ref_role.role_name AS roleName, 
                    ref_role.role_type AS roleType
                FROM (SELECT DISTINCT(role_id) FROM sys_user_role WHERE user_id = $this->userId GROUP BY role_id) roles
                INNER JOIN ref_role ON roles.role_id = ref_role.role_id AND ref_role.status_id = 1", array(), 0, true);
            $roleList = array();
            foreach ($user['roles'] as $userRoles) {
                $roleList[] = $userRoles['roleId'];
            }
            $roleStr = implode(',', $roleList);
            $menuList = DbMysql::selectSqlAll(/** @lang text */
                "SELECT 
                    sys_nav.nav_id,
                    sys_nav.nav_name,
                    sys_nav.nav_icon,
                    sys_nav.nav_page,
                    sys_nav_second.nav_second_id,
                    sys_nav_second.nav_second_name,
                    sys_nav_second.nav_second_page
                FROM
                    (SELECT
                        nav_id, nav_second_id, MIN(nav_role_turn) AS turn
                    FROM sys_nav_role
                    WHERE role_id IN ($roleStr)
                    GROUP BY nav_id, nav_second_id) AS nav_role
                LEFT JOIN sys_nav ON sys_nav.nav_id = nav_role.nav_id
                LEFT JOIN sys_nav_second ON sys_nav_second.nav_second_id = nav_role.nav_second_id
                WHERE sys_nav.status_id = 1 AND (ISNULL(sys_nav_second.nav_second_id) OR sys_nav_second.status_id = 1)
                ORDER BY nav_role.turn", array(), 0, true);
            $menuReturn = [];
            $navIndex = 0;
            foreach ($menuList as $menu) {
                if (empty($menu['navSecondId'])) {
                    $menuReturn[] = array('navId'=>$menu['navId'], 'navName'=>$menu['navName'], 'navIcon'=>$menu['navIcon'], 'navPage'=>$menu['navPage'], 'navSecond'=>array());
                    $navIndex++;
                } else {
                    $menuReturn[$navIndex - 1]['navSecond'][] = array('navSecondId'=>$menu['navSecondId'], 'navSecondName'=>$menu['navSecondName'], 'navSecondPage'=>$menu['navSecondPage']);
                }
            }
            $user['menu'] = $menuReturn;
            DbMysql::update('sys_user', array('userTimeLogin'=>'NOW()', 'userToken'=>$user['token'], 'userFailAttempt'=>'0'), array('userId'=>$this->userId));
            return $user;
        } catch (Exception $ex) {
            throw new Exception('['.__CLASS__.':'.__FUNCTION__.'] '.$ex->getMessage(), $ex->getCode());
        }
    }
}