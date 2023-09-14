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
    let refModule;
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
            field_id: 'optMteModule',
            type: 'select',
            name: 'Module',
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
            if (navigator.userAgent.toLowerCase().indexOf('safari')) {
                $('#divMteModalBody').removeClass('modal-body-fade');
            }

            mzOption('optMteSpace', refSpace, 'spaceName', {statusId: 1}, true);
            $('#txtMteStartTime').mdbAutocomplete({ data: refTime });
            self.setOptionAssignee();
            refMainTask = mzAjax('task/ref/mainTask', 'GET');
            formValidate = new MzValidate();

            $('#optMteSpace').on('change', function () {
                const spaceId = parseInt($(this).val());
                try {
                    $('#optMteFolder_, #optMteModule_').show();
                    mzOptionStop('optMteFolder', refFolder, 'folderName', {spaceId: spaceId, statusId: 1}, true);
                    mzOptionStop('optMteModule', refModule, 'moduleName', {spaceId: spaceId, statusId: 1}, false,null, false);
                    $('#optMteFolderErr, #optMteModuleErr').html('');
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
                        const isMain = $("input[name='radMteIsMain']:checked").val();
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
                            data['folderId'] = mzNullInt($('#optMteFolder').val());
                            data['moduleId'] = mzNullInt($('#optMteModule').val());
                            data['taskAssignee'] = mzNullInt($('#optMteAssignee').val());
                            data['isMain'] = isMain;
                            data['taskMainId'] = mzNullInt($('#optMteMainTask').val());
                            mzAjax('task', 'POST', data);
                            classFrom.refreshAdd(dueDate);
                        } else if (submitType === 'edit') {
                            const status = mzNullInt($('#optMteStatus').val());
                            data['statusId'] = status;
                            mzAjax('task/'+taskId, 'PUT', data);
                            classFrom.refreshEdit(task['taskDateDue'], dueDate, status === 4 || status === 7);
                        }
                        if (isMain === 'Main') {
                            refMainTask = mzAjax('task/ref/mainTask', 'GET');
                        }
                        $('#modalTaskEdit').modal('hide');
                    } catch (e) { toastr['error'](e.message !== '' ? e.message : _ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); } HideLoader(); }, 200);
                } else {
                    toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
                    $('#modalTaskEdit').modal('hide');
                }
            });

            $('#btnMteDone').on('click', function () {
                if (!formValidate.validateNow()) {
                    toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
                } else if (submitType === 'edit') {
                    ShowLoader(); setTimeout(function () { try {
                        const isMain = $("input[name='radMteIsMain']:checked").val();
                        mzAjax('task/done/'+taskId, 'PUT');
                        classFrom.refreshEdit(null, null, true);
                        if (isMain === 'Main') {
                            refMainTask = mzAjax('task/ref/mainTask', 'GET');
                        }
                        $('#modalTaskEdit').modal('hide');
                    } catch (e) { toastr['error'](e.message !== '' ? e.message : _ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); } HideLoader(); }, 200);
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
            $('#optMteFolder_, #optMteModule_, #optMteMainTask_, #optMteStatus_, #btnMteDone').hide();
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
            mzEmptyParams([_taskId]);
            taskId = _taskId;
            formValidate.clearValidation();
            formValidate.registerFields(vData);
            $('#optMteFolder_, #optMteModule_, #optMteStatus_, #txtMteTimeEstimate_, #txtMteStartDate_, #txtMteStartTime_, #btnMteDone').show();
            $('#optMteMainTask_').hide();
            mzDisableSelect('optMteSpace', true);
            mzDisableSelect('optMteFolder', true);
            mzDisableSelect('optMteAssignee', true);
            mzDisableSelect('optMteMainTask', true);
            self.disableRadIsMain();
            mzSetMinDate('txtMteDueDate', false);
            mzSetMinDate('txtMteStartDate', false);
            task = mzAjax('task/'+taskId, 'GET');
            const folderId = task['folderId'];
            const spaceId = refFolder[folderId]['spaceId'];
            const isMain = task['isMain'];
            const status = task['statusId'];
            mzOptionStop('optMteFolder', refFolder, 'folderName', {spaceId: spaceId, statusId: 1}, true);
            mzOptionStop('optMteStatus', refStatus, 'statusName', {id: status===5?'(4,5,7)':'(3,4,5,7)'}, true);
            mzOptionStop('optMteModule', refModule, 'moduleName', {spaceId: spaceId, statusId: 1});
            mzSetValue('txtMteTaskName', task['taskName'], 'text');
            mzSetValue('optMteSpace', spaceId, 'select');
            mzSetValue('optMteFolder', folderId, 'select');
            mzSetValue('optMteAssignee', task['taskAssignee'], 'select');
            mzSetValue('chkMteTags', task['tags'], 'check');
            mzSetValue('radMtePriority', task['taskPriority'], 'radio2');
            mzSetValue('radMteIsMain', isMain, 'radio2');
            mzSetValue('txtMteDueDate', task['taskDateDue'], 'date');
            mzSetValue('txtMteAmount', task['taskAmount'], 'text');
            mzSetValue('optMteStatus', status, 'select');
            mzSetValue('txaMteRemark', task['taskDescription'], 'textarea');
            self.setTaskTypeHide(isMain, task['taskMainId']);
            let refTimeEstimateClone = refTimeEstimate.map((x) => x);
            if (isMain !== 'Main' && task['timeEstimateInList'] === false) {
                refTimeEstimateClone.push(task['timeEstimate']);
                vData[10]['validator']['inList'] = refTimeEstimateClone;
                formValidate.registerFields(vData);
            }
            $('#txtMteTimeEstimate').mdbAutocomplete({ data: refTimeEstimateClone });
            formValidate.enableField('optMteStatus');
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
            formValidate.enableField('optMteMainTask');
            $('#optMteMainTask_').show();
            $('#txtMteTimeEstimate_, #txtMteStartDate_, #txtMteStartTime_').show();
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

    this.setRefModule = function (_refModule) {
        refModule = _refModule;
    };
}