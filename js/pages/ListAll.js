function ListAll() {

    const className = 'ListAll';
    let self = this;
    let oTableLllOverdue;
    let refStatus;
    let refUser;
    let refSpace;
    let refFolder;

    this.init = function () {
        $('#divLllOverdue').on('shown.bs.collapse', function () {
            console.log(1);
        });
        $('#divLllToday').on('shown.bs.collapse', function () {
            console.log(2);
        });

        oTableLllOverdue = $('#dtLllOverdue').DataTable({
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
                { visible: false, targets: [2, 5, 7, 8, 14, 17, 19] },
                { type: 'extract-date', targets: [11] }
            ],
            buttons: [
                { extend: 'colvis', columns: ':not(.noVis)', fade: 400, collectionLayout: 'four-column', text:'<i class="fas fa-columns"></i>', className: 'btn btn-outline-grey btn-sm px-2 ml-0 z-depth-2', titleAttr: 'Column'},
                { extend: 'print', className: 'btn btn-outline-blue-grey btn-sm px-2 z-depth-2', text:'<i class="fas fa-print"></i>', title:'Task Management System - All Task Overdue List', titleAttr: 'Print', exportOptions: mzExportOpt},
                { extend: 'copy', className: 'btn btn-outline-blue btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-copy"></i>', title:'Task Management System - All Task Overdue List', titleAttr: 'Copy', exportOptions: mzExportOpt},
                { extend: 'excelHtml5', className: 'btn btn-outline-green btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-file-excel"></i>', title:'Task Management System - All Task Overdue List', titleAttr: 'Excel', exportOptions: mzExportOpt},
                { extend: 'pdfHtml5', className: 'btn btn-outline-red btn-sm px-2 ml-0 z-depth-2', text:'<i class="fas fa-file-pdf"></i>', title:'Task Management System - All Task Overdue List', titleAttr: 'PDF', orientation: 'landscape', exportOptions: mzExportOpt}
            ],
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = $(this).DataTable().page.info();
                $('td', nRow).eq(0).html(info.start + (iDisplayIndex + 1));
            },
            drawCallback: function () {
                $('[data-toggle="tooltip"]').tooltip();
                if ($('#divLllOverdue').width() < 880) {
                    $(this).DataTable().column(1).visible(false);
                }
            },
            aoColumns: [
                { mData: null},
                { mData: 'taskName'},
                { mData: 'mainTaskName'},
                { mData: null,
                    mRender: function (data, type, row) {
                        const folderId = row['folderId'];
                        const spaceId = refFolder[folderId]['spaceId'];
                        return refSpace[spaceId]['spaceName'];
                    }
                },
                { mData: 'folderId', mRender: function (data) {
                        return refFolder[data]['folderName'];
                    }},
                { mData: 'taskDescription'}, // 5
                { mData: 'taskAssignee', mRender: function(data) {
                        return '<div class="chip chip-sm m-0 z-depth-1"><img src="api/'+refUser[data]['profileImage']+'">'+refUser[data]['userShortName']+'</div>';
                    }},
                { mData: 'taskYear'},
                { mData: 'taskMonth'},
                { mData: 'taskAmount', mRender: function (data) {
                        return mzFormatNumber(data, 2);
                    }},
                { mData: 'taskPriority',
                    mRender: function (data) {
                        let color = 'blue-text';
                        if (data === 'Urgent') {
                            color = 'red-text';
                        } else if (data === 'High') {
                            color = 'orange-text';
                        } else if (data === 'Low') {
                            color = 'light-green-text';
                        }
                        return '<span class="'+color+'">'+data+'</span>';
                    }
                },   // 10
                { mData: 'taskDateDue', mRender: function (data) {
                        return mzDateDisplay(data);
                    }},
                { mData: 'taskDateStart'},
                { mData: 'taskDateEnd'},
                { mData: 'taskDateClose'},
                { mData: 'progress', mRender: function (data) {
                        return '<div class="progress md-progress mb-0 grey lighten-2 z-depth-1" style="height: 18px">' +
                            '<div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: '+data+'%; height: 18px" aria-valuenow="'+data+'" aria-valuemin="0" aria-valuemax="100">'+data+'%</div>' +
                            '</div>';
                    }},  // 15
                { mData: 'taskTimeEstimate'},
                { mData: 'timeSpent'},
                { mData: 'lateness',
                    mRender: function(data) {
                        const days = data < 0 ? -data : data;
                        const color = data < 0 ? 'red darken-1' : 'teal lighten-2';
                        const dayTerm = data === 0 || data === 1 ? ' day' : ' days';
                        return '<a class="badge badge-pill '+color+' z-depth-1-half">'+days+' '+dayTerm+'</a>';
                    }
                },
                { mData: 'efficiency'},
                { mData: 'statusId', mRender: function (data) {
                        return '<a class="badge '+refStatus[data]['statusColor']+' z-depth-2">'+refStatus[data]['statusName']+'</a>';
                    }}, // 20
                { mData: null,
                    mRender: function (data, type, row, meta) {
                        return '<a><i class="fa-regular fa-pen-to-square fa-fade fa-lg lnkLllOverduePdf mr-1" id="lnkLllOverduePdf_' + meta.row + '" data-toggle="tooltip" data-placement="top" title="Edit"></i></a>' +
                            '<a><i class="fa-regular fa-circle-play fa-fade fa-lg lnkLllOverduePdf" id="lnkLllOverduePdf_' + meta.row + '" data-toggle="tooltip" data-placement="top" title="Start Record"></i></a>';
                    }
                }
            ]
        });

        self.genTableOverdue();
    };

    this.genTableOverdue = function () {
        const dataDb = mzAjaxRequest('task/list/overdue', 'GET');
        console.log(dataDb);
        oTableLllOverdue.clear().rows.add(dataDb).draw();
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