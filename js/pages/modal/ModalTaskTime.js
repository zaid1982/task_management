function ModalTaskTime () {

    const className = 'ModalTaskTime';
    let self = this;
    let classFrom;
    let formValidate;
    let taskId;
    let timeEstimate;

    this.init = function () {
        try {
            $('#divMttEdit').hide();

            $('#btnMttCloseEdit').on('click', function () {
                $('#divMttEdit').hide();
            });
        } catch (e) { throw new Error(); }
    }

    this.open = function (_taskId, _timeEstimate) {
        try {
            mzEmptyParams([_taskId]);
            if (_timeEstimate === null) {
                throw Error('Please set Time Estimate for this task first!');
            }
            taskId = _taskId;
            timeEstimate = _timeEstimate;
            $('#pMttTimeEstimate').html(mzSpaceString(timeEstimate));
            const timeSpent = mzAjax('taskTime/totalSpent/'+taskId, 'GET');
            const selectorLabel = $('#pMttTimeSpent');
            selectorLabel.removeClass('text-success text-danger');
            selectorLabel.html(mzSpaceString(timeSpent['totalSpent']));
            selectorLabel.addClass(timeSpent['class']);
            $('#modalTaskTime').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
        } catch (e) { console.log(e.message); toastr['error'](e.message !== '' ? e.message : _ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); }
    };

    this.getClassName = function () {
        return className;
    };

    this.setClassFrom = function (_classFrom) {
        classFrom = _classFrom;
    };
}