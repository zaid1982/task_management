function ModalTaskEdit () {

    const className = 'ModalTaskEdit';
    let self = this;
    let classFrom;
    let formValidate;
    let taskId;
    let task = {};
    let refStatus;
    let refUser;
    let refSpace;
    let refFolder;
    let refMainTask = [];
    let submitType = '';
    const yesterdayDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
    const refTimeEstimate = ['10 minutes', '15 minutes', '20 minutes', '30 minutes', '40 minutes', '50 minutes',
        '1 hour', '1 hour 15 minutes', '1 hour 30 minutes', '1 hour 45 minutes', '2 hours', '2 hours 30 minutes', '3 hours', '4 hours', '5 hours', '6 hours'];

    let refTime = [];
    for (let i = 0; i < 24; i++) {
        const hour = i < 10 ? '0' + i : i.toString();
        refTime.push(hour+':00');
        refTime.push(hour+':05');
        refTime.push(hour+':10');
        refTime.push(hour+':15');
        refTime.push(hour+':20');
        refTime.push(hour+':25');
        refTime.push(hour+':30');
        refTime.push(hour+':35');
        refTime.push(hour+':40');
        refTime.push(hour+':45');
        refTime.push(hour+':50');
        refTime.push(hour+':55');
    }

    let vData = [
        {
            field_id: 'txtMteTaskName',
            type: 'text',
            name: 'Task Name',
            validator: {
                notEmpty: true,
                maxLength: 255
            }
        },
        {
            field_id: 'optMteSpace',
            type: 'select',
            name: 'Space',
            validator: {
                notEmpty: true
            }
        },
        {
            field_id: 'optMteFolder',
            type: 'select',
            name: 'Folder',
            validator: {
                notEmpty: true
            }
        },
        {
            field_id: 'optMteAssignee',
            type: 'select',
            name: 'Assignee',
            validator: {
                notEmpty: true
            }
        },
        {
            field_id: 'chkMteTags[]',
            type: 'check',
            name: 'Tags',
            validator: {
                notEmptyCheck: true
            }
        },
        {
            field_id: 'radMtePriority',
            type: 'radio',
            name: 'Priority',
            validator: {
                notEmptyRadio: true
            }
        },
        {
            field_id: 'radMteIsMain',
            type: 'radio',
            name: 'Task Type',
            validator: {
                notEmptyRadio: true
            }
        },
        {
            field_id: 'optMteMainTask',
            type: 'select',
            name: 'Main Task',
            validator: {
                notEmpty: true
            }
        },
        {
            field_id: 'txtMteDueDate',
            type: 'date',
            name: 'Due Date',
            validator: {
                notEmpty: false
            }
        },
        {
            field_id: 'txtMteAmount',
            type: 'text',
            name: 'Amount',
            validator: {
                notEmpty: false,
                numeric: true,
                min: 0
            }
        },
        {
            field_id: 'txtMteTimeEstimate',
            type: 'text',
            focus: true,
            name: 'Time Estimate',
            validator: {
                notEmpty: false,
                inList: refTimeEstimate
            }
        },
        {
            field_id: 'txtMteStartDate',
            type: 'date',
            name: 'Start Date',
            validator: {
                notEmpty: false
            }
        },
        {
            field_id: 'txtMteStartTime',
            type: 'text',
            focus: true,
            name: 'Start Time',
            validator: {
                notEmpty: false,
                inList: refTime
            }
        },
        {
            field_id: 'txaMteRemark',
            type: 'textarea',
            name: 'Remark',
            validator: {
                notEmpty: false,
                maxLength: 5000
            }
        },
        {
            field_id: 'optMteStatus',
            type: 'select',
            name: 'Status',
            validator: {
                notEmpty: false
            }
        }
    ];


    this.init = function () {
        try {
            mzOption('optMteSpace', refSpace, 'spaceName', {statusId: 1}, true);
            mzOption('optMteStatus', refStatus, 'statusName', {id: '(3,4,5,7)'}, true);
            $('#txtMteStartTime').mdbAutocomplete({ data: refTime });
            self.setOptionAssignee();
            refMainTask = mzAjax('task/ref/mainTask', 'GET');
            formValidate = new MzValidate();

            $('#optMteSpace').on('change', function () {
                const spaceId = parseInt($(this).val());
                try {
                    $('#optMteFolder_').show();
                    mzOptionStop('optMteFolder', refFolder, 'folderName', {spaceId: spaceId, statusId: 1}, true);
                    $('#optMteFolderErr').html('');
                    if ($("input[name='radMteIsMain']:checked").val() === 'Sub') {
                        mzOptionStopClear('optMteMainTask', true);
                        $('#optMteMainTaskErr').html('');
                    }
                } catch (e) { toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); }
            });

            $('#optMteFolder').on('change', function () {
                const folderId = parseInt($(this).val());
                try {
                    if ($("input[name='radMteIsMain']:checked").val() === 'Sub') {
                        mzOptionStop('optMteMainTask', refMainTask, 'taskName', {folderId: folderId}, true);
                        $('#optMteMainTaskErr').html('');
                    }
                } catch (e) { toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); }
            });

            $("input[name='radMteIsMain']:radio").on('change', function () {
                self.setTaskTypeHide($(this).val());
            });

            $('#btnMteSave').on('click', function () {
                if (!formValidate.validateNow()) {
                    toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
                } else if (submitType === 'add' || submitType === 'edit') {
                    ShowLoader(); setTimeout(function () { try {
                        const dueDate = mzConvertDate($('#txtMteDueDate').val());
                        let data = {
                            taskName: $('#txtMteTaskName').val(),
                            taskTags: mzChkVal('chkMteTags'),
                            taskPriority: $("input[name='radMtePriority']:checked").val(),
                            taskDateDue: dueDate,
                            taskAmount: mzNullString($('#txtMteAmount').val()),
                            timeEstimate: mzNullString($('#txtMteTimeEstimate').val()),
                            startDate: mzConvertDate($('#txtMteStartDate').val()),
                            startTime: mzNullString($('#txtMteStartTime').val()),
                            taskDescription: mzNullString($('#txaMteRemark').val())
                        };
                        if (submitType === 'add') {
                            const isMain = $("input[name='radMteIsMain']:checked").val();
                            data['folderId'] = mzNullInt($('#optMteFolder').val());
                            data['taskAssignee'] = mzNullInt($('#optMteAssignee').val());
                            data['isMain'] = isMain;
                            data['taskMainId'] = mzNullInt($('#optMteMainTask').val());
                            mzAjax('task', 'POST', data);
                            classFrom.refreshAdd(dueDate);
                            if (isMain === 'Main') {
                                refMainTask = mzAjax('task/ref/mainTask', 'GET');
                            }
                        } else if (submitType === 'edit') {
                            const status = mzNullInt($('#optMteStatus').val());
                            data['statusId'] = status;
                            console.log(data);
                            mzAjax('task/'+taskId, 'PUT', data);
                            classFrom.refreshEdit(task['taskDateDue'], dueDate, status === 4 || status === 7);
                        }
                        $('#modalTaskEdit').modal('hide');
                    } catch (e) { toastr['error'](!e.message ? e.message : _ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); } HideLoader(); }, 200);
                } else {
                    toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
                    $('#modalTaskEdit').modal('hide');
                }
            });
        } catch (e) { throw new Error(); }
    };

    this.add = function () {
        try {
            formValidate.clearValidation();
            formValidate.registerFields(vData);
            formValidate.disableField('optMteMainTask');
            formValidate.disableField('optMteStatus');
            $('#optMteFolder_, #optMteMainTask_, #optMteStatus_').hide();
            $('#txtMteTimeEstimate_, #txtMteStartDate_, #txtMteStartTime_').show();
            mzDisableSelect('optMteSpace', false);
            mzDisableSelect('optMteFolder', false);
            mzDisableSelect('optMteMainTask', false);
            mzDisableSelect('optMteAssignee', false);
            self.enableRadIsMain();
            mzSetMinDate('txtMteDueDate', yesterdayDate);
            mzSetMinDate('txtMteStartDate', yesterdayDate);
            mzSetValue('optMteAssignee', mzGetUserId(), 'select');
            mzSetValue('radMtePriority', 'Normal', 'radio2');
            mzSetValue('radMteIsMain', 'Normal', 'radio2');
            $('#txtMteTimeEstimate').mdbAutocomplete({ data: refTimeEstimate });
            submitType = 'add';
            $('#lblMteTitle').html('<i class="fa-solid fa-calendar-plus mr-2"></i>Add New Task');
            $('#modalTaskEdit').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
        } catch (e) { toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); }
    };

    this.edit = function (_taskId) {
        try {
            console.log(classFrom.getCurrentOpen());
            mzEmptyParams([_taskId]);
            taskId = _taskId;
            formValidate.clearValidation();
            formValidate.registerFields(vData);
            formValidate.enableField('optMteStatus');
            $('#optMteFolder_, #optMteStatus_, #txtMteTimeEstimate_, #txtMteStartDate_, #txtMteStartTime_').show();
            $('#optMteMainTask_').hide();
            mzDisableSelect('optMteSpace', true);
            mzDisableSelect('optMteFolder', true);
            mzDisableSelect('optMteAssignee', true);
            mzDisableSelect('optMteMainTask', true);
            self.disableRadIsMain();
            mzSetMinDate('txtMteDueDate', yesterdayDate);
            mzSetMinDate('txtMteStartDate', yesterdayDate);
            task = mzAjax('task/'+taskId, 'GET');
            const folderId = task['folderId'];
            const spaceId = refFolder[folderId]['spaceId'];
            const isMain = task['isMain'];
            mzOptionStop('optMteFolder', refFolder, 'folderName', {spaceId: spaceId, statusId: 1}, true);
            mzSetValue('txtMteTaskName', task['taskName'], 'text');
            mzSetValue('optMteSpace', spaceId, 'select');
            mzSetValue('optMteFolder', folderId, 'select');
            mzSetValue('optMteAssignee', task['taskAssignee'], 'select');
            mzSetValue('chkMteTags', task['tags'], 'check');
            mzSetValue('radMtePriority', task['taskPriority'], 'radio2');
            mzSetValue('radMteIsMain', isMain, 'radio2');
            mzSetValue('txtMteDueDate', task['taskDateDue'], 'date');
            mzSetValue('txtMteAmount', task['taskAmount'], 'text');
            mzSetValue('optMteStatus', task['statusId'], 'select');
            mzSetValue('txaMteRemark', task['taskDescription'], 'textarea');
            self.setTaskTypeHide(isMain, task['taskMainId']);
            let refTimeEstimateClone = refTimeEstimate.map((x) => x);
            if (isMain !== 'Main' && task['timeEstimateInList'] === false) {
                refTimeEstimateClone.push();
            }
            $('#txtMteTimeEstimate').mdbAutocomplete({ data: refTimeEstimate });
            if (isMain !== 'Main') {
                mzSetValue('txtMteTimeEstimate', task['timeEstimate'], 'text');
                mzSetValue('txtMteStartDate', task['startDate'], 'date');
                mzSetValue('txtMteStartTime', task['startTime'], 'text');
            }
            submitType = 'edit';
            $('#lblMteTitle').html('<i class="fa-solid fa-pen-to-square mr-2"></i>Edit Task');
            $('#modalTaskEdit').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
        } catch (e) { toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); }
    };

    this.setTaskTypeHide = function (isMain, taskMainId) {
        if (isMain === 'Sub') {
            $('#optMteMainTask_').show();
            $('#txtMteTimeEstimate_, #txtMteStartDate_, #txtMteStartTime_').show();
            formValidate.enableField('optMteMainTask');
            const folderId = parseInt($('#optMteFolder').val());
            if (!isNaN(folderId)) {
                mzOptionStop('optMteMainTask', refMainTask, 'taskName', {folderId: folderId}, true);
                if (typeof taskMainId !== 'undefined') {
                    mzSetValue('optMteMainTask', taskMainId, 'select');
                    formValidate.disableField('optMteMainTask');
                }
            } else {
                mzOptionStopClear('optMteMainTask', true);
            }
        } else if (isMain === 'Main') {
            formValidate.disableField('optMteMainTask');
            $('#optMteMainTask_').hide();
            $('#txtMteTimeEstimate_, #txtMteStartDate_, #txtMteStartTime_').hide();
        } else {
            formValidate.disableField('optMteMainTask');
            $('#optMteMainTask_').hide();
            $('#txtMteTimeEstimate_, #txtMteStartDate_, #txtMteStartTime_').show();
        }
    }

    this.setOptionAssignee = function () {
        document.getElementById('optMteAssignee').options[0] = new Option('Choose option', "", true, true);
        document.getElementById('optMteAssignee').options[0].disabled = true;
        $.each(refUser, function (n, u) {
            $('#optMteAssignee').append('<option value="'+n+'" data-icon="api/'+u['profileImage']+'" class="rounded-circle">'+u['userFullName']+'</option>');
        });
    }

    this.enableRadIsMain = function () {
        $('#lblMteIsMain1').removeClass('disabled md-disabled');
        $('#lblMteIsMain2').removeClass('disabled md-disabled');
        $('#lblMteIsMain3').removeClass('disabled md-disabled');
    }

    this.disableRadIsMain = function () {
        const selectorLbl1 = $('#lblMteIsMain1');
        const selectorLbl2 = $('#lblMteIsMain2');
        const selectorLbl3 = $('#lblMteIsMain3');
        selectorLbl1.addClass('disabled md-disabled');
        selectorLbl2.addClass('disabled md-disabled');
        selectorLbl3.addClass('disabled md-disabled');
    }

    this.getClassName = function () {
        return className;
    };

    this.setClassFrom = function (_classFrom) {
        classFrom = _classFrom;
    };

    this.setRefStatus = function (_refStatus) {
        refStatus = _refStatus;
    };

    this.setRefUser = function (_refUser) {
        refUser = _refUser;
    };

    this.setRefSpace = function (_refSpace) {
        refSpace = _refSpace;
    };

    this.setRefFolder = function (_refFolder) {
        refFolder = _refFolder;
    };
}