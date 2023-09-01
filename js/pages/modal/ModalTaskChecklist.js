function ModalTaskChecklist () {

    const className = 'ModalTaskChecklist';
    let self = this;
    let classFrom;
    let formValidate;
    let taskChecklistId;
    let taskId;
    let dtDisplay;

    this.init = function () {

    };

    this.open = function (_taskId) {
        try {
            mzEmptyParams([_taskId]);
            taskId = _taskId;
            $('#modalTaskChecklist').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
        } catch (e) { toastr['error'](e.message !== '' ? e.message : _ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); }
    };

    this.getClassName = function () {
        return className;
    };

    this.setClassFrom = function (_classFrom) {
        classFrom = _classFrom;
    };

    this.setDtDisplay = function (_dtDisplay) {
        dtDisplay = _dtDisplay;
    };
}