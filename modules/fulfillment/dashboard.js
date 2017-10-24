Fulfillment.prototype.getChartPrintingData = function () {
    $.ajax({
        url: this.backendurl,
        type: "GET",
        dataType: 'json',
        data: {
            cmd: 'getChartPrintingData',
            start: this.date_start,
            end: this.date_end
        },
        success: function (data) {
            var categories = [];
            var denied = {
                name: 'Denied printing',
                data: [],
                color: '#ebf5fa'
            };
            var approved = {
                name: 'Approved printing',
                data: [],
                color: '#b4e1fa'
            };
            var printed = {
                name: 'Printed order',
                data: [],
                color: '#1498ea'
            };
            var waiting = {
                name: 'Waiting for printing',
                data: [],
                color: '#084e8a'
            };
            var printing = {
                name: 'Printing order',
                data: [],
                color: '#364760'
            };
            $.each(data, function (i, row) {
                categories.push(i);
                denied.data.push(row[4]);
                approved.data.push(row[3]);
                printed.data.push(row[1]);
                waiting.data.push(row[0]);
                printing.data.push(row[2]);
            });

            Highcharts.chart('printing_statistics', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: categories
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white'
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series: [denied, approved, printed, waiting, printing]
            });
        },
        error: function () {
            openModalError();
        }
    });
};

Fulfillment.prototype.getChartShippingData = function () {
    $.ajax({
        url: this.backendurl,
        type: "GET",
        dataType: 'json',
        data: {
            cmd: 'getChartShippingData',
            start: this.date_start,
            end: this.date_end
        },
        success: function (data) {
            var categories = [];
            var waiting = {
                name: 'Awaiting for shipping',
                data: [],
                color: '#364760'
            };
            var processing = {
                name: 'Submited to shipper',
                data: [],
                color: '#084e8a'
            };
            var shipping = {
                name: 'Shipping',
                data: [],
                color: '#1498ea'
            };
            var failure = {
                name: 'Returned',
                data: [],
                color: '#ebf5fa'
            };
            var delivered = {
                type: 'line',
                name: 'Success rate',
                data: [],
                marker: {
                    enabled: false,
                    lineWidth: 0,
                    lineColor: Highcharts.getOptions().colors[3],
                    fillColor: '#03be5b'
                }
            };
            $.each(data, function (i, row) {
                categories.push(i);
                waiting.data.push(row[0]);
                processing.data.push(row[2]);
                shipping.data.push(row[1]);
                failure.data.push(row[4]);
                delivered.data.push(row[3]);
            });

            Highcharts.chart('shipping_statistics', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: categories,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white'
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },

                series: [waiting, processing, shipping, failure, delivered]
            });
        },
        error: function () {
            openModalError();
        }
    });
};

Fulfillment.prototype.genKnobChart = function () {
    var gaugeOptions = {
        chart: {
            type: 'solidgauge',
            margin: [0, 0, 0, 0]
        },
        title: null,
        pane: {
            center: ['50%', '50%'],
            size: '100%',
            startAngle: -135,
            endAngle: 225,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#FFF',
                borderWidth: 0
            }
        },
        tooltip: {
            enabled: false
        },
        // the value axis
        xAxis: {
            minPadding: 0,
            maxPadding: 0
        },
        yAxis: {
            minPadding: 0,
            maxPadding: 0,
            stops: [
                [0.1, '#cfcfcf'], // green
                [0.5, '#cfcfcf'], // yellow
                [0.9, '#cfcfcf'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                enabled: false
            }
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: -20,
                    borderWidth: 0,
                    useHTML: true
                },
                lineWidth: 5
            }
        }
    };

    $.each($('.chart-rate'), function (i, item) {
        // The speed gauge
        var valpenc = parseInt($(this).text()) * 180 / 100;
        $(this).highcharts(Highcharts.merge(gaugeOptions, {
            yAxis: {
                min: 0,
                max: 200,
                title: {
                    text: 'Speed'
                }
            },

            credits: {
                enabled: false
            },
            series: [{
                name: 'Speed',
                data: [{
                    color: Highcharts.getOptions().colors[0],
                    radius: '100%',
                    innerRadius: '60%',
                    y: valpenc
                }],
                dataLabels: {
                    format: '&nbsp;'
                }
            }]
        }));
    });
};


Fulfillment.prototype.getChartOrderData = function () {
    var myjs = this;
    $.ajax({
        url: this.backendurl,
        type: "GET",
        dataType: 'json',
        data: {
            cmd: 'getChartOrderData',
            start: this.date_start,
            end: this.date_end,
            state: this.state
        },
        success: function (data) {
            if (data.result) {
                var label = [];
                var chart_data = [];
                $.each(data.result, function (i, row) {
                    label.push(row.CREATE_DATE);
                    chart_data.push(parseInt(row.TOTAL_ORDER));
                });
                Highcharts.chart('overview', {
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: ' '
                    },
                    xAxis: {
                        categories: label
                    },
                    yAxis: {
                        title: {
                            text: ''
                        }
                    },
                    legend: {
                        align: 'left',
                        x: 0,
                        verticalAlign: 'top',
                        y: 0,
                        floating: true,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white'
                    },
                    tooltip: {
                        headerFormat: '',
                        pointFormat: '<b>{point.y}</b><br>Order items',
                        footerFormat: '',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                            marker: {
                                enabled: false,
                                radius: 5,
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            },
                            lineWidth: 4,
                            states: {
                                hover: {
                                    lineWidth: 4
                                }
                            },
                            threshold: null
                        }
                    },

                    series: [{
                        type: 'area',
                        name: myjs.custom['namechar'],
                        data: chart_data,
                        color: '#6CC917'
                    }]
                });
            }
        },
        error: function () {
            openModalError();
        }
    });
};

Fulfillment.prototype.getFulfillmentData = function () {
    var myjs = this;
    $.ajax({
        url: this.backendurl,
        type: "GET",
        dataType: 'json',
        data: {
            cmd: 'getFulfillmentData',
            startdate: this.date_start,
            enddate: this.date_end
        },
        success: function (data) {
            $('#p-awaiting').text(data[0]);
            $('#p-fulfilled').text(data[1]);
            $('#p-fulfilled-revenue').text(data[2]);
            $('#p-fail').text(data[3]);
            if ((data[0] + data[1] + data[3]) > 0) {
                var awaitingrate = data[0] / (data[0] + data[1] + data[3]) * 100;
                $('#awaiting-rate').text(awaitingrate.toFixed(2));
                $('#awaiting-rate-text').text(awaitingrate.toFixed(2) + '%');

                var fulfilledrate = data[1] / (data[0] + data[1] + data[3]) * 100;
                $('#fulfilled-rate').text(fulfilledrate.toFixed(2));
                $('#fulfilled-rate-text').text(fulfilledrate.toFixed(2) + '%');

                var failrate = data[3] / (data[0] + data[1] + data[3]) * 100;
                $('#fail-rate').text(failrate.toFixed(2));
                $('#fail-rate-text').text(failrate.toFixed(2) + '%');
            }
            myjs.genKnobChart();
        },
        error: function () {
            openModalError();
        }
    });
};

Fulfillment.prototype.setupdash = function () {
    var myjs = this;
    $('.list-button li').on('click', function () {
        $('.list-button li').removeClass('select');
        $(this).addClass('select');
        var stt = $(this).attr('id');
        if (stt && stt !== '' && stt !== myjs.state) {
            myjs.state = stt;
            myjs.custom['namechar'] = $(this).attr('dataname');
            myjs.getChartOrderData();
        }
    });

    $('.list-button-date li').on('click', function () {
        $('.list-button-date li').removeClass('select');
        $(this).addClass('select');
    });
};

Fulfillment.prototype.getData = function () {
    this.getFulfillmentData();
    this.getChartOrderData();
    this.getChartPrintingData();
    this.getChartShippingData();
};

var obj_dashboard = new Fulfillment();
(function ($, AdminLTE) {
    obj_dashboard.init('dashboard');
    obj_dashboard.custom['namechar'] = 'Awaiting for fulfillment';
    obj_dashboard.setupdash();
})(jQuery, $.AdminLTE);