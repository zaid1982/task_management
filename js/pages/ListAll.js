function ListAll() {

    const className = 'ListAll';
    let self = this;
    let dtLllToday;
    let dtLllOverdue;
    let dtLllFuture;
    let refStatus;
    let refUser;
    let refSpace;
    let refFolder;
    let isGetOverdue = false;
    let isGetFuture = false;
    let isGetUnscheduled = false;
    let isGetDone = false;
    const divWidth = $('#divLllToday').width();

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
                { extend: 'print', className: 'btn btn-outline-blue-grey btn-sm px-2 z-depth-2', text:'<i class="fas fa-print"></i>', title:'Task Management System - All Task Overdue List', titleAttr: 'Print', exportOptions: mzExportOpt},
                { extend: 'copy', className: 'btn btn-outline-blue btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-copy"></i>', title:'Task Management System - All Task Overdue List', titleAttr: 'Copy', exportOptions: mzExportOpt},
                { extend: 'excelHtml5', className: 'btn btn-outline-green btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-file-excel"></i>', title:'Task Management System - All Task Overdue List', titleAttr: 'Excel', exportOptions: mzExportOpt},
                { extend: 'pdfHtml5', className: 'btn btn-outline-red btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-file-pdf"></i>', title:'Task Management System - All Task Overdue List', titleAttr: 'PDF', orientation: 'landscape', exportOptions: mzExportOpt},
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
                { mData: 'taskName'},
                { mData: 'mainTaskName'},
                { mData: null, mRender: function (data, type, row) { return refSpace[refFolder[row['folderId']]['spaceId']]['spaceName']; }},
                { mData: 'folderId', mRender: function (data) { return refFolder[data]['folderName']; }},
                { mData: 'taskDescription'}, // 5
                { mData: 'taskAssignee', mRender: function(data) { return mzGetDtAssignee(refUser[data]['userShortName'], refUser[data]['profileImage']); }},
                { mData: 'taskYear'},
                { mData: 'taskMonth'},
                { mData: 'taskAmount', mRender: function (data) { return mzFormatNumber(data, 2); }},
                { mData: 'taskPriority', mRender: function (data) { return mzGetDtPriority(data); }},   // 10
                { mData: 'taskDateDue', mRender: function (data) { return mzDateDisplay(data); }},
                { mData: 'taskDateStart'},
                { mData: 'taskDateEnd'},
                { mData: 'progress', mRender: function (data) { return mzGetDtProgress(data); }},
                { mData: 'taskTimeEstimate'}, // 15
                { mData: 'timeSpent'},
                { mData: 'statusId', mRender: function (data) { return mzGetDtStatus(refStatus[data]['statusName'], refStatus[data]['statusColor']); }},
                { mData: null, mRender: function (data, type, row, meta) { return mzGetDtAction(2, 'lnkLllOverduePdf', meta.row); }}
            ]
        });

        if (divWidth < 1068) { dtLllToday.column(14).visible(false); }
        if (divWidth < 1000) { dtLllToday.column(11).visible(false); }
        if (divWidth < 915) { dtLllToday.column(9).visible(false); }
        if (divWidth < 860) { dtLllToday.column(3).visible(false); }
        if (divWidth < 760) { dtLllToday.column(15).visible(false); }
        if (divWidth < 680) { dtLllToday.column(6).visible(false); }
        if (divWidth < 576) { dtLllToday.column(10).visible(false); }
        if (divWidth < 525) { dtLllToday.column(17).visible(false); }

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
                { type: 'extract-date', targets: [11] }
            ],
            buttons: [
                { extend: 'colvis', columns: ':not(.noVis)', fade: 400, collectionLayout: 'four-column', text:'<i class="fas fa-columns"></i>', className: 'btn btn-outline-grey btn-sm px-2 ml-0 z-depth-2', titleAttr: 'Column'},
                { extend: 'print', className: 'btn btn-outline-blue-grey btn-sm px-2 z-depth-2', text:'<i class="fas fa-print"></i>', title:'Task Management System - All Task Overdue List', titleAttr: 'Print', exportOptions: mzExportOpt},
                { extend: 'copy', className: 'btn btn-outline-blue btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-copy"></i>', title:'Task Management System - All Task Overdue List', titleAttr: 'Copy', exportOptions: mzExportOpt},
                { extend: 'excelHtml5', className: 'btn btn-outline-green btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-file-excel"></i>', title:'Task Management System - All Task Overdue List', titleAttr: 'Excel', exportOptions: mzExportOpt},
                { extend: 'pdfHtml5', className: 'btn btn-outline-red btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-file-pdf"></i>', title:'Task Management System - All Task Overdue List', titleAttr: 'PDF', orientation: 'landscape', exportOptions: mzExportOpt},
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
                { mData: 'taskName'},
                { mData: 'mainTaskName'},
                { mData: null, mRender: function (data, type, row) { return refSpace[refFolder[row['folderId']]['spaceId']]['spaceName']; }},
                { mData: 'folderId', mRender: function (data) { return refFolder[data]['folderName']; }},
                { mData: 'taskDescription'}, // 5
                { mData: 'taskAssignee', mRender: function(data) { return mzGetDtAssignee(refUser[data]['userShortName'], refUser[data]['profileImage']); }},
                { mData: 'taskYear'},
                { mData: 'taskMonth'},
                { mData: 'taskAmount', mRender: function (data) { return mzFormatNumber(data, 2);}},
                { mData: 'taskPriority', mRender: function (data) { return mzGetDtPriority(data); }},   // 10
                { mData: 'taskDateDue', mRender: function (data) { return mzDateDisplay(data); }},
                { mData: 'taskDateStart'},
                { mData: 'taskDateEnd'},
                { mData: 'progress', mRender: function (data) { return mzGetDtProgress(data); }},
                { mData: 'taskTimeEstimate'}, // 15
                { mData: 'timeSpent'},
                { mData: 'lateness', mRender: function(data) { return mzGetDtLateness(data); }},
                { mData: 'statusId', mRender: function (data) { return mzGetDtStatus(refStatus[data]['statusName'], refStatus[data]['statusColor']); }},
                { mData: null, mRender: function (data, type, row, meta) { return mzGetDtAction(2, 'lnkLllOverduePdf', meta.row); }}
            ]
        });

        if (divWidth < 1160) { dtLllOverdue.column(14).visible(false); }
        if (divWidth < 1080) { dtLllOverdue.column(12).visible(false); dtLllOverdue.column(13).visible(false); }
        if (divWidth < 920) { dtLllOverdue.column(15).visible(false); }
        if (divWidth < 825) { dtLllOverdue.column(9).visible(false); }
        if (divWidth < 742) { dtLllOverdue.column(3).visible(false); }
        if (divWidth < 672) { dtLllOverdue.column(6).visible(false); }
        if (divWidth < 576) { dtLllOverdue.column(10).visible(false); }

        self.genTableToday();
    };

    this.genTableToday = function () {
        const dataDb = mzAjaxRequest('task/list/today', 'GET');
        dtLllToday.clear().rows.add(dataDb).draw();
    };

    this.genTableOverdue = function () {
        const dataDb = mzAjaxRequest('task/list/overdue', 'GET');
        dtLllOverdue.clear().rows.add(dataDb).draw();
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