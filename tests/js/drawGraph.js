var line1_rest;
var emo_labels = ["", "happy", "surprised", "puzzled", "disgusted", "afraid", "sad"];
var xlabels = [];

(function (H) {
    var addEvent = H.addEvent;

    H.wrap(H.Chart.prototype, 'init', function (proceed) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        var chart = this,
            legend = chart.legend,
            title = legend.title,
            options = legend.options,
            isDragging,
            downX,
            downY,
            optionsX,
            optionsY,
            currentX,
            currentY;


        if (options.draggable && title) {

            title.css({ cursor: 'move' });

            addEvent(title.element, 'mousedown', function (e) {
                e = chart.pointer.normalize(e);
                downX = e.chartX;
                downY = e.chartY;
                optionsX = options.x;
                optionsY = options.y;
                currentX = legend.group.attr('translateX');
                currentY = legend.group.attr('translateY');
                isDragging = true;
            });
            addEvent(chart.container, 'mousemove', function (e) {
                if (isDragging) {
                    e = chart.pointer.normalize(e);
                    var draggedX = e.chartX - downX,
                        draggedY = e.chartY - downY;

                    options.x = optionsX + draggedX;
                    options.y = optionsY + draggedY;

                    // Do the move is we're inside the chart
                    if (currentX + draggedX > 0 &&
                        currentX + draggedX + legend.legendWidth < chart.chartWidth &&
                        currentY + draggedY > 0 &&
                        currentY + draggedY + legend.legendHeight < chart.chartHeight) {
                        legend.group.placed = false; // prevent animation
                        legend.group.align(H.extend({
                            width: legend.legendWidth,
                            height: legend.legendHeight
                        }, options), true, 'spacingBox');
                    }

                }
            });
            addEvent(document, 'mouseup', function () {
                isDragging = false;
            });
        }
    });
}(Highcharts));
// End plugin

function draw_graphs_rest(data) {
    var elName = 'engChart';
    elName = 'graph';
    if (data == undefined) {
        data = [];
    }

    if (line1_rest != null) {
        line1_rest.destroy();
        line1_rest = null;
    }

    console.log('==================line1_rest');
    console.log(data);

    var xlabels = [];
    var lastval = null;
    for (var ii = 0; ii < data[0].length; ii++) {
        var val = data[0][ii];
        if ((ii % 10) == 0 && val != null && val != NaN && val != undefined && lastval != Math.ceil(val / 1000)) {
            //xlabels.push((Math.ceil(val / 1000)));
            var val2 = Math.ceil(val / 1000);
            xlabels.push(val2);
            lastval = val2;
        } else {
            xlabels.push("");
        }

    }

    var series_rest = [];
    for (var i = 1; i < data.length; i++) {
        series_rest.push({
            name: emo_labels[i],
            data: data[i],
            lineWidth: 1,
            marker: {
                enabled: true,
                symbol: null,
                radius: 3
            }
        });
    }


    line1_rest = new Highcharts.Chart({
        credits: { enabled: false },
        chart: {
            renderTo: elName,
            type: 'line',
            animation: true,
            marginRight: 50,
            marginBottom: 90,
            zoomType: 'x'
        },
        title: {
            text: 'emotions - api (kanako)',
            x: -20 //center
        },
        xAxis: {
            type: 'category',
            min: xlabels[0],
            categories: xlabels,
            labels: {
                rotation: -35,
                align: 'right'
            }
        },
        yAxis: {
            min: null,
            max: null,
            maxPadding: 0,
            minPadding: 0,
            title: {
                text: ''
            },
            plotLines: [
                {
                    value: 0,
                    width: 1,
                    color: '#808080'
                }
            ]
        },
        tooltip: {
            formatter: tooltipFormatter
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -10,
            y: 60,
            backgroundColor: 'white',
            borderWidth: 1,
            borderRadius: 0,
            title: {
                text: ':: Drag Legend'
            },
            floating: true,
            draggable: true,
            zIndex: 2000
        },
        series: series_rest
    });


}

function showGraphHC(data) {
    try {
        draw_graphs_rest(data);
    } catch (err) {
        console.log('error');
        console.log(err);
    }

}

function tooltipFormatter() {
    return '<b>' + this.series.name + '</b><br/>' + ((this.x != null) ? (Math.round(this.y * 10) / 10) : 'value') + ': ' + Math.round(this.y * 100) / 100;
}
