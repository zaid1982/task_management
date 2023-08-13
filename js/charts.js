function mzCharts() {

    let classFrom;
    let refFlow;
    let refCheckpoint;
    let refStatus;
    let selectorCalendarPemeriksaan;
    let calendarMonthPemeriksaan;
    let dataCalendarPemeriksaan;

    this.pendaftaranTaskByType = function (chartId, dataSet) {
        try {
            let dataFlow = [];
            $.each(refFlow, function (index, row) {
                if (typeof row !== 'undefined' && row['flowModule'] === 'Pendaftaran') {
                    dataFlow[row['flowId']] = 0;
                }
            });
            $.each(dataSet, function (index, row) {
                if (typeof dataFlow[row['flowId']] !== 'undefined') {
                    dataFlow[row['flowId']]++;
                }
            });
            let data = [];
            $.each(dataFlow, function (index, row) {
                if (typeof row !== 'undefined' && row > 0) {
                    data.push({name: refFlow[index]['flowShort'], y: row});
                }
            });
            Highcharts.chart(chartId, {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Jenis Pendaftaran'
                },
                subtitle: {
                    text: 'Jumlah Mengikut Jenis'
                },
                yAxis: {
                    title: {
                        text: 'Jumlah Pendaftaran'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}:{point.y}',
                            distance: 2
                        },
                        showInLegend: false
                    },
                    series: {
                        point: {
                            events: {
                                click: function() {
                                    classFrom.filterTable(1, this.name);
                                }
                            }
                        }
                    }
                },/*
                colorAxis: {
                    visible: false
                },*/
                series: [
                    {
                        name: 'Jumlah',
                        innerSize: '35%',
                        data: data
                    }
                ],
                credits: {
                    enabled: false
                }
            });
        } catch (e) {
            toastr['error'](e.message, _ALERT_TITLE_ERROR);
        }
    };

    this.taskLateness = function (chartId, dataSet, isSubmitted) {
        try {
            let total3Day = 0;
            let total7Day = 0;
            let total1Week = 0;
            let total1Month = 0;
            $.each(dataSet, function (index, row) {
                if (typeof row !== 'undefined') {
                    if (parseInt(row['taskAge']) > 30) {
                        total1Month++;
                    } else if (parseInt(row['taskAge']) > 7) {
                        total1Week++;
                    } else if (parseInt(row['taskAge']) > 3) {
                        total7Day++;
                    } else if (parseInt(row['taskAge']) <= 3) {
                        total3Day++;
                    }
                }
            });
            Highcharts.chart(chartId, {
                chart: {
                    type: 'bar'//,
                    //plotBackgroundImage: 'https://www.highcharts.com/samples/graphics/sand.png'
                },
                title: {
                    text: (isSubmitted?'Sejarah Kelewatan':'Status Kelewatan')
                },
                subtitle: {
                    text: (isSubmitted?'Tempoh Tugasan Diproses':'Tempoh Tugasan Diterima')
                },
                xAxis: {
                    categories: ['3 hari', '>3 hari', '>seminggu', '>sebulan']
                },
                yAxis: {
                    title: {
                        text: 'Jumlah'
                    }
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: [
                    {
                        data: [
                            {y: total3Day, color :'green'},
                            {y: total7Day, color :'yellow'},
                            {y: total1Week, color :'orange'},
                            {y: total1Month, color :'red'}
                        ]
                    }
                ],
                credits: {
                    enabled: false
                }
            });
        } catch (e) {
            toastr['error'](e.message, _ALERT_TITLE_ERROR);
        }
    };

    this.progressKpi = function (chartId, dataSet) {
        try {
            let progressSelector = $('#'+chartId);
            progressSelector.html('');
            for (let i=0; i<dataSet.length; i++) {
                const kpi = dataSet[i]['kpi'];
                const dayProcess = dataSet[i]['dayProcess'];
                const status = dataSet[i]['status'];
                if (kpi !== '') {
                    const percKpi = parseInt(dayProcess)/parseInt(kpi);
                    let progressColor = 'red';
                    if (percKpi === 1) {
                        progressColor = 'light-green';
                    } else if (percKpi < 0.5) {
                        progressColor = 'green darken-4';
                    } else if (percKpi < 1) {
                        progressColor = 'green';
                    }
                    let statusName = refCheckpoint[dataSet[i]['checkpointId']]['checkpointShort'];
                    if (status === '57' || status === '58' || status === '59' || status === '60' || status === '61') {
                        statusName = refStatus[status]['statusDesc'];
                    }
                    progressSelector.append(
                        $('<p/>').addClass('mb-0 font-small').html('<strong>'+statusName+'</strong> - '+dayProcess+' hari<span class="float-right">KPI '+kpi+' hari</span>')
                    ).append(
                        $('<div/>').addClass('progress md-progress mb-2').css('height', '20px').append(
                            $('<div/>').addClass('progress-bar progress-bar-striped progress-bar-animated '+progressColor).attr('role', 'progressbar').css('width', (percKpi*100)+'%').css('height', '20px').attr('aria-valuenow',percKpi*100).attr('aria-valuemin',0).attr('aria-valuemax',100)
                        )
                    );
                }
            }
        } catch (e) {
            toastr['error'](e.message, _ALERT_TITLE_ERROR);
        }
    };

    this.aduanPenyiasatTask = function (chartId, officerType, taskType) {
        try {
            const d = new Date();
            const fullYear = d.getFullYear();
            let dataChart;
            if (officerType === 'Pegawai Siasatan') {
                dataChart = mzAjaxRequest('aduan/penyiasat_task/', 'GET');
            } else if (officerType === 'IO') {
                dataChart = mzAjaxRequest('case/io_task/', 'GET');
            } else if (officerType === 'RO') {
                dataChart = mzAjaxRequest('case/ro_task/', 'GET');
            } else if (officerType === 'Pegawai Pemeriksa') {
                dataChart = mzAjaxRequest('inspection/pemeriksa_task/', 'GET');
            } else {
                throw new Error(_ALERT_MSG_ERROR_DEFAULT);
            }
            let penyiasatName = [];
            let taskAssigned = [];
            let taskInProgress = [];
            $.each(dataChart, function (index, row) {
                if (officerType === 'Pegawai Siasatan') {
                    penyiasatName.push(row['aduanPenyiasatName']);
                } else if (officerType === 'IO') {
                    penyiasatName.push(row['caseIoName']);
                } else if (officerType === 'RO') {
                    penyiasatName.push(row['caseRoName']);
                } else if (officerType === 'Pegawai Pemeriksa') {
                    penyiasatName.push(row['pemeriksaName']);
                }
                taskAssigned.push(parseInt(row['totalAssigned']));
                taskInProgress.push(parseInt(row['totalInProgress']));
            });
            Highcharts.chart(chartId, {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Tugasan Semasa '+officerType
                },
                subtitle: {
                    text: 'Jumlah Dilantik ('+fullYear+')'
                },
                xAxis: {
                    categories: penyiasatName
                },
                yAxis: {
                    title: {
                        text: 'Jumlah '+taskType
                    }
                },
                legend: {
                    enabled: true
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true
                        },
                        point: {
                            events: {
                                click: function() {
                                    classFrom.filterTable(1, this.category);
                                }
                            }
                        }
                    }
                },
                //colorAxis: {
                //    visible: false
                //},

                series: [
                    {
                        name: 'Ditugaskan',
                        data: taskAssigned
                    },
                    {
                        name: 'Dalam Proses',
                        data: taskInProgress
                    }
                ],
                credits: {
                    enabled: false
                }
            });
        } catch (e) {
            toastr['error'](e.message, _ALERT_TITLE_ERROR);
        }
    };

    this.genPemeriksaanCalendar = function (id) {
        selectorCalendarPemeriksaan = $('#'+id);
        const todayDate = moment(); //moment('2020/2/1', 'YYYY/M/DD');
        calendarMonthPemeriksaan = moment(todayDate.format('YYYY')+'-'+todayDate.format('MM'));
        this.displayPemeriksaanCalendar();
        this.displayPemeriksaanCalendarDetails(todayDate.format('YYYY-MM-DD'));
    };

    this.nextMonthPemeriksaan = function () {
        calendarMonthPemeriksaan.add(1, 'month');
        this.displayPemeriksaanCalendar();
    };

    this.previousMonthPemeriksaan = function () {
        calendarMonthPemeriksaan.subtract(1, 'month');
        this.displayPemeriksaanCalendar();
    };

    this.setDataPemeriksaanCalendar =  function () {
        const dataDb = mzAjaxRequest('inspection_pengguna/list_monthly/'+calendarMonthPemeriksaan.format('YYYY')+'/'+calendarMonthPemeriksaan.format('M'), 'GET');
        dataCalendarPemeriksaan = {};
        $.each(dataDb, function(n, u) {
            let thisDateArr = [];
            if (typeof dataCalendarPemeriksaan[u['inspectionPenggunaScheduleDate']] !== 'undefined') {
                thisDateArr = dataCalendarPemeriksaan[u['inspectionPenggunaScheduleDate']];
            }
            thisDateArr.push(u);
            dataCalendarPemeriksaan[u['inspectionPenggunaScheduleDate']] = thisDateArr;
        });
    };

    this.displayPemeriksaanCalendarDetails = function (_date){
        const selectedDate = moment(_date, 'YYYY-MM-DD');
        let selectorDetails = $('#divPemeriksaanCalendarDetails');
        selectorDetails.html('');
        selectorDetails.append(
            $('<h6/>').addClass('mt-2 mb-4 font-weight-bold').text(selectedDate.format('D MMMM YYYY'))
        );
        if (typeof dataCalendarPemeriksaan[_date] === 'undefined') {
            selectorDetails.append(
                $('<p/>').addClass('font-italic text-muted mt-0').text('- Tiada Pemeriksaan')
            );
        } else {
            $.each(dataCalendarPemeriksaan[_date], function(n, u) {
                if (u['inspectionPenggunaStatus'] === '19') {
                    selectorDetails.append(
                        $('<div/>').addClass('form-check teal-checkbox pl-0 mb-1').append(
                            $('<input/>').attr('type', 'checkbox').addClass('form-check-input filled-in').attr('id', 'chkPemeriksaanCalendarCompany'+n).attr('disabled', 'true')
                        ).append(
                            $('<label/>').addClass('form-check-label').attr('for', 'chkPemeriksaanCalendarCompany'+n).text(u['inspectionPenggunaName'])
                        )
                    );
                } else {
                    selectorDetails.append(
                        $('<div/>').addClass('form-check teal-checkbox pl-0 mb-1').append(
                            $('<input/>').attr('type', 'checkbox').addClass('form-check-input filled-in').attr('id', 'chkPemeriksaanCalendarCompany'+n).attr('checked', 'true').attr('disabled', 'true')
                        ).append(
                            $('<label/>').addClass('form-check-label').attr('for', 'chkPemeriksaanCalendarCompany'+n).text(u['inspectionPenggunaName'])
                        )
                    );
                }
            });
        }
        selectorDetails.show();
    };

    this.displayPemeriksaanCalendar = function () {
        this.setDataPemeriksaanCalendar();
        selectorCalendarPemeriksaan.html('');
        const days = Array.from({length: calendarMonthPemeriksaan.daysInMonth()}, (x, i) => moment().startOf('month').add(i, 'days').format('D'));
        let selectorDate = $('<ul/>').addClass('list-unstyled days');
        const startMonth = calendarMonthPemeriksaan.startOf('month').format('d');
        for (let i=0; i<parseInt(startMonth); i++) {
            selectorDate.append($('<li/>').text(''));
        }
        $.each(days, function(n, u) {
            const thisDate = moment(calendarMonthPemeriksaan.format('YYYY')+'-'+calendarMonthPemeriksaan.format('MM')+'-'+u, 'YYYY-MM-D');
            if (typeof dataCalendarPemeriksaan[thisDate.format('YYYY-MM-DD')] !== 'undefined') {
                selectorDate.append($('<li/>').addClass('active pink darken-3 rounded-left rounded-right').attr('onclick', 'mzChartsClass_.displayPemeriksaanCalendarDetails("'+thisDate.format('YYYY-MM-DD')+'");').html('<a>'+u+'</a>'));
            } else {
                selectorDate.append($('<li/>').text(u));
            }
        });

        selectorCalendarPemeriksaan.append(
            $('<div/>').addClass('card-body rounded-top white-text pr-0').append(
                $('<h6/>').addClass('font-weight-bold text-center text-white mt-0 mb-3').html('<a><i class="fas fa-chevron-circle-left mr-3" onclick="mzChartsClass_.previousMonthPemeriksaan();"></i></a>Jadual Pemeriksaan<a><i class="fas fa-chevron-circle-right ml-3" onclick="mzChartsClass_.nextMonthPemeriksaan();"></i></a>')
            ).append(
                $('<div/>').addClass('my-0').append(
                    $('<ul/>').addClass('list-unstyled d-flex justify-content-between mr-4 mb-0').append(
                        $('<li/>').addClass('h6').text(calendarMonthPemeriksaan.format('MMMM'))
                    ).append(
                        $('<li/>').addClass('text-white-50').text(calendarMonthPemeriksaan.format('YYYY'))
                    )
                )
            ).append(
                $('<ul/>').addClass('list-unstyled weekdays text-white-50 my-0').append(
                    $('<li/>').text('Ahd')
                ).append(
                    $('<li/>').text('Isn')
                ).append(
                    $('<li/>').text('Sel')
                ).append(
                    $('<li/>').text('Rab')
                ).append(
                    $('<li/>').text('Kha')
                ).append(
                    $('<li/>').text('Jum')
                ).append(
                    $('<li/>').text('Sab')
                )
            ).append(
                selectorDate
            )
        ).append(
            $('<div/>').addClass('card card-form-2 red lighten-5').append(
                $('<div/>').addClass('card-body').attr('id', 'divPemeriksaanCalendarDetails')
            )
        );
        $('#divPemeriksaanCalendarDetails').hide();
    };

    this.setClassFrom = function (_classFrom) {
        classFrom = _classFrom;
    };

    this.setRefFlow = function (_refFlow) {
        refFlow = _refFlow;
    };

    this.setRefCheckpoint = function (_refCheckpoint) {
        refCheckpoint = _refCheckpoint;
    };

    this.setRefStatus = function (_refStatus) {
        refStatus = _refStatus;
    };
}