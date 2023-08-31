function ModalTaskTime () {

    const className = 'ModalTaskTime';
    let self = this;
    let classFrom;
    let formValidate;
    let taskId;

    this.init = function () {
        try {

        } catch (e) { throw new Error(); }
    }

    this.open = function (_taskId) {
        try {
            mzEmptyParams([_taskId]);
            taskId = _taskId;
            $('#modalTaskTime').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
        } catch (e) { toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); }
    };

    this.getClassName = function () {
        return className;
    };

    this.setClassFrom = function (_classFrom) {
        classFrom = _classFrom;
    };
}