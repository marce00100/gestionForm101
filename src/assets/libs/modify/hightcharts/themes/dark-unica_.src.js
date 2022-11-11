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
         * Dark theme for Highcharts JS
         * @author Torstein Honsi
         */

        /* global document */
        // Load the fonts
        // Highcharts.createElement('link', {
        //     href: 'https://fonts.googleapis.com/css?family=Unica+One',
        //     rel: 'stylesheet',
        //     type: 'text/css'
        // }, null, document.getElementsByTagName('head')[0]);

        Highcharts.theme = {
            // colors: [
            //     '#E86D00', '#FFB97F', '#E8E400', '#80699B', '#00E820',
            //     '#4572A7', '#AA4643', '#89A54E', '#70E800', '#3D96AE',      
            //     '#00E8D6', '#00A5E8', '#0054E8', '#A013E6', '#E800CF', 
            //     '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92', '#E80000',
            //     '#E8007B', '#FF766D', '#EDFF6D', '#8AFF6D', '#89FFEA',
            //     '#FF72F4', '#84345E', '#348445', '#C4D21C', '#9C0000'
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
                        [0, '#2a2a2b'],
                        [1, '#3e3e40']
                    ]
                },
                borderColor: '#000000',
                borderWidth: 2,
                                plotBackgroundColor: 'rgba(255, 255, 255, 1)',
                plotShadow: true,
                plotBorderColor: '#CCCCCC',
                plotBorderWidth: 1, 
                style: {
                    fontFamily: ' sans-serif, Verdana,'
                },
                // plotBorderColor: '#606063'
            },
            title: {
                style: {
                    color: '#FDD089',//'#FDD089',
                    textTransform: 'uppercase',
                    fontSize: '18px ',
                    fontWeight: 'bold'
                }
            },
            subtitle: {
                style: {
                    color: '#FDD089',
                    textTransform: 'uppercase',
                    fontSize: '14px'
                }
            },
            xAxis: {
                gridLineColor: '#70707344',
                gridLineWidth: 1,
                labels: {
                    style: {
                        color: '#E0E0E3',
                        fontSize: '12px'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                title: {
                    style: {
                        color: '#f2f2f2',
                    }
                }
            },
            yAxis: {
                gridLineColor: '#707073ff',
                gridLineWidth: 1,
                labels: {
                    style: {
                        color: '#E0E0E3',
                        fontSize: '12px'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                tickWidth: 1,
                title: {
                    style: {
                        color: '#E0E0E3',
                        fontSize: '14px'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(50, 50, 60, 0.7)',
                style: {
                    color: '#F0F0F0'
                }
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        color: '#ccc'
                    },
                    marker: {
                        lineColor: '#333'
                    }
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
                    color: '#E0E0E3'
                },
                itemHoverStyle: {
                    color: '#FFF'
                },
                itemHiddenStyle: {
                    color: '#606063'
                }
            },
            credits: {
                style: {
                    color: '#666'
                }
            },
            labels: {
                style: {
                    color: '#f00'//'#707073'
                }
            },

            drilldown: {
                activeAxisLabelStyle: {
                    color: '#F0F0F3'
                },
                activeDataLabelStyle: {
                    color: '#F0F0F3'
                }
            },

            navigation: {
                buttonOptions: {
                    symbolStroke: '#DDDDDD',
                    theme: {
                        fill: '#505053'
                    }
                }
            },

            // scroll charts
            rangeSelector: {
                buttonTheme: {
                    fill: '#505053',
                    stroke: '#000000',
                    style: {
                        color: '#CCC'
                    },
                    states: {
                        hover: {
                            fill: '#707073',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        },
                        select: {
                            fill: '#000003',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        }
                    }
                },
                inputBoxBorderColor: '#505053',
                inputStyle: {
                    backgroundColor: '#333',
                    color: 'silver'
                },
                labelStyle: {
                    color: 'silver'
                }
            },

            navigator: {
                handles: {
                    backgroundColor: '#666',
                    borderColor: '#AAA'
                },
                outlineColor: '#CCC',
                maskFill: 'rgba(255,255,255,0.1)',
                series: {
                    color: '#7798BF',
                    lineColor: '#A6C7ED'
                },
                xAxis: {
                    gridLineColor: '#505053'
                }
            },

            scrollbar: {
                barBackgroundColor: '#808083',
                barBorderColor: '#808083',
                buttonArrowColor: '#CCC',
                buttonBackgroundColor: '#606063',
                buttonBorderColor: '#606063',
                rifleColor: '#FFF',
                trackBackgroundColor: '#404043',
                trackBorderColor: '#404043'
            },

            // special colors for some of the
            legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
            background2: '#505053',
            dataLabelsColor: '#bbb',//'#B0B0B3',
            textColor: '#C0C0C0',
            contrastTextColor: '#F0F0F3',
            maskColor: 'rgba(255,255,255,0.3)'
        };

        // Apply the theme
        Highcharts.setOptions(Highcharts.theme);

    }(Highcharts));
}));
