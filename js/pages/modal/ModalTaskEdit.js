function ModalTaskEdit () {

    const className = 'ModalTaskEdit';
    let self = this;
    let classFrom;
    let formValidate;
    let refStatus;
    let refUser;
    let refSpace;
    let refFolder;
    let refMainTask = [];
    let submitType = '';
    const todayDate = moment().format('YYYY-MM-DD');
    const yesterdayDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
    const refTimeEstimate = ['10 minutes', '15 minutes', '20 minutes', '30 minutes', '40 minutes', '50 minutes',
        '1 hour', '1 hour 15 minutes', '1 hour 30 minutes', '1 hour 45 minutes', '2 hours', '2 hours 30 minutes', '3 hours', '4 hours', '5 hours', '6 hours'];

    let refTime = [];
    for (let i = 0; i < 24; i++) {
        const hour = i < 10 ? '0' + i : i.toString();
        refTime.push(hour+':00');
        refTime.push(hour+':15');
        refTime.push(hour+':30');
        refTime.push(hour+':45');
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
                notEmpty: false
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
        mzOption('optMteSpace', refSpace, 'spaceName', {statusId: 1}, true);
        mzOption('optMteStatus', refStatus, 'statusName', {id: '(3,4,5,7)'}, true);
        self.setOptionAssignee();
        $('#txtMteTimeEstimate').mdbAutocomplete({ data: refTimeEstimate });
        $('#txtMteStartTime').mdbAutocomplete({ data: refTime });
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
            } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); }
        });

        $('#optMteFolder').on('change', function () {
            const folderId = parseInt($(this).val());
            try {
                if ($("input[name='radMteIsMain']:checked").val() === 'Sub') {
                    mzOptionStop('optMteMainTask', refMainTask, 'taskName', {folderId: folderId}, true);
                    $('#optMteMainTaskErr').html('');
                }
            } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); }
        });

        $("input[name='radMteIsMain']:radio").on('change', function () {
            const isMain = $(this).val();
            try {
                if (isMain === 'Sub') {
                    $('#optMteMainTask_').show();
                    $('#txtMteTimeEstimate_, #txtMteStartDate_, #txtMteStartTime_').show();
                    formValidate.enableField('optMteMainTask');
                    const folderId = parseInt($('#optMteFolder').val());
                    if (!isNaN(folderId)) {
                        mzOptionStop('optMteMainTask', refMainTask, 'taskName', {folderId: folderId}, true);
                    } else {
                        mzOptionStopClear('optMteMainTask', true);
                    }
                } else if (isMain === 'Main') {
                    $('#txtMteTimeEstimate_, #txtMteStartDate_, #txtMteStartTime_').hide();
                } else {
                    mzOptionStopClear('optMteMainTask', true);
                    formValidate.disableField('optMteMainTask');
                    $('#txtMteTimeEstimate_, #txtMteStartDate_, #txtMteStartTime_').show();
                    $('#optMteMainTask_').hide();
                }
            } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); }
        });

        $('#btnMteSave').on('click', function () {
            if (!formValidate.validateNow()) {
                toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
            } else {
                ShowLoader(); setTimeout(function () { try {
                    const dueDate = mzConvertDate($('#txtMteDueDate').val());
                    const isMain = $("input[name='radMteIsMain']:checked").val();
                    let data = {
                        taskName: $('#txtMteTaskName').val(),
                        folderId: mzNullInt($('#optMteFolder').val()),
                        taskAssignee: mzNullInt($('#optMteAssignee').val()),
                        taskTags: mzChkVal('chkMteTags'),
                        taskPriority: $("input[name='radMtePriority']:checked").val(),
                        isMain: isMain,
                        taskMainId: mzNullInt($('#optMteMainTask').val()),
                        taskDateDue: dueDate,
                        taskAmount: mzNullString($('#txtMteAmount').val()),
                        timeEstimate: mzNullString($('#txtMteTimeEstimate').val()),
                        startDate: mzConvertDate($('#txtMteStartDate').val()),
                        startTime: mzNullString($('#txtMteStartTime').val()),
                        taskDescription: mzNullString($('#txaMteRemark').val())
                    };
                    if (submitType === 'add') {
                        console.log(data);
                        mzAjax('task', 'POST', data);
                        if (dueDate === null) {
                            classFrom.genTableUnscheduled();
                        } else if (dueDate === todayDate) {
                            classFrom.genTableToday();
                        } else if (dueDate === yesterdayDate) {
                            classFrom.genTableOverdue();
                        } else {
                            classFrom.genTableFuture();
                        }
                        if (isMain === 'Main') {
                            refMainTask = mzAjax('task/ref/mainTask', 'GET');
                        }
                    }
                    $('#modalTaskEdit').modal('hide');
                } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); } HideLoader(); }, 200);
            }
        });
    };

    this.add = function () {
        ShowLoader(); setTimeout(function () { try {
            formValidate.clearValidation();
            formValidate.registerFields(vData);
            formValidate.disableField('optMteMainTask');
            formValidate.disableField('optMteStatus');
            mzSetMinDate('txtMteDueDate', yesterdayDate);
            mzSetMinDate('txtMteStartDate', yesterdayDate);
            $('#optMteFolder_').hide();
            $('#optMteMainTask_').hide();
            $('#optMteStatus_').hide();
            mzSetValue('optMteAssignee', mzGetUserId(), 'select');
            mzSetValue('radMtePriority', 'Normal', 'radio2');
            mzSetValue('radMteIsMain', 'Normal', 'radio2');
            $('#txtMteTimeEstimate_, #txtMteStartDate_, #txtMteStartTime_').show();
            submitType = 'add';
            $('#modalTaskEdit').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
        } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); } HideLoader(); }, 200);
    };

    this.setOptionAssignee = function () {
        try {
            document.getElementById('optMteAssignee').options[0] = new Option('Choose option', "", true, true);
            document.getElementById('optMteAssignee').options[0].disabled = true;
            $.each(refUser, function (n, u) {
                $('#optMteAssignee').append('<option value="'+n+'" data-icon="api/'+u['profileImage']+'" class="rounded-circle">'+u['userFullName']+'</option>');
            });
        } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); }
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