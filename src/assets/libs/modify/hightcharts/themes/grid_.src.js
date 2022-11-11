/**
 * @license Highcharts JS v6.0.4 (2017-12-15)
 *
 * (c) 2009-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
(function(factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory;
    } else {
        factory(Highcharts);
    }
}(function(Highcharts) {
    (function(Highcharts) {
        /**
         * (c) 2010-2017 Torstein Honsi
         *
         * License: www.highcharts.com/license
         * 
         * Grid theme for Highcharts JS
         * @author Torstein Honsi
         */

        Highcharts.theme = {
            // colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
            //     '#FF9655', '#FFF263', '#6AF9C4'
            // ],
            chart: {
                backgroundColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 1,
                        y2: 1
                    },
                    stops: [
                        [0, '#fff'],
                        [1, 'rgb(240, 240, 250)']
                    ]
                },
                borderWidth: 2,
                borderColor: '#666',
                plotBackgroundColor: 'rgba(255, 255, 255, .9)',
                plotShadow: true,
                plotBorderWidth: 1,
                plotBorderColor: '#666',
                style: {
                    fontFamily: ' sans-serif, Verdana,'
                },
            },
            title: {
                style: {
                    color: '#4A5370',
                    textTransform: 'uppercase',
                    font: ' 18px',
                    fontWeight: 'bold'
                }
            },
            subtitle: {
                style: {
                    color: '#666666',
                    font: '14px ',
                    fontWeight: 'bold'
                }
            },
            xAxis: {
                gridLineWidth: 1,
                gridLineColor: '#70707344',
                lineColor: '#333',
                tickColor: '#333',
                labels: {
                    style: {
                        color: '#444449',
                        font: '12px '
                    }
                },
                title: {
                    style: {
                        color: '#666',
                    }
                }
            },
            yAxis: {
                // minorTickInterval: 'auto',
                gridLineColor: '#707073aa',
                gridLineWidth: 1,
                lineColor: '#333',
                lineWidth: 1,
                tickWidth: 1,
                tickColor: '#333',
                labels: {
                    style: {
                        color: '#444449',
                        font: '12px '
                    }
                },
                title: {
                    style: {
                        color: '#666',
                        fontWeight: 'bold',
                        fontSize: '14px',
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(40, 40, 50, 0.7)',
                borderWidth: 2,
                style: {
                    color: '#F0F0F0'
                }
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        color: '#39393e'
                    },
                    // marker: {
                    //     // lineColor: ''
                    //     lineWidth: 8,
                    //     lineColor: 'auto',
                    // }
                },
                boxplot: {
                    fillColor: '#505053'
                },
                candlestick: {
                    lineColor: 'white'
                },
                errorbar: {
                    color: 'white'
                }
            },
            legend: {
                itemStyle: {
                    font: '9pt Trebuchet MS, Verdana, sans-serif',
                    color: 'black'

                },
                itemHoverStyle: {
                    color: '#039'
                },
                itemHiddenStyle: {
                    color: 'gray'
                }
            },
            labels: {
                style: {
                    color: '#99b'
                }
            },

            navigation: {
                buttonOptions: {
                    theme: {
                        stroke: '#CCCCCC'
                    }
                }
            }
        };

        // Apply the theme
        Highcharts.setOptions(Highcharts.theme);

    }(Highcharts));
}));
