function ListAll() {

    const className = 'ListAll';
    let self = this;
    let dtLllToday;
    let dtLllOverdue;
    let dtLllFuture;
    let dtLllUnscheduled;
    let dtLllDone;
    let refStatus;
    let refUser;
    let refSpace;
    let refFolder;
    let dtDisplay;
    let modalTaskEdit;
    let modalTaskTime;
    let modalTaskChecklist;
    let currentOpen = 1;
    let isGetToday = true;
    let isGetOverdue = false;
    let isGetFuture = false;
    let isGetUnscheduled = false;
    let isGetDone = false;
    const todayDate = moment().format('YYYY-MM-DD');
    const yesterdayDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
    const divWidth = $('#divLllToday').width();
    const monthArr = mzGetMonthArray();

    this.init = function () {
        $('#btnLllAddTask').on('click', function () {
            modalTaskEdit.add();
        });

        $('#divLllToday').on('shown.bs.collapse', function () {
            currentOpen = 1;
            if (!isGetToday) {
                ShowLoader(); setTimeout(function () { try {
                    self.genTableToday();
                    isGetToday = true;
                } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); } HideLoader(); }, 100);
            }
        });

        $('#divLllOverdue').on('shown.bs.collapse', function () {
            currentOpen = 2;
            if (!isGetOverdue) {
                ShowLoader(); setTimeout(function () { try {
                    self.genTableOverdue();
                    isGetOverdue = true;
                } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); } HideLoader(); }, 100);
            }
        });

        $('#divLllFuture').on('shown.bs.collapse', function () {
            currentOpen = 3;
            if (!isGetFuture) {
                ShowLoader(); setTimeout(function () { try {
                    self.genTableFuture();
                    isGetFuture = true;
                } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); } HideLoader(); }, 100);
            }
        });

        $('#divLllUnscheduled').on('shown.bs.collapse', function () {
            currentOpen = 4;
            if (!isGetUnscheduled) {
                ShowLoader(); setTimeout(function () { try {
                    self.genTableUnscheduled();
                    isGetUnscheduled = true;
                } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); } HideLoader(); }, 100);
            }
        });

        $('#divLllDone').on('shown.bs.collapse', function () {
            currentOpen = 5;
            if (!isGetDone) {
                ShowLoader(); setTimeout(function () { try {
                    self.genTableDone();
                    isGetDone = true;
                } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); } HideLoader(); }, 100);
            }
        });

        dtLllToday = $('#dtLllToday').DataTable({
            bLengthChange: false,
            bFilter: true,
            ordering: false,
            pageLength: 10,
            autoWidth: false,
            dom: "<'row'<'col-12 col-sm-6 px-0 pb-2'B><'col-sm-6 d-none d-sm-block pb-0'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-6 col-md-5 d-none d-sm-block'i><'col-sm-6 col-md-7'p>>",
            columnDefs: [
                { className: 'text-center', targets: [0, 6, 8, 9, 11, 12, 13 ,14, 15, 16, 17, 18, 19] },
                { className: 'text-right', targets: [10] },
                { className: 'noVis', targets: [0, 19] },
                { visible: false, targets: [2, 5, 8, 9, 17] }
            ],
            buttons: [
                { extend: 'colvis', columns: ':not(.noVis)', fade: 400, collectionLayout: 'four-column', text:'<i class="fas fa-columns"></i>', className: 'btn btn-outline-grey btn-sm px-2 ml-0 z-depth-2', titleAttr: 'Column'},
                { extend: 'print', className: 'btn btn-outline-blue-grey btn-sm px-2 z-depth-2', text:'<i class="fas fa-print"></i>', title:'Task Management System - All Today Task List', titleAttr: 'Print', exportOptions: mzExportOpt},
                { extend: 'copy', className: 'btn btn-outline-blue btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-copy"></i>', title:'Task Management System - All Today Task List', titleAttr: 'Copy', exportOptions: mzExportOpt},
                { extend: 'excelHtml5', className: 'btn btn-outline-green btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-file-excel"></i>', title:'Task Management System - All Today Task List', titleAttr: 'Excel', exportOptions: mzExportOpt},
                { extend: 'pdfHtml5', className: 'btn btn-outline-red btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-file-pdf"></i>', title:'Task Management System - All Today Task List', titleAttr: 'PDF', orientation: 'landscape', exportOptions: mzExportOpt},
                { text: '<i class="fas fa-arrows-rotate"></i>', className: 'btn btn-outline-indigo btn-sm px-2 ml-2 z-depth-2', attr: { id: 'btnLllTodayRefresh' }, titleAttr: 'Refresh Listing'}

            ],
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = $(this).DataTable().page.info();
                $('td', nRow).eq(0).html(info.start + (iDisplayIndex + 1));
            },
            drawCallback: function () {
                $('[data-toggle="tooltip"]').tooltip();
                $('#btnLllTodayRefresh').off('click').on('click', function () {
                    ShowLoader(); setTimeout(function () { try {
                        self.genTableToday();
                    } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); } HideLoader(); }, 100);
                });
                $('.lnkLllTodayEdit').off('click').on('click', function () {
                    const linkId = $(this).attr('id');
                    const linkIndex = linkId.indexOf('_');
                    if (linkIndex > 0) {
                        const rowId = linkId.substring(linkIndex+1);
                        const currentRow = dtLllToday.row(parseInt(rowId)).data();
                        modalTaskEdit.edit(currentRow['taskId']);
                    }
                });
                $('.lnkLllTodayTime').off('click').on('click', function () {
                    const linkId = $(this).attr('id');
                    const linkIndex = linkId.indexOf('_');
                    if (linkIndex > 0) {
                        const rowId = linkId.substring(linkIndex+1);
                        const currentRow = dtLllToday.row(parseInt(rowId)).data();
                        modalTaskTime.setClassFrom(self);
                        modalTaskTime.open(currentRow['taskId'], currentRow['taskTimeEstimate'], currentRow['taskDateStart']);
                    }
                });
                $('.lnkLllTodayCheck').off('click').on('click', function () {
                    const linkId = $(this).attr('id');
                    const linkIndex = linkId.indexOf('_');
                    if (linkIndex > 0) {
                        const rowId = linkId.substring(linkIndex+1);
                        const currentRow = dtLllToday.row(parseInt(rowId)).data();
                        modalTaskChecklist.setClassFrom(self);
                        modalTaskChecklist.open(currentRow['taskId']);
                    }
                });
            },
            aoColumns: [
                { mData: null},
                { mData: 'taskName', mRender: function (data, type, row) { return dtDisplay.getTaskName(data, row['taskIsMain'], row['taskMainId']); }},
                { mData: 'mainTaskName'},
                { mData: null, mRender: function (data, type, row) { return refSpace[refFolder[row['folderId']]['spaceId']]['spaceName']; }},
                { mData: 'folderId', mRender: function (data) { return refFolder[data]['folderName']; }},
                { mData: 'taskDescription'}, // 5
                { mData: 'taskAssignee', mRender: function(data) { return dtDisplay.getAssignee(refUser[data]['userShortName'], refUser[data]['profileImage']); }},
                { mData: 'taskTags', mRender: function (data) { return dtDisplay.getTags(data); }},
                { mData: 'taskYear'},
                { mData: 'taskMonth', mRender: function (data) { return data >= 1 && data <= 12 ? monthArr[data]['monthName'] : ''; }},
                { mData: 'taskAmount', mRender: function (data) { return mzFormatNumber(data, 2); }}, // 10
                { mData: 'taskPriority', mRender: function (data) { return dtDisplay.getPriority(data); }},
                { mData: 'taskDateDue', mRender: function (data) { return mzDateDisplay(data); }},
                { mData: 'taskDateStart'},
                { mData: 'taskDateEnd'},
                { mData: 'progress', mRender: function (data) { return dtDisplay.getProgress(data); }}, // 15
                { mData: 'taskTimeEstimate'},
                { mData: 'timeSpent', mRender: function (data, type, row) { return dtDisplay.getRecordedTime(data, row['taskTimeEstimate']); }},
                { mData: 'statusId', mRender: function (data) { return dtDisplay.getStatus(refStatus[data]['statusName'], refStatus[data]['statusColor']); }},
                { mData: null, mRender: function (data, type, row, meta) { return dtDisplay.getAction(row['taskIsMain']===1?1:2, 'lnkLllToday', meta.row); }}
            ]
        });

        if (divWidth < 1164) { dtLllToday.column(10).visible(false); }
        if (divWidth < 1082) { dtLllToday.column(12).visible(false); }
        if (divWidth < 995) { dtLllToday.column(11).visible(false); }
        if (divWidth < 935) { dtLllToday.column(7).visible(false); }
        if (divWidth < 871) { dtLllToday.column(16).visible(false); }
        if (divWidth < 773) { dtLllToday.column(15).visible(false); }
        if (divWidth < 682) { dtLllToday.column(3).visible(false); }
        if (divWidth < 621) { dtLllToday.column(4).visible(false); }
        if (divWidth < 576) { dtLllToday.column(18).visible(false); }
        if (divWidth < 451) { dtLllToday.column(14).visible(false); }
        if (divWidth < 370) { dtLllToday.column(13).visible(false); }

        dtLllOverdue = $('#dtLllOverdue').DataTable({
            bLengthChange: false,
            bFilter: true,
            ordering: false,
            pageLength: 10,
            autoWidth: false,
            dom: "<'row'<'col-12 col-sm-6 px-0 pb-2'B><'col-sm-6 d-none d-sm-block pb-0'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-6 col-md-5 d-none d-sm-block'i><'col-sm-6 col-md-7'p>>",
            columnDefs: [
                { className: 'text-center', targets: [0, 6, 8, 9, 11, 12, 13 ,14, 15, 16, 17, 18, 19, 20] },
                { className: 'text-right', targets: [10] },
                { className: 'noVis', targets: [0, 20] },
                { visible: false, targets: [2, 5, 8, 9, 17] },
            ],
            buttons: [
                { extend: 'colvis', columns: ':not(.noVis)', fade: 400, collectionLayout: 'four-column', text:'<i class="fas fa-columns"></i>', className: 'btn btn-outline-grey btn-sm px-2 ml-0 z-depth-2', titleAttr: 'Column'},
                { extend: 'print', className: 'btn btn-outline-blue-grey btn-sm px-2 z-depth-2', text:'<i class="fas fa-print"></i>', title:'Task Management System - All Overdue Task List', titleAttr: 'Print', exportOptions: mzExportOpt},
                { extend: 'copy', className: 'btn btn-outline-blue btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-copy"></i>', title:'Task Management System - All Overdue Task List', titleAttr: 'Copy', exportOptions: mzExportOpt},
                { extend: 'excelHtml5', className: 'btn btn-outline-green btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-file-excel"></i>', title:'Task Management System - All Overdue Task List', titleAttr: 'Excel', exportOptions: mzExportOpt},
                { extend: 'pdfHtml5', className: 'btn btn-outline-red btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-file-pdf"></i>', title:'Task Management System - All Overdue Task List', titleAttr: 'PDF', orientation: 'landscape', exportOptions: mzExportOpt},
                { text: '<i class="fas fa-arrows-rotate"></i>', className: 'btn btn-outline-indigo btn-sm px-2 ml-2 z-depth-2', attr: { id: 'btnLllOverdueRefresh' }, titleAttr: 'Refresh Listing'}

            ],
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = $(this).DataTable().page.info();
                $('td', nRow).eq(0).html(info.start + (iDisplayIndex + 1));
            },
            drawCallback: function () {
                $('[data-toggle="tooltip"]').tooltip();
                $('#btnLllOverdueRefresh').off('click').on('click', function () {
                    ShowLoader(); setTimeout(function () { try {
                        self.genTableOverdue();
                    } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); } HideLoader(); }, 100);
                });
                $('.lnkLllOverdueEdit').off('click').on('click', function () {
                    const linkId = $(this).attr('id');
                    const linkIndex = linkId.indexOf('_');
                    if (linkIndex > 0) {
                        const rowId = linkId.substring(linkIndex+1);
                        const currentRow = dtLllOverdue.row(parseInt(rowId)).data();
                        modalTaskEdit.edit(currentRow['taskId']);
                    }
                });
                $('.lnkLllOverdueTime').off('click').on('click', function () {
                    const linkId = $(this).attr('id');
                    const linkIndex = linkId.indexOf('_');
                    if (linkIndex > 0) {
                        const rowId = linkId.substring(linkIndex+1);
                        const currentRow = dtLllOverdue.row(parseInt(rowId)).data();
                        modalTaskTime.setClassFrom(self);
                        modalTaskTime.open(currentRow['taskId'], currentRow['taskTimeEstimate'], currentRow['taskDateStart']);
                    }
                });
            },
            aoColumns: [
                { mData: null},
                { mData: 'taskName', mRender: function (data, type, row) { return dtDisplay.getTaskName(data, row['taskIsMain'], row['taskMainId']); }},
                { mData: 'mainTaskName'},
                { mData: null, mRender: function (data, type, row) { return refSpace[refFolder[row['folderId']]['spaceId']]['spaceName']; }},
                { mData: 'folderId', mRender: function (data) { return refFolder[data]['folderName']; }},
                { mData: 'taskDescription'}, // 5
                { mData: 'taskAssignee', mRender: function(data) { return dtDisplay.getAssignee(refUser[data]['userShortName'], refUser[data]['profileImage']); }},
                { mData: 'taskTags', mRender: function (data) { return dtDisplay.getTags(data); }},
                { mData: 'taskYear'},
                { mData: 'taskMonth', mRender: function (data) { return data >= 1 && data <= 12 ? monthArr[data]['monthName'] : ''; }},
                { mData: 'taskAmount', mRender: function (data) { return mzFormatNumber(data, 2);}}, // 10
                { mData: 'taskPriority', mRender: function (data) { return dtDisplay.getPriority(data); }},
                { mData: 'taskDateDue', mRender: function (data) { return mzDateDisplay(data); }},
                { mData: 'taskDateStart'},
                { mData: 'taskDateEnd'},
                { mData: 'progress', mRender: function (data) { return dtDisplay.getProgress(data); }}, // 15
                { mData: 'taskTimeEstimate'},
                { mData: 'timeSpent', mRender: function (data, type, row) { return dtDisplay.getRecordedTime(data, row['taskTimeEstimate']); }},
                { mData: 'lateness', mRender: function(data) { return dtDisplay.getLateness(data); }},
                { mData: 'statusId', mRender: function (data) { return dtDisplay.getStatus(refStatus[data]['statusName'], refStatus[data]['statusColor']); }},
                { mData: null, mRender: function (data, type, row, meta) { return dtDisplay.getAction(row['taskIsMain']===1?1:2, 'lnkLllOverdue', meta.row); }} // 20
            ]
        });

        if (divWidth < 1232) { dtLllOverdue.column(13).visible(false); dtLllOverdue.column(14).visible(false); }
        if (divWidth < 1096) { dtLllOverdue.column(10).visible(false); }
        if (divWidth < 1009) { dtLllOverdue.column(11).visible(false); }
        if (divWidth < 925) { dtLllOverdue.column(7).visible(false); }
        if (divWidth < 842) { dtLllOverdue.column(16).visible(false); }
        if (divWidth < 754) { dtLllOverdue.column(15).visible(false); }
        if (divWidth < 675) { dtLllOverdue.column(3).visible(false); }
        if (divWidth < 598) { dtLllOverdue.column(4).visible(false); }
        if (divWidth < 500) { dtLllOverdue.column(19).visible(false); }
        if (divWidth < 450) { dtLllOverdue.column(12).visible(false); }
        if (divWidth < 370) { dtLllOverdue.column(6).visible(false); }

        dtLllFuture = $('#dtLllFuture').DataTable({
            bLengthChange: false,
            bFilter: true,
            ordering: false,
            pageLength: 10,
            autoWidth: false,
            dom: "<'row'<'col-12 col-sm-6 px-0 pb-2'B><'col-sm-6 d-none d-sm-block pb-0'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-6 col-md-5 d-none d-sm-block'i><'col-sm-6 col-md-7'p>>",
            columnDefs: [
                { className: 'text-center', targets: [0, 6, 8, 9, 11, 12, 13 ,14, 15, 16, 17, 18, 19] },
                { className: 'text-right', targets: [10] },
                { className: 'noVis', targets: [0, 19] },
                { visible: false, targets: [2, 5, 8, 9, 17] }
            ],
            buttons: [
                { extend: 'colvis', columns: ':not(.noVis)', fade: 400, collectionLayout: 'four-column', text:'<i class="fas fa-columns"></i>', className: 'btn btn-outline-grey btn-sm px-2 ml-0 z-depth-2', titleAttr: 'Column'},
                { extend: 'print', className: 'btn btn-outline-blue-grey btn-sm px-2 z-depth-2', text:'<i class="fas fa-print"></i>', title:'Task Management System - All Future Task List', titleAttr: 'Print', exportOptions: mzExportOpt},
                { extend: 'copy', className: 'btn btn-outline-blue btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-copy"></i>', title:'Task Management System - All Future Task List', titleAttr: 'Copy', exportOptions: mzExportOpt},
                { extend: 'excelHtml5', className: 'btn btn-outline-green btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-file-excel"></i>', title:'Task Management System - All Future Task List', titleAttr: 'Excel', exportOptions: mzExportOpt},
                { extend: 'pdfHtml5', className: 'btn btn-outline-red btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-file-pdf"></i>', title:'Task Management System - All Future Task List', titleAttr: 'PDF', orientation: 'landscape', exportOptions: mzExportOpt},
                { text: '<i class="fas fa-arrows-rotate"></i>', className: 'btn btn-outline-indigo btn-sm px-2 ml-2 z-depth-2', attr: { id: 'btnLllFutureRefresh' }, titleAttr: 'Refresh Listing'}

            ],
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = $(this).DataTable().page.info();
                $('td', nRow).eq(0).html(info.start + (iDisplayIndex + 1));
            },
            drawCallback: function () {
                $('[data-toggle="tooltip"]').tooltip();
                $('#btnLllFutureRefresh').off('click').on('click', function () {
                    ShowLoader(); setTimeout(function () { try {
                        self.genTableFuture();
                    } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); } HideLoader(); }, 100);
                });
                $('.lnkLllFutureEdit').off('click').on('click', function () {
                    const linkId = $(this).attr('id');
                    const linkIndex = linkId.indexOf('_');
                    if (linkIndex > 0) {
                        const rowId = linkId.substring(linkIndex+1);
                        const currentRow = dtLllFuture.row(parseInt(rowId)).data();
                        modalTaskEdit.edit(currentRow['taskId']);
                    }
                });
                $('.lnkLllFutureTime').off('click').on('click', function () {
                    const linkId = $(this).attr('id');
                    const linkIndex = linkId.indexOf('_');
                    if (linkIndex > 0) {
                        const rowId = linkId.substring(linkIndex+1);
                        const currentRow = dtLllFuture.row(parseInt(rowId)).data();
                        modalTaskTime.setClassFrom(self);
                        modalTaskTime.open(currentRow['taskId'], currentRow['taskTimeEstimate'], currentRow['taskDateStart']);
                    }
                });
            },
            aoColumns: [
                { mData: null},
                { mData: 'taskName', mRender: function (data, type, row) { return dtDisplay.getTaskName(data, row['taskIsMain'], row['taskMainId']); }},
                { mData: 'mainTaskName'},
                { mData: null, mRender: function (data, type, row) { return refSpace[refFolder[row['folderId']]['spaceId']]['spaceName']; }},
                { mData: 'folderId', mRender: function (data) { return refFolder[data]['folderName']; }},
                { mData: 'taskDescription'}, // 5
                { mData: 'taskAssignee', mRender: function(data) { return dtDisplay.getAssignee(refUser[data]['userShortName'], refUser[data]['profileImage']); }},
                { mData: 'taskTags', mRender: function (data) { return dtDisplay.getTags(data); }},
                { mData: 'taskYear'},
                { mData: 'taskMonth', mRender: function (data) { return data >= 1 && data <= 12 ? monthArr[data]['monthName'] : ''; }},
                { mData: 'taskAmount', mRender: function (data) { return mzFormatNumber(data, 2); }}, // 10
                { mData: 'taskPriority', mRender: function (data) { return dtDisplay.getPriority(data); }},
                { mData: 'taskDateDue', mRender: function (data) { return mzDateDisplay(data); }},
                { mData: 'taskDateStart'},
                { mData: 'taskDateEnd'},
                { mData: 'progress', mRender: function (data) { return dtDisplay.getProgress(data); }}, // 15
                { mData: 'taskTimeEstimate'},
                { mData: 'timeSpent', mRender: function (data, type, row) { return dtDisplay.getRecordedTime(data, row['taskTimeEstimate']); }},
                { mData: 'statusId', mRender: function (data) { return dtDisplay.getStatus(refStatus[data]['statusName'], refStatus[data]['statusColor']); }},
                { mData: null, mRender: function (data, type, row, meta) { return dtDisplay.getAction(row['taskIsMain']===1?1:2, 'lnkLllFuture', meta.row); }}
            ]
        });

        if (divWidth < 1169) { dtLllFuture.column(13).visible(false); dtLllFuture.column(14).visible(false); }
        if (divWidth < 990) { dtLllFuture.column(15).visible(false); }
        if (divWidth < 889) { dtLllFuture.column(10).visible(false); }
        if (divWidth < 817) { dtLllFuture.column(11).visible(false); }
        if (divWidth < 723) { dtLllFuture.column(7).visible(false); }
        if (divWidth < 664) { dtLllFuture.column(16).visible(false); }
        if (divWidth < 576) { dtLllFuture.column(3).visible(false); }
        if (divWidth < 539) { dtLllFuture.column(18).visible(false); }
        if (divWidth < 471) { dtLllFuture.column(4).visible(false); }
        if (divWidth < 390) { dtLllFuture.column(6).visible(false); }

        dtLllUnscheduled = $('#dtLllUnscheduled').DataTable({
            bLengthChange: false,
            bFilter: true,
            ordering: false,
            pageLength: 10,
            autoWidth: false,
            dom: "<'row'<'col-12 col-sm-6 px-0 pb-2'B><'col-sm-6 d-none d-sm-block pb-0'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-6 col-md-5 d-none d-sm-block'i><'col-sm-6 col-md-7'p>>",
            columnDefs: [
                { className: 'text-center', targets: [0, 6, 8, 9, 11, 12, 13, 14] },
                { className: 'text-right', targets: [10] },
                { className: 'noVis', targets: [0, 14] },
                { visible: false, targets: [8, 9] }
            ],
            buttons: [
                { extend: 'colvis', columns: ':not(.noVis)', fade: 400, collectionLayout: 'four-column', text:'<i class="fas fa-columns"></i>', className: 'btn btn-outline-grey btn-sm px-2 ml-0 z-depth-2', titleAttr: 'Column'},
                { extend: 'print', className: 'btn btn-outline-blue-grey btn-sm px-2 z-depth-2', text:'<i class="fas fa-print"></i>', title:'Task Management System - All Unscheduled Task List', titleAttr: 'Print', exportOptions: mzExportOpt},
                { extend: 'copy', className: 'btn btn-outline-blue btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-copy"></i>', title:'Task Management System - All Unscheduled Task List', titleAttr: 'Copy', exportOptions: mzExportOpt},
                { extend: 'excelHtml5', className: 'btn btn-outline-green btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-file-excel"></i>', title:'Task Management System - All Unscheduled Task List', titleAttr: 'Excel', exportOptions: mzExportOpt},
                { extend: 'pdfHtml5', className: 'btn btn-outline-red btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-file-pdf"></i>', title:'Task Management System - All Unscheduled Task List', titleAttr: 'PDF', orientation: 'landscape', exportOptions: mzExportOpt},
                { text: '<i class="fas fa-arrows-rotate"></i>', className: 'btn btn-outline-indigo btn-sm px-2 ml-2 z-depth-2', attr: { id: 'btnLllUnscheduledRefresh' }, titleAttr: 'Refresh Listing'}

            ],
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = $(this).DataTable().page.info();
                $('td', nRow).eq(0).html(info.start + (iDisplayIndex + 1));
            },
            drawCallback: function () {
                $('[data-toggle="tooltip"]').tooltip();
                $('#btnLllUnscheduledRefresh').off('click').on('click', function () {
                    ShowLoader(); setTimeout(function () { try {
                        self.genTableUnscheduled();
                    } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); } HideLoader(); }, 100);
                });
                $('.lnkLllUnscheduledEdit').off('click').on('click', function () {
                    const linkId = $(this).attr('id');
                    const linkIndex = linkId.indexOf('_');
                    if (linkIndex > 0) {
                        const rowId = linkId.substring(linkIndex+1);
                        const currentRow = dtLllUnscheduled.row(parseInt(rowId)).data();
                        modalTaskEdit.edit(currentRow['taskId']);
                    }
                });
            },
            aoColumns: [
                { mData: null},
                { mData: 'taskName', mRender: function (data, type, row) { return dtDisplay.getTaskName(data, row['taskIsMain'], row['taskMainId']); }},
                { mData: 'mainTaskName'},
                { mData: null, mRender: function (data, type, row) { return refSpace[refFolder[row['folderId']]['spaceId']]['spaceName']; }},
                { mData: 'folderId', mRender: function (data) { return refFolder[data]['folderName']; }},
                { mData: 'taskDescription'}, // 5
                { mData: 'taskAssignee', mRender: function(data) { return dtDisplay.getAssignee(refUser[data]['userShortName'], refUser[data]['profileImage']); }},
                { mData: 'taskTags', mRender: function (data) { return dtDisplay.getTags(data); }},
                { mData: 'taskYear'},
                { mData: 'taskMonth'},
                { mData: 'taskAmount', mRender: function (data) { return mzFormatNumber(data, 2); }}, // 10
                { mData: 'taskPriority', mRender: function (data) { return dtDisplay.getPriority(data); }},
                { mData: 'taskTimeEstimate'},
                { mData: 'statusId', mRender: function (data) { return dtDisplay.getStatus(refStatus[data]['statusName'], refStatus[data]['statusColor']); }},
                { mData: null, mRender: function (data, type, row, meta) { return dtDisplay.getAction(1, 'lnkLllUnscheduled', meta.row); }}
            ]
        });

        if (divWidth < 1081) { dtLllUnscheduled.column(10).visible(false); }
        if (divWidth < 1005) { dtLllUnscheduled.column(5).visible(false); }
        if (divWidth < 857) { dtLllUnscheduled.column(2).visible(false); }
        if (divWidth < 774) { dtLllUnscheduled.column(11).visible(false); }
        if (divWidth < 692) { dtLllUnscheduled.column(12).visible(false); }
        if (divWidth < 576) { dtLllUnscheduled.column(13).visible(false); }
        if (divWidth < 482) { dtLllUnscheduled.column(7).visible(false); }
        if (divWidth < 413) { dtLllUnscheduled.column(6).visible(false); }
        if (divWidth < 345) { dtLllUnscheduled.column(3).visible(false); }

        dtLllDone = $('#dtLllDone').DataTable({
            bLengthChange: false,
            bFilter: true,
            ordering: false,
            pageLength: 10,
            autoWidth: false,
            dom: "<'row'<'col-12 col-sm-6 px-0 pb-2'B><'col-sm-6 d-none d-sm-block pb-0'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-6 col-md-5 d-none d-sm-block'i><'col-sm-6 col-md-7'p>>",
            columnDefs: [
                { className: 'text-center', targets: [0, 6, 8, 9, 11, 12, 13 ,14, 15, 16, 17, 18, 19, 20, 21] },
                { className: 'text-right', targets: [10] },
                { className: 'noVis', targets: [0] },
                { visible: false, targets: [2, 5, 14, 15, 16, 21] }
            ],
            buttons: [
                { extend: 'colvis', columns: ':not(.noVis)', fade: 400, collectionLayout: 'four-column', text:'<i class="fas fa-columns"></i>', className: 'btn btn-outline-grey btn-sm px-2 ml-0 z-depth-2', titleAttr: 'Column'},
                { extend: 'print', className: 'btn btn-outline-blue-grey btn-sm px-2 z-depth-2', text:'<i class="fas fa-print"></i>', title:'Task Management System - All Closed Task List', titleAttr: 'Print', exportOptions: mzExportOpt},
                { extend: 'copy', className: 'btn btn-outline-blue btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-copy"></i>', title:'Task Management System - All Closed Task List', titleAttr: 'Copy', exportOptions: mzExportOpt},
                { extend: 'excelHtml5', className: 'btn btn-outline-green btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-file-excel"></i>', title:'Task Management System - All Closed Task List', titleAttr: 'Excel', exportOptions: mzExportOpt},
                { extend: 'pdfHtml5', className: 'btn btn-outline-red btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-file-pdf"></i>', title:'Task Management System - All Closed Task List', titleAttr: 'PDF', orientation: 'landscape', exportOptions: mzExportOpt},
                { text: '<i class="fas fa-arrows-rotate"></i>', className: 'btn btn-outline-indigo btn-sm px-2 ml-2 z-depth-2', attr: { id: 'btnLllDoneRefresh' }, titleAttr: 'Refresh Listing'}

            ],
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = $(this).DataTable().page.info();
                $('td', nRow).eq(0).html(info.start + (iDisplayIndex + 1));
            },
            drawCallback: function () {
                $('[data-toggle="tooltip"]').tooltip();
                $('#btnLllDoneRefresh').off('click').on('click', function () {
                    ShowLoader(); setTimeout(function () { try {
                        self.genTableDone();
                    } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); } HideLoader(); }, 100);
                });
            },
            aoColumns: [
                { mData: null},
                { mData: 'taskName', mRender: function (data, type, row) { return dtDisplay.getTaskName(data, row['taskIsMain'], row['taskMainId']); }},
                { mData: 'mainTaskName'},
                { mData: null, mRender: function (data, type, row) { return refSpace[refFolder[row['folderId']]['spaceId']]['spaceName']; }},
                { mData: 'folderId', mRender: function (data) { return refFolder[data]['folderName']; }},
                { mData: 'taskDescription'}, // 5
                { mData: 'taskAssignee', mRender: function(data) { return dtDisplay.getAssignee(refUser[data]['userShortName'], refUser[data]['profileImage']); }},
                { mData: 'taskTags', mRender: function (data) { return dtDisplay.getTags(data); }},
                { mData: 'taskYear'},
                { mData: 'taskMonth', mRender: function (data) { return data !== null && data >= 1 && data <= 12 ? monthArr[data-1]['monthName'] : ''; }},
                { mData: 'taskAmount', mRender: function (data) { return mzFormatNumber(data, 2);}}, // 10
                { mData: 'taskPriority', mRender: function (data) { return dtDisplay.getPriority(data); }},
                { mData: 'taskDateDue', mRender: function (data) { return mzDateDisplay(data); }},
                { mData: 'taskDateClose', mRender: function (data) { return mzDateDisplay(data); }},
                { mData: 'taskDateStart'},
                { mData: 'taskDateEnd'}, // 15
                { mData: 'progress', mRender: function (data) { return dtDisplay.getProgress(data); }},
                { mData: 'taskTimeEstimate'},
                { mData: 'timeSpent', mRender: function (data, type, row) { return dtDisplay.getRecordedTime(data, row['taskTimeEstimate']); }},
                { mData: 'efficiency', mRender: function (data) { return dtDisplay.getEfficiency(data); }},
                { mData: 'lateness', mRender: function(data) { return dtDisplay.getLateness(data); }}, // 20
                { mData: 'statusId', mRender: function (data) { return dtDisplay.getStatus(refStatus[data]['statusName'], refStatus[data]['statusColor']); }}
            ]
        });

        if (divWidth < 1327) { dtLllDone.column(8).visible(false); dtLllDone.column(9).visible(false); }
        if (divWidth < 1209) { dtLllDone.column(11).visible(false); }
        if (divWidth < 1143) { dtLllDone.column(10).visible(false); }
        if (divWidth < 1061) { dtLllDone.column(7).visible(false); }
        if (divWidth < 1014) { dtLllDone.column(3).visible(false); }
        if (divWidth < 931) { dtLllDone.column(4).visible(false); }
        if (divWidth < 821) { dtLllDone.column(6).visible(false); }
        if (divWidth < 729) { dtLllDone.column(11).visible(false); }
        if (divWidth < 644) { dtLllDone.column(16).visible(false); }
        if (divWidth < 631) { dtLllDone.column(17).visible(false); }
        if (divWidth < 558) { dtLllDone.column(12).visible(false); }
        if (divWidth < 492) { dtLllDone.column(13).visible(false); }
        if (divWidth < 392) { dtLllDone.column(18).visible(false); }

        self.genTotalData();
        self.genTableToday();
    };

    this.genTotalData = function () {
        const dataApi = mzAjax('task/summary/all', 'GET');
        $('#spanLllTodayTotal').text(dataApi['totalToday']);
        $('#spanLllTodayOverdue').text(dataApi['totalOverdue']);
        $('#spanLllTodayFuture').text(dataApi['totalFuture']);
        $('#spanLllTodayUnscheduled').text(dataApi['totalUnscheduled']);
        $('#spanLllTodayDone').text(dataApi['totalDone']);
    };

    this.genTableToday = function () {
        const dataDb = mzAjax('task/list/today', 'GET');
        dtLllToday.clear().rows.add(dataDb).draw();
        $('#spanLllTodayTotal').text(dataDb.length);
    };

    this.genTableOverdue = function () {
        const dataDb = mzAjax('task/list/overdue', 'GET');
        dtLllOverdue.clear().rows.add(dataDb).draw();
        $('#spanLllTodayOverdue').text(dataDb.length);
    };

    this.genTableFuture = function () {
        const dataDb = mzAjax('task/list/future', 'GET');
        dtLllFuture.clear().rows.add(dataDb).draw();
        $('#spanLllTodayFuture').text(dataDb.length);
    };

    this.genTableUnscheduled = function () {
        const dataDb = mzAjax('task/list/unscheduled', 'GET');
        dtLllUnscheduled.clear().rows.add(dataDb).draw();
        $('#spanLllTodayUnscheduled').text(dataDb.length);
    };

    this.genTableDone = function () {
        const dataDb = mzAjax('task/list/done', 'GET');
        dtLllDone.clear().rows.add(dataDb).draw();
        $('#spanLllTodayDone').text(dataDb.length);
    };

    this.refreshAdd = function (dueDate) {
        self.genTotalData();
        if (dueDate === null) {
            self.resetIsGetUnscheduled();
        } else if (dueDate === todayDate) {
            self.resetIsGetToday();
        } else if (dueDate === yesterdayDate) {
            self.resetIsGetOverdue();
        } else {
            self.resetIsGetFuture();
        }
    };

    this.refreshEdit = function (dueBefore, dueAfter, isClosed) {
        self.genTotalData();
        if (currentOpen === 1) {
            self.genTableToday();
        } else if (currentOpen === 2) {
            self.genTableOverdue();
        } else if (currentOpen === 3) {
            self.genTableFuture();
        } else if (currentOpen === 4) {
            self.genTableUnscheduled();
        }
        if (isClosed && isGetDone) {
            isGetDone = false;
        } else if (dueBefore !== dueAfter) {
            if (dueAfter === null && currentOpen !== 4 && isGetUnscheduled) {
                isGetUnscheduled = false;
            } else if (dueAfter === todayDate && currentOpen !== 1 && isGetToday) {
                isGetToday = false;
            } else if (dueAfter === yesterdayDate && currentOpen !== 2 && isGetOverdue) {
                isGetOverdue = false;
            } else if (dueAfter > todayDate && currentOpen !== 3 && isGetFuture) {
                isGetOverdue = false;
            }
        }
    };

    this.resetIsGetToday = function () {
        if (currentOpen === 1) {
            self.genTableToday();
            isGetToday = true;
        } else {
            isGetToday = false;
        }
    };

    this.resetIsGetOverdue = function () {
        if (currentOpen === 2) {
            self.genTableOverdue();
            isGetOverdue = true;
        } else {
            isGetUnscheduled = false;
        }
    };

    this.resetIsGetFuture = function () {
        if (currentOpen === 3) {
            self.genTableFuture();
            isGetFuture = true;
        } else {
            isGetUnscheduled = false;
        }
    };

    this.resetIsGetUnscheduled = function () {
        if (currentOpen === 4) {
            self.genTableUnscheduled();
            isGetUnscheduled = true;
        } else {
            isGetUnscheduled = false;
        }
    };

    this.getCurrentOpen = function () {
        return currentOpen;
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

    this.setDtDisplay = function (_dtDisplay) {
        dtDisplay = _dtDisplay;
    };

    this.setModalTaskEdit = function (_modalTaskEdit) {
        modalTaskEdit = _modalTaskEdit;
    };

    this.setModalTaskTime = function (_modalTaskTime) {
        modalTaskTime = _modalTaskTime;
    };

    this.setModalTaskChecklist = function (_modalTaskChecklist) {
        modalTaskChecklist = _modalTaskChecklist;
    };
}