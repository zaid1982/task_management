function ModalTaskEdit () {

    const className = 'ModalTaskEdit';
    let self = this;
    let classFrom;
    let formValidate;
    let refStatus;
    let refUser;
    let refSpace;
    let refFolder;
    const todayDate = moment().format('YYYY-MM-DD');

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
            name: 'Start Time',
            validator: {
                notEmpty: false,
                timeDateLower: {
                    id: 'txtMteEndTime',
                    label: 'End Time',
                    dateFromId: 'txtMteStartDate',
                    dateToId: 'txtMteEndDate'
                }
            }
        },
        {
            field_id: 'txtMteEndDate',
            type: 'date',
            name: 'End Date',
            validator: {
                notEmpty: false
            }
        },
        {
            field_id: 'txtMteEndTime',
            type: 'text',
            name: 'End Time',
            validator: {
                notEmpty: false,
                timeDateHigher: {
                    id: 'txtMteStartTime',
                    label: 'Start Time',
                    dateFromId: 'txtMteStartDate',
                    dateToId: 'txtMteEndDate'
                }
            }
        },
        {
            field_id: 'txtMteTimeEstimate',
            type: 'text',
            name: 'Time Estimate',
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
        mzOption('optMteMainTask', refStatus, 'statusName', {}, true);
        mzOption('optMteStatus', refStatus, 'statusName', {id: '(3,4,5,7)'}, true);
        self.setOptionAssignee();
        mzDateFromTo('txtMteStartDate', 'txtMteEndDate');
        formValidate = new MzValidate();

        $('#optMteSpace').on('change', function () {
            const spaceId = parseInt($(this).val());
            try {
                $('#optMteFolder_').show();
                mzOptionStop('optMteFolder', refFolder, 'folderName', {spaceId: spaceId, statusId: 1}, true);
                $('#optMteFolderErr').html('');
            } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); }
        });

        $("input[name='radMteIsMain']:radio").on('change', function () {
            const isMain = $(this).val();
            try {
                if (isMain === 'Main') {
                    $('#optMteMainTask_').show();
                    formValidate.enableField('optMteMainTask');
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
            mzDateFromToReset('txtMteStartDate', 'txtMteEndDate');
            mzSetMinDate('txtMteStartDate', true);
            mzSetMinDate('txtMteEndDate', true);
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
            document.getElementById('optMteAssignee').options[0] = new Option('Choose your option', "", true, true);
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