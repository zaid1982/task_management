function ModalTaskTime () {

    const className = 'ModalTaskTime';
    let self = this;
    let classFrom;
    let formValidate;
    let formValidateEdit;
    let taskId;
    let timeEstimate;
    let dtMtt;
    let dtDisplay;
    let isEdit = false;

    this.init = function () {
        try {
            $('#divMttEdit, #btnMttStart, #btnMttStop').hide();

            $('#btnMttCloseEdit').on('click', function () {
                $('#divMttEdit').hide();
            });

            $('#btnMttClose').on('click', function () {
                try {
                    if (isEdit) {
                        classFrom.refreshEdit(null, null, false);
                    }
                } catch (e) { throw new Error(); }
            });

            const vData = [
                {
                    field_id: 'txtMttDescription',
                    type: 'text',
                    name: 'Description',
                    validator: {
                        notEmpty: false,
                        maxLength: 255
                    }
                }
            ];

            formValidate = new MzValidate();
            formValidate.registerFields(vData);

            const vDataEdit = [
                {
                    field_id: 'txtMttDescriptionEdit',
                    type: 'text',
                    name: 'Description',
                    validator: {
                        notEmpty: true,
                        maxLength: 255
                    }
                },
                {
                    field_id: 'txtMttStartDate',
                    type: 'date',
                    name: 'Start Date',
                    validator: {
                        notEmpty: true
                    }
                },
                {
                    field_id: 'txtMttStartTime',
                    type: 'text',
                    name: 'Start Time',
                    validator: {
                        notEmpty: true
                    }
                },
                {
                    field_id: 'txtMttEndDate',
                    type: 'date',
                    name: 'End Date',
                    validator: {
                        notEmpty: true
                    }
                },
                {
                    field_id: 'txtMttEndTime',
                    type: 'text',
                    name: 'End Time',
                    validator: {
                        notEmpty: true
                    }
                }
            ];

            formValidateEdit = new MzValidate();
            formValidateEdit.registerFields(vDataEdit);

            dtMtt = $('#dtMtt').DataTable({
                bLengthChange: false,
                bFilter: false,
                ordering: false,
                bPaginate: false,
                autoWidth: false,
                bInfo: false,
                columnDefs: [
                    { className: 'text-center', targets: [0, 2, 3, 4, 5] }
                ],
                fnRowCallback : function(nRow, aData, iDisplayIndex){
                    const info = $(this).DataTable().page.info();
                    $('td', nRow).eq(0).html(info.start + (iDisplayIndex + 1));
                },
                drawCallback: function () {
                    $('.lnkMttEdit').off('click').on('click', function () {
                        const linkId = $(this).attr('id');
                        const linkIndex = linkId.indexOf('_');
                        if (linkIndex > 0) {
                            const rowId = linkId.substring(linkIndex+1);
                            const currentRow = dtMtt.row(parseInt(rowId)).data();
                            console.log(currentRow);
                            formValidateEdit.clearValidation();
                            const taskTimeStart = currentRow['taskTimeStart'];
                            const startDate = taskTimeStart.substring(0, 10);
                            const startTime = taskTimeStart.substring(11);
                            const taskTimeEnd = currentRow['taskTimeEnd'];
                            const endDate = taskTimeEnd !== null ? taskTimeStart.substring(0, 10) : null;
                            const endTime = taskTimeEnd !== null ? taskTimeEnd.substring(11) : null;
                            console.log(endDate);
                            console.log(endTime);
                            mzSetValue('txtMttDescriptionEdit', currentRow['taskTimeDesc'], 'text');
                            mzSetValue('txtMttStartDate', startDate, 'date');
                            mzSetValue('txtMttStartTime', startTime, 'text');
                            mzSetValue('txtMttEndDate', endDate, 'date');
                            mzSetValue('txtMttEndTime', endTime, 'text');
                            if (currentRow['taskTimeDesc'] !== null) {
                                formValidateEdit.enableField('txtMttDescriptionEdit');
                            } else {
                                formValidateEdit.disableField('txtMttDescriptionEdit');
                            }
                            if (endDate !== null) {
                                formValidateEdit.enableField('txtMttEndDate');
                                formValidateEdit.enableField('txtMttEndTime');
                            } else {
                                formValidateEdit.disableField('txtMttEndDate');
                                formValidateEdit.disableField('txtMttEndTime');
                            }
                            $('#divMttEdit').show();
                        }
                    });
                },
                aoColumns: [
                    { mData: null},
                    { mData: 'taskTimeDesc'},
                    { mData: 'taskTimeStart'},
                    { mData: 'taskTimeEnd'},
                    { mData: 'taskTimeAmount'},
                    { mData: null, mRender: function (data, type, row, meta) { return dtDisplay.getAction(1, 'lnkMtt', meta.row); }}
                ]
            });

            $('#btnMttStart').on('click', function () {
                if (!formValidate.validateNow()) {
                    toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
                } else {
                    ShowLoader(); setTimeout(function () { try {

                        isEdit = true;
                        $('#btnMttStart').hide();
                        $('#btnMttStop').show();
                        self.genTable();
                        $('#divMttEdit').hide();
                    } catch (e) { toastr['error'](e.message !== '' ? e.message : _ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); } HideLoader(); }, 200);
                }
            });

            $('#btnMttStop').on('click', function () {
                if (!formValidate.validateNow()) {
                    toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
                } else {
                    ShowLoader(); setTimeout(function () { try {

                        isEdit = true;
                        formValidate.clearValidation();
                        $('#btnMttStop').hide();
                        $('#btnMttStart').show();
                        self.genTotalSpent();
                        self.genTable();
                        $('#divMttEdit').hide();
                    } catch (e) { toastr['error'](e.message !== '' ? e.message : _ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); } HideLoader(); }, 200);
                }
            });

            $('#btnMttSave').on('click', function () {
                if (!formValidateEdit.validateNow()) {
                    toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
                } else {
                    ShowLoader(); setTimeout(function () { try {

                        isEdit = true;
                        self.genTotalSpent();
                        self.genTable();
                        $('#divMttEdit').hide();
                    } catch (e) { toastr['error'](e.message !== '' ? e.message : _ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); } HideLoader(); }, 200);
                }
            });
        } catch (e) { throw new Error(); }
    }

    this.open = function (_taskId, _timeEstimate, _dateStart) {
        try {
            mzEmptyParams([_taskId]);
            if (_timeEstimate === null) {
                throw Error('Please set Time Estimate for this task first!');
            }
            if (_dateStart === null) {
                throw Error('Please plan your start date first!');
            }
            taskId = _taskId;
            timeEstimate = _timeEstimate;
            isEdit = false;
            $('#pMttTimeEstimate').html(mzSpaceString(timeEstimate));
            formValidate.clearValidation();
            $('#divMttEdit, #btnMttStart, #btnMttStop').hide();
            const taskTime = mzAjax('taskTime/current/'+taskId, 'GET');
            if (taskTime.length === 0) {
                $('#btnMttStart').show();
            } else {
                $('#btnMttStop').show();
                mzSetValue('txtMttDescription', taskTime['taskTimeDesc'], 'text');
            }
            self.genTotalSpent();
            self.genTable();
            $('#modalTaskTime').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
        } catch (e) { console.log(e.message); toastr['error'](e.message !== '' ? e.message : _ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); }
    };

    this.genTable = function () {
        const dataDb = mzAjax('taskTime/list/'+taskId, 'GET');
        dtMtt.clear().rows.add(dataDb).draw();
    };

    this.genTotalSpent = function () {
        const timeSpent = mzAjax('taskTime/totalSpent/'+taskId, 'GET');
        const selectorLabel = $('#pMttTimeSpent');
        selectorLabel.removeClass('text-success text-danger');
        selectorLabel.html(mzSpaceString(timeSpent['totalSpent']));
        selectorLabel.addClass(timeSpent['class']);
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