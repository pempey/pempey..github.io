// JavaScript Document
$(function () {
	"use strict";
    $('#theChart').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: 'Dynamic Simulation Results'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: [
                '1',
                '2',
                '3',
                '4',
                '5'
            ],
            crosshair: true,
			title: {text: 'Simulation Year'}
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Revinue Growth (%)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">Simulation Year {point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Baseline',
            data: [0.2, 0.2, 0.2, 0.2, 0.2]

        }, {
            name: 'Service Completion',
            data: [0.836, 0.788, 0.985, 0.934, 1.060]

        },{
            name: 'Customer Service Calls',
            data: [0.499, 0.715, 1.064, 1.292, 1.440]

        }]
    });
});