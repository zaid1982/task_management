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
    const todayDate = moment().format('YYYY-MM-DD');
    const yesterdayDate = moment().subtract(1, 'day').format('YYYY-MM-DD');

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
                notEmpty: true
            }
        },
        {
            field_id: 'optMteTimeEstimate',
            type: 'select',
            name: 'Time Estimate',
            validator: {
                notEmpty: false
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
            field_id: 'optMteStartTime',
            type: 'select',
            name: 'Start Time',
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
        self.setOptionTimeEstimate();
        self.setOptionStartTime();
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
                    formValidate.enableField('optMteMainTask');
                    const folderId = parseInt($('#optMteFolder').val());
                    if (!isNaN(folderId)) {
                        mzOptionStop('optMteMainTask', refMainTask, 'taskName', {folderId: folderId}, true);
                    } else {
                        mzOptionStopClear('optMteMainTask', true);
                    }
                } else {
                    mzOptionStopClear('optMteMainTask', true);
                    formValidate.disableField('optMteMainTask');
                    $('#optMteMainTask_').hide();
                }
            } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); }
        });

        $('#btnMteSave').on('click', function () {
            if (!formValidate.validateNow()) {
                toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
            } else {
                ShowLoader(); setTimeout(function () { try {
                    alert(0);
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
            mzSetMinDate('txtMteStartDate', yesterdayDate);
            $('#optMteFolder_').hide();
            $('#optMteMainTask_').hide();
            $('#optMteStatus_').hide();
            mzSetValue('optMteAssignee', mzGetUserId(), 'select');
            mzSetValue('radMtePriority', 'Normal', 'radio2');
            mzSetValue('radMteIsMain', 'Normal', 'radio2');
            mzSetValue('txtMteDueDate', todayDate, 'date');
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

    this.setOptionTimeEstimate = function () {
        try {
            document.getElementById('optMteTimeEstimate').options[0] = new Option('Choose option', "", true, true);
            let selector = $('#optMteTimeEstimate');
            selector.append('<option value="00:10">10 minutes</option>');
            selector.append('<option value="00:15">15 minutes</option>');
            selector.append('<option value="00:20">20 minutes</option>');
            selector.append('<option value="00:30">30 minutes</option>');
            selector.append('<option value="00:40">40 minutes</option>');
            selector.append('<option value="00:45">45 minutes</option>');
            selector.append('<option value="01:00">1 hour</option>');
            selector.append('<option value="01:15">1 hour 15 min</option>');
            selector.append('<option value="01:30">1 hour 30 min</option>');
            selector.append('<option value="02:00">2 hours</option>');
            selector.append('<option value="02:30">2 hours 30 min</option>');
            selector.append('<option value="03:00">3 hours</option>');
            selector.append('<option value="04:00">4 hours</option>');
            selector.append('<option value="05:00">5 hours</option>');
            selector.append('<option value="06:00">6 hours</option>');
            selector.append('<option value="07:00">7 hours</option>');
            selector.append('<option value="08:00">8 hours</option>');
            selector.append('<option value="09:00">9 hours</option>');
            selector.append('<option value="10:00">10 hours</option>');
            selector.append('<option value="11:00">11 hours</option>');
            selector.append('<option value="12:00">12 hours</option>');
        } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); }
    }

    this.setOptionStartTime = function () {
        try {
            document.getElementById('optMteStartTime').options[0] = new Option('Choose option', "", true, true);
            let selector = $('#optMteStartTime');
            for (let i = 0; i < 24; i++) {
                const hour = i < 10 ? '0' + i : i.toString();
                selector.append('<option value="'+hour+':00">'+hour+':00</option>');
                selector.append('<option value="'+hour+':15">'+hour+':15</option>');
                selector.append('<option value="'+hour+':30">'+hour+':30</option>');
                selector.append('<option value="'+hour+':45">'+hour+':45</option>');
            }
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