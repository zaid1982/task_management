function ModalTaskChecklist () {

    const className = 'ModalTaskChecklist';
    let self = this;
    let classFrom;
    let formValidate;
    let formValidateEdit;
    let taskChecklistId;
    let taskId;
    let dtMtc;
    let dtDisplay;
    let refStatus;
    let isEdit = false;

    this.init = function () {
        try {
            $('#divMtcEdit').hide();

            $('#btnMtcCloseEdit').on('click', function () {
                $('#divMtcEdit').hide();
            });

            $('#btnMtcClose').on('click', function () {
                try {
                    if (isEdit) {
                        classFrom.refreshEdit(null, null, false);
                    }
                } catch (e) { throw new Error(); }
            });

            const vData = [
                {
                    field_id: 'txtMtcDescription',
                    type: 'text',
                    name: 'Description',
                    validator: {
                        notEmpty: true,
                        maxLength: 255
                    }
                },
                {
                    field_id: 'txtMtcWeightage',
                    type: 'text',
                    name: 'Description',
                    validator: {
                        notEmpty: true,
                        digit: true,
                        min: 1,
                        max: 99
                    }
                }
            ];

            formValidate = new MzValidate();
            formValidate.registerFields(vData);

            const vDataEdit = [
                {
                    field_id: 'txtMtcDescriptionEdit',
                    type: 'text',
                    name: 'Description',
                    validator: {
                        notEmpty: true,
                        maxLength: 255
                    }
                },
                {
                    field_id: 'txtMtcWeightageEdit',
                    type: 'text',
                    name: 'Description',
                    validator: {
                        notEmpty: true,
                        digit: true,
                        min: 1,
                        max: 99
                    }
                }
            ];

            formValidateEdit = new MzValidate();
            formValidateEdit.registerFields(vDataEdit);

            dtMtc = $('#dtMtc').DataTable({
                bLengthChange: false,
                bFilter: false,
                ordering: false,
                bPaginate: false,
                autoWidth: false,
                bInfo: false,
                columnDefs: [
                    { className: 'text-center', targets: [0, 3, 4] },
                    { className: 'text-right', targets: [2] }
                ],
                fnRowCallback : function(nRow, aData, iDisplayIndex){
                    const info = $(this).DataTable().page.info();
                    $('td', nRow).eq(0).html(info.start + (iDisplayIndex + 1));
                },
                drawCallback: function () {
                    $('.lnkMtcEdit').off('click').on('click', function () {
                        const currentRow = mzGetLinkRow($(this), dtMtc);
                        $taskChecklist['taskId'] = currentRow ['taskChecklistId'];
                        formValidateEdit.clearValidation();
                        mzSetValue('txtMtcDescriptionEdit', currentRow['taskChecklistName'], 'text');
                        mzSetValue('txtMtcWeightageEdit', currentRow['taskChecklistWeightage'], 'text');
                        $('#divMtcEdit').show();
                    });
                    $('.lnkMtcDone').off('click').on('click', function () {
                        const currentRow = mzGetLinkRow($(this), dtMtc);
                        ShowLoader(); setTimeout(function () { try {
                            mzAjax('taskChecklist/done/'+currentRow['taskChecklistId'], 'PUT');
                            isEdit = true;
                            self.genTable();
                        } catch (e) { toastr['error'](e.message !== '' ? e.message : _ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); } HideLoader(); }, 200);
                    });
                    $('.lnkMtcOpen').off('click').on('click', function () {
                        const currentRow = mzGetLinkRow($(this), dtMtc);
                        ShowLoader(); setTimeout(function () { try {
                            mzAjax('taskChecklist/open/'+currentRow['taskChecklistId'], 'PUT');
                            isEdit = true;
                            self.genTable();
                        } catch (e) { toastr['error'](e.message !== '' ? e.message : _ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); } HideLoader(); }, 200);
                    });
                    $('.lnkMtcRemove').off('click').on('click', function () {
                        const currentRow = mzGetLinkRow($(this), dtMtc);
                        ShowLoader(); setTimeout(function () { try {
                            mzAjax('taskChecklist/'+currentRow['taskChecklistId'], 'DELETE');
                            isEdit = true;
                            self.genTable();
                        } catch (e) { toastr['error'](e.message !== '' ? e.message : _ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); } HideLoader(); }, 200);
                    });
                },
                aoColumns: [
                    { mData: null},
                    { mData: 'taskChecklistName'},
                    { mData: 'taskChecklistWeightage'},
                    { mData: 'statusId', mRender: function (data) { return dtDisplay.getStatus(refStatus[data]['statusName'], refStatus[data]['statusColor']); }},
                    { mData: null, mRender: function (data, type, row, meta) { return dtDisplay.getAction(3, 'lnkMtc', meta.row, row['statusId']); }}
                ]
            });

            $('#btnMtcAdd').on('click', function () {
                if (!formValidate.validateNow()) {
                    toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
                } else {
                    ShowLoader(); setTimeout(function () { try {
                        const data = {
                            taskChecklistName: mzNullString($('#txtMtcDescription').val()),
                            taskChecklistWeightage: mzNullInt($('#txtMtcWeightage').val())
                        };
                        mzAjax('taskChecklist/' + taskId, 'POST', data);
                        formValidate.clearValidation();
                        isEdit = true;
                        self.genTable();
                        $('#divMtcEdit').hide();
                    } catch (e) { toastr['error'](e.message !== '' ? e.message : _ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); } HideLoader(); }, 200);
                }
            });

            $('#btnMtcSave').on('click', function () {
                if (!formValidateEdit.validateNow()) {
                    toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
                } else {
                    ShowLoader(); setTimeout(function () { try {
                        const data = {
                            taskChecklistName: mzNullString($('#txtMtcDescriptionEdit').val()),
                            taskChecklistWeightage: mzNullInt($('#txtMtcWeightageEdit').val())
                        };
                        mzAjax('taskChecklist/'+taskChecklistId, 'PUT', data);
                        isEdit = true;
                        self.genTable();
                        $('#divMtcEdit').hide();
                    } catch (e) { toastr['error'](e.message !== '' ? e.message : _ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); } HideLoader(); }, 200);
                }
            });
        } catch (e) { throw new Error(); }
    };

    this.open = function (_taskId) {
        try {
            mzEmptyParams([_taskId]);
            taskId = _taskId;
            isEdit = false;
            $('#divMtcEdit').hide();
            self.genTable();
            $('#modalTaskChecklist').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
        } catch (e) { toastr['error'](e.message !== '' ? e.message : _ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR); }
    };

    this.genTable = function () {
        const dataDb = mzAjax('taskChecklist/list/'+taskId, 'GET');
        dtMtc.clear().rows.add(dataDb).draw();
        $('#pMtcTotalChecklist').html(dataDb.length);
        const selectorLabel = $('#pMtcCompletion');
        selectorLabel.removeClass('text-success text-danger');
        let total = 0;
        let achieved = 0;
        $.each(dataDb, function (n, u) {
            if (u['statusId'] === 6) {
                achieved += u['taskChecklistWeightage'];
            }
            total += u['taskChecklistWeightage'];
        });
        const percentage = achieved/total*100;
        selectorLabel.html(mzFormatNumber(percentage) + ' %');
        if (percentage === 100) {
            selectorLabel.addClass('text-success');
        } else {
            selectorLabel.addClass('text-danger');
        }
    };

    this.getClassName = function () {
        return className;
    };

    this.setClassFrom = function (_classFrom) {
        classFrom = _classFrom;
    };

    this.setRefStatus = function (_refStatus) {
        refStatus = _refStatus;
    };

    this.setDtDisplay = function (_dtDisplay) {
        dtDisplay = _dtDisplay;
    };
}