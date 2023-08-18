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
    let isGetOverdue = false;
    let isGetFuture = false;
    let isGetUnscheduled = false;
    let isGetDone = false;
    const divWidth = $('#divLllToday').width();
    const monthArr = mzGetMonthArray();

    this.init = function () {
        $('#divLllOverdue').on('shown.bs.collapse', function () {
            if (!isGetOverdue) {
                ShowLoader();
                setTimeout(function () {
                    try {
                        self.genTableOverdue();
                        isGetOverdue = true;
                    } catch (e) {
                        toastr['error'](e.message, _ALERT_TITLE_ERROR);
                    }
                    HideLoader();
                }, 100);
            }
        });


        $('#divLllFuture').on('shown.bs.collapse', function () {
            if (!isGetFuture) {
                ShowLoader();
                setTimeout(function () {
                    try {
                        self.genTableFuture();
                        isGetFuture = true;
                    } catch (e) {
                        toastr['error'](e.message, _ALERT_TITLE_ERROR);
                    }
                    HideLoader();
                }, 100);
            }
        });


        $('#divLllUnscheduled').on('shown.bs.collapse', function () {
            if (!isGetUnscheduled) {
                ShowLoader();
                setTimeout(function () {
                    try {
                        self.genTableUnscheduled();
                        isGetUnscheduled = true;
                    } catch (e) {
                        toastr['error'](e.message, _ALERT_TITLE_ERROR);
                    }
                    HideLoader();
                }, 100);
            }
        });

        $('#divLllDone').on('shown.bs.collapse', function () {
            if (!isGetDone) {
                ShowLoader();
                setTimeout(function () {
                    try {
                        self.genTableDone();
                        isGetDone = true;
                    } catch (e) {
                        toastr['error'](e.message, _ALERT_TITLE_ERROR);
                    }
                    HideLoader();
                }, 100);
            }
        });

        dtLllToday = $('#dtLllToday').DataTable({
            bLengthChange: false,
            bFilter: true,
            ordering: false,
            pageLength: 10,
            autoWidth: false,
            dom: "<'row'<'col-5 px-0 pb-2'B><'col-7 pb-0'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-6 col-md-5 d-none d-sm-block'i><'col-sm-6 col-md-7'p>>",
            columnDefs: [
                { className: 'text-center', targets: [0, 6, 7, 8, 10, 11, 12, 13 ,14, 15, 16, 17, 18] },
                { className: 'text-right', targets: [9] },
                { className: 'noVis', targets: [0, 18] },
                { visible: false, targets: [2, 5, 7, 8, 16] }
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
                    ShowLoader();
                    setTimeout(function () {
                        try {
                            self.genTableToday();
                        } catch (e) {
                            toastr['error'](e.message, _ALERT_TITLE_ERROR);
                        }
                        HideLoader();
                    }, 100);
                });
            },
            aoColumns: [
                { mData: null},
                { mData: 'taskName', mRender: function (data, type, row) { return mzGetDtTaskName(data, row['taskMainId']); }},
                { mData: 'mainTaskName'},
                { mData: null, mRender: function (data, type, row) { return refSpace[refFolder[row['folderId']]['spaceId']]['spaceName']; }},
                { mData: 'folderId', mRender: function (data) { return refFolder[data]['folderName']; }},
                { mData: 'taskDescription'}, // 5
                { mData: 'taskAssignee', mRender: function(data) { return mzGetDtAssignee(refUser[data]['userShortName'], refUser[data]['profileImage']); }},
                { mData: 'taskYear'},
                { mData: 'taskMonth', mRender: function (data) { return data >= 1 && data <= 12 ? monthArr[data]['monthName'] : ''; }},
                { mData: 'taskAmount', mRender: function (data) { return mzFormatNumber(data, 2); }},
                { mData: 'taskPriority', mRender: function (data) { return mzGetDtPriority(data); }},   // 10
                { mData: 'taskDateDue', mRender: function (data) { return mzDateDisplay(data); }},
                { mData: 'taskDateStart'},
                { mData: 'taskDateEnd'},
                { mData: 'progress', mRender: function (data) { return mzGetDtProgress(data); }},
                { mData: 'taskTimeEstimate'}, // 15
                { mData: 'timeSpent', mRender: function (data, type, row) { return mzGetDtRecordedTime(data, row['taskTimeEstimate']); }},
                { mData: 'statusId', mRender: function (data) { return mzGetDtStatus(refStatus[data]['statusName'], refStatus[data]['statusColor']); }},
                { mData: null, mRender: function (data, type, row, meta) { return mzGetDtAction(2, 'lnkLllToday', meta.row); }}
            ]
        });

        if (divWidth < 1068) { dtLllToday.column(14).visible(false); }
        if (divWidth < 1000) { dtLllToday.column(11).visible(false); }
        if (divWidth < 915) { dtLllToday.column(9).visible(false); }
        if (divWidth < 860) { dtLllToday.column(3).visible(false); }
        if (divWidth < 760) { dtLllToday.column(15).visible(false); }
        if (divWidth < 680) { dtLllToday.column(6).visible(false); }
        if (divWidth < 576) { dtLllToday.column(10).visible(false); }

        dtLllOverdue = $('#dtLllOverdue').DataTable({
            bLengthChange: false,
            bFilter: true,
            ordering: false,
            pageLength: 10,
            autoWidth: false,
            dom: "<'row'<'col-5 px-0 pb-2'B><'col-7 pb-0'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-6 col-md-5 d-none d-sm-block'i><'col-sm-6 col-md-7'p>>",
            columnDefs: [
                { className: 'text-center', targets: [0, 6, 7, 8, 10, 11, 12, 13 ,14, 15, 16, 17, 18, 19] },
                { className: 'text-right', targets: [9] },
                { className: 'noVis', targets: [0, 19] },
                { visible: false, targets: [2, 5, 7, 8, 16] },
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
                    ShowLoader();
                    setTimeout(function () {
                        try {
                            self.genTableOverdue();
                        } catch (e) {
                            toastr['error'](e.message, _ALERT_TITLE_ERROR);
                        }
                        HideLoader();
                    }, 100);
                });
            },
            aoColumns: [
                { mData: null},
                { mData: 'taskName', mRender: function (data, type, row) { return mzGetDtTaskName(data, row['taskMainId']); }},
                { mData: 'mainTaskName'},
                { mData: null, mRender: function (data, type, row) { return refSpace[refFolder[row['folderId']]['spaceId']]['spaceName']; }},
                { mData: 'folderId', mRender: function (data) { return refFolder[data]['folderName']; }},
                { mData: 'taskDescription'}, // 5
                { mData: 'taskAssignee', mRender: function(data) { return mzGetDtAssignee(refUser[data]['userShortName'], refUser[data]['profileImage']); }},
                { mData: 'taskYear'},
                { mData: 'taskMonth', mRender: function (data) { return data >= 1 && data <= 12 ? monthArr[data]['monthName'] : ''; }},
                { mData: 'taskAmount', mRender: function (data) { return mzFormatNumber(data, 2);}},
                { mData: 'taskPriority', mRender: function (data) { return mzGetDtPriority(data); }},   // 10
                { mData: 'taskDateDue', mRender: function (data) { return mzDateDisplay(data); }},
                { mData: 'taskDateStart'},
                { mData: 'taskDateEnd'},
                { mData: 'progress', mRender: function (data) { return mzGetDtProgress(data); }},
                { mData: 'taskTimeEstimate'}, // 15
                { mData: 'timeSpent', mRender: function (data, type, row) { return mzGetDtRecordedTime(data, row['taskTimeEstimate']); }},
                { mData: 'lateness', mRender: function(data) { return mzGetDtLateness(data); }},
                { mData: 'statusId', mRender: function (data) { return mzGetDtStatus(refStatus[data]['statusName'], refStatus[data]['statusColor']); }},
                { mData: null, mRender: function (data, type, row, meta) { return mzGetDtAction(2, 'lnkLllOverdue', meta.row); }}
            ]
        });

        if (divWidth < 1160) { dtLllOverdue.column(14).visible(false); }
        if (divWidth < 1080) { dtLllOverdue.column(12).visible(false); dtLllOverdue.column(13).visible(false); }
        if (divWidth < 920) { dtLllOverdue.column(15).visible(false); }
        if (divWidth < 825) { dtLllOverdue.column(9).visible(false); }
        if (divWidth < 742) { dtLllOverdue.column(3).visible(false); }
        if (divWidth < 672) { dtLllOverdue.column(6).visible(false); }
        if (divWidth < 576) { dtLllOverdue.column(10).visible(false); }

        dtLllFuture = $('#dtLllFuture').DataTable({
            bLengthChange: false,
            bFilter: true,
            ordering: false,
            pageLength: 10,
            autoWidth: false,
            dom: "<'row'<'col-5 px-0 pb-2'B><'col-7 pb-0'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-6 col-md-5 d-none d-sm-block'i><'col-sm-6 col-md-7'p>>",
            columnDefs: [
                { className: 'text-center', targets: [0, 6, 7, 8, 10, 11, 12, 13 ,14, 15, 16, 17, 18] },
                { className: 'text-right', targets: [9] },
                { className: 'noVis', targets: [0, 18] },
                { visible: false, targets: [2, 5, 7, 8, 16] }
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
                    ShowLoader();
                    setTimeout(function () {
                        try {
                            self.genTableFuture();
                        } catch (e) {
                            toastr['error'](e.message, _ALERT_TITLE_ERROR);
                        }
                        HideLoader();
                    }, 100);
                });
            },
            aoColumns: [
                { mData: null},
                { mData: 'taskName', mRender: function (data, type, row) { return mzGetDtTaskName(data, row['taskMainId']); }},
                { mData: 'mainTaskName'},
                { mData: null, mRender: function (data, type, row) { return refSpace[refFolder[row['folderId']]['spaceId']]['spaceName']; }},
                { mData: 'folderId', mRender: function (data) { return refFolder[data]['folderName']; }},
                { mData: 'taskDescription'}, // 5
                { mData: 'taskAssignee', mRender: function(data) { return mzGetDtAssignee(refUser[data]['userShortName'], refUser[data]['profileImage']); }},
                { mData: 'taskYear'},
                { mData: 'taskMonth', mRender: function (data) { return data >= 1 && data <= 12 ? monthArr[data]['monthName'] : ''; }},
                { mData: 'taskAmount', mRender: function (data) { return mzFormatNumber(data, 2); }},
                { mData: 'taskPriority', mRender: function (data) { return mzGetDtPriority(data); }},   // 10
                { mData: 'taskDateDue', mRender: function (data) { return mzDateDisplay(data); }},
                { mData: 'taskDateStart'},
                { mData: 'taskDateEnd'},
                { mData: 'progress', mRender: function (data) { return mzGetDtProgress(data); }},
                { mData: 'taskTimeEstimate'}, // 15
                { mData: 'timeSpent', mRender: function (data, type, row) { return mzGetDtRecordedTime(data, row['taskTimeEstimate']); }},
                { mData: 'statusId', mRender: function (data) { return mzGetDtStatus(refStatus[data]['statusName'], refStatus[data]['statusColor']); }},
                { mData: null, mRender: function (data, type, row, meta) { return mzGetDtAction(2, 'lnkLllFuture', meta.row); }}
            ]
        });

        if (divWidth < 1068) { dtLllFuture.column(14).visible(false); }
        if (divWidth < 1000) { dtLllFuture.column(11).visible(false); }
        if (divWidth < 915) { dtLllFuture.column(9).visible(false); }
        if (divWidth < 860) { dtLllFuture.column(3).visible(false); }
        if (divWidth < 760) { dtLllFuture.column(15).visible(false); }
        if (divWidth < 680) { dtLllFuture.column(6).visible(false); }
        if (divWidth < 576) { dtLllFuture.column(10).visible(false); }

        dtLllUnscheduled = $('#dtLllUnscheduled').DataTable({
            bLengthChange: false,
            bFilter: true,
            ordering: false,
            pageLength: 10,
            autoWidth: false,
            dom: "<'row'<'col-5 px-0 pb-2'B><'col-7 pb-0'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-6 col-md-5 d-none d-sm-block'i><'col-sm-6 col-md-7'p>>",
            columnDefs: [
                { className: 'text-center', targets: [0, 6, 7, 8, 10, 11, 12, 13] },
                { className: 'text-right', targets: [9] },
                { className: 'noVis', targets: [0, 13] },
                { visible: false, targets: [7, 8] }
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
                    ShowLoader();
                    setTimeout(function () {
                        try {
                            self.genTableUnscheduled();
                        } catch (e) {
                            toastr['error'](e.message, _ALERT_TITLE_ERROR);
                        }
                        HideLoader();
                    }, 100);
                });
            },
            aoColumns: [
                { mData: null},
                { mData: 'taskName', mRender: function (data, type, row) { return mzGetDtTaskName(data, row['taskMainId']); }},
                { mData: 'mainTaskName'},
                { mData: null, mRender: function (data, type, row) { return refSpace[refFolder[row['folderId']]['spaceId']]['spaceName']; }},
                { mData: 'folderId', mRender: function (data) { return refFolder[data]['folderName']; }},
                { mData: 'taskDescription'}, // 5
                { mData: 'taskAssignee', mRender: function(data) { return mzGetDtAssignee(refUser[data]['userShortName'], refUser[data]['profileImage']); }},
                { mData: 'taskYear'},
                { mData: 'taskMonth'},
                { mData: 'taskAmount', mRender: function (data) { return mzFormatNumber(data, 2); }},
                { mData: 'taskPriority', mRender: function (data) { return mzGetDtPriority(data); }},   // 10
                { mData: 'taskTimeEstimate'},
                { mData: 'statusId', mRender: function (data) { return mzGetDtStatus(refStatus[data]['statusName'], refStatus[data]['statusColor']); }},
                { mData: null, mRender: function (data, type, row, meta) { return mzGetDtAction(1, 'lnkLllUnscheduled', meta.row); }}
            ]
        });

        if (divWidth < 1081) { dtLllUnscheduled.column(5).visible(false); }
        if (divWidth < 925) { dtLllUnscheduled.column(2).visible(false); }
        if (divWidth < 777) { dtLllUnscheduled.column(9).visible(false); }
        if (divWidth < 676) { dtLllUnscheduled.column(11).visible(false); }
        if (divWidth < 600) { dtLllUnscheduled.column(3).visible(false); }
        if (divWidth < 576) { dtLllUnscheduled.column(4).visible(false); }

        dtLllDone = $('#dtLllDone').DataTable({
            bLengthChange: false,
            bFilter: true,
            ordering: false,
            pageLength: 10,
            autoWidth: false,
            dom: "<'row'<'col-5 px-0 pb-2'B><'col-7 pb-0'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-6 col-md-5 d-none d-sm-block'i><'col-sm-6 col-md-7'p>>",
            columnDefs: [
                { className: 'text-center', targets: [0, 6, 7, 8, 10, 11, 12, 13 ,14, 15, 16, 17, 18, 19, 20, 21] },
                { className: 'text-right', targets: [9] },
                { className: 'noVis', targets: [0, 21] },
                { visible: false, targets: [2, 5, 13, 14, 15, 20] }
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
                    ShowLoader();
                    setTimeout(function () {
                        try {
                            self.genTableDone();
                        } catch (e) {
                            toastr['error'](e.message, _ALERT_TITLE_ERROR);
                        }
                        HideLoader();
                    }, 100);
                });
            },
            aoColumns: [
                { mData: null},
                { mData: 'taskName', mRender: function (data, type, row) { return mzGetDtTaskName(data, row['taskMainId']); }},
                { mData: 'mainTaskName'},
                { mData: null, mRender: function (data, type, row) { return refSpace[refFolder[row['folderId']]['spaceId']]['spaceName']; }},
                { mData: 'folderId', mRender: function (data) { return refFolder[data]['folderName']; }},
                { mData: 'taskDescription'}, // 5
                { mData: 'taskAssignee', mRender: function(data) { return mzGetDtAssignee(refUser[data]['userShortName'], refUser[data]['profileImage']); }},
                { mData: 'taskYear'},
                { mData: 'taskMonth', mRender: function (data) { return data !== null && data >= 1 && data <= 12 ? monthArr[data-1]['monthName'] : ''; }},
                { mData: 'taskAmount', mRender: function (data) { return mzFormatNumber(data, 2);}},
                { mData: 'taskPriority', mRender: function (data) { return mzGetDtPriority(data); }},   // 10
                { mData: 'taskDateDue', mRender: function (data) { return mzDateDisplay(data); }},
                { mData: 'taskDateClose', mRender: function (data) { return mzDateDisplay(data); }},
                { mData: 'taskDateStart'},
                { mData: 'taskDateEnd'},
                { mData: 'progress', mRender: function (data) { return mzGetDtProgress(data); }}, // 15
                { mData: 'taskTimeEstimate'},
                { mData: 'timeSpent', mRender: function (data, type, row) { return mzGetDtRecordedTime(data, row['taskTimeEstimate']); }},
                { mData: 'efficiency', mRender: function (data) { return mzGetDtEfficiency(data); }},
                { mData: 'lateness', mRender: function(data) { return mzGetDtLateness(data); }},
                { mData: 'statusId', mRender: function (data) { return mzGetDtStatus(refStatus[data]['statusName'], refStatus[data]['statusColor']); }}, // 20
                { mData: null, mRender: function (data, type, row, meta) { return mzGetDtAction(1, 'lnkLllDone', meta.row); }}
            ]
        });
        console.log(refUser);
        if (divWidth < 1238) { dtLllDone.column(7).visible(false); dtLllDone.column(8).visible(false); }
        if (divWidth < 1136) { dtLllDone.column(9).visible(false); }
        if (divWidth < 1084) { dtLllDone.column(10).visible(false); }
        if (divWidth < 1014) { dtLllDone.column(3).visible(false); }
        if (divWidth < 931) { dtLllDone.column(4).visible(false); }
        if (divWidth < 821) { dtLllDone.column(6).visible(false); }
        if (divWidth < 729) { dtLllDone.column(11).visible(false); }
        if (divWidth < 644) { dtLllDone.column(16).visible(false); }
        if (divWidth < 576) { dtLllDone.column(17).visible(false); }

        const dataApi = mzAjaxRequest('task/summary/all', 'GET');
        $('#spanLllTodayTotal').text(dataApi['totalToday']);
        $('#spanLllTodayOverdue').text(dataApi['totalOverdue']);
        $('#spanLllTodayFuture').text(dataApi['totalFuture']);
        $('#spanLllTodayUnscheduled').text(dataApi['totalUnscheduled']);
        $('#spanLllTodayDone').text(dataApi['totalDone']);
        self.genTableToday();
    };

    this.genTableToday = function () {
        const dataDb = mzAjaxRequest('task/list/today', 'GET');
        dtLllToday.clear().rows.add(dataDb).draw();
        $('#spanLllTodayTotal').text(dataDb.length);
    };

    this.genTableOverdue = function () {
        const dataDb = mzAjaxRequest('task/list/overdue', 'GET');
        dtLllOverdue.clear().rows.add(dataDb).draw();
        $('#spanLllTodayOverdue').text(dataDb.length);
    };

    this.genTableFuture = function () {
        const dataDb = mzAjaxRequest('task/list/future', 'GET');
        dtLllFuture.clear().rows.add(dataDb).draw();
        $('#spanLllTodayFuture').text(dataDb.length);
    };

    this.genTableUnscheduled = function () {
        const dataDb = mzAjaxRequest('task/list/unscheduled', 'GET');
        dtLllUnscheduled.clear().rows.add(dataDb).draw();
        $('#spanLllTodayUnscheduled').text(dataDb.length);
    };

    this.genTableDone = function () {
        const dataDb = mzAjaxRequest('task/list/done', 'GET');
        dtLllDone.clear().rows.add(dataDb).draw();
        $('#spanLllTodayDone').text(dataDb.length);
    };

    this.setRefStatus = function (_refStatus) {
        refStatus = _refStatus;
    }

    this.setRefUser = function (_refUser) {
        refUser = _refUser;
    }

    this.setRefSpace = function (_refSpace) {
        refSpace = _refSpace;
    }

    this.setRefFolder = function (_refFolder) {
        refFolder = _refFolder;
    }
}