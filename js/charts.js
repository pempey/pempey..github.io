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

var treeData = [
  {
    "name": "Decision",
    "parent": "null",
    "children": [
      {
        "name": "Current Process",
        "parent": "Decision",
		"cost": "-2M",
		"tooltip": "Cost: $2M <br> Maximun Expected Value: $-4.2M",
        "children": [
          {
            "name": "High",
            "parent": "Current Process",
			"probability": "0.1",
			"value":"50M",
			"NPV":"4.8M",
			"tooltip": "Return: $50M <br> Probability: 0.1 <br> NPV: $4.8M"
          },
          {
            "name": "Moderate",
            "parent": "Current Process",
			"probability": "0.3",
			"value":"16M",
			"NPV":"4.2M",
			"tooltip": "Return: $16M <br> Probability: 0.3 <br> NPV: $4.2M"
          },
		  {
            "name": "Decrease",
            "parent": "Current Process",
			"probability": "0.6",
			"value":"-20M",
			"NPV":"-13.2M",
			"tooltip": "Return: $-20M <br> Probability: 0.6 <br> NPV: $-13.2M"
          }
        ]
      },
      {
        "name": "Proposed Process",
        "parent": "Decesion",
		"cost": "-2M",
		"tooltip": "Cost: $7M <br> Maximun Expected Value: $22.4M",
        "children": [
          {
            "name": "High",
            "parent": "Current Process",
			"probability": "0.1",
			"value":"50M",
			"NPV":"4.8M",
			"tooltip": "Return: $50M <br> Probability: 0.5 <br> NPV: $21.5M"
          },
          {
            "name": "Moderate",
            "parent": "Current Process",
			"probability": "0.3",
			"value":"16M",
			"NPV":"4.2M",
			"tooltip": "Return: $16M <br> Probability: 0.4 <br> NPV: $3.6M"
          },
		  {
            "name": "Decrease",
            "parent": "Current Process",
			"probability": "0.6",
			"value":"-20M",
			"NPV":"-13.2M",
			"tooltip": "Return: $-20M <br> Probability: 0.1 <br> NPV: $-2.7M"
          }
        ]
      },
	  {
        "name": "Process Outsourced",
        "parent": "Decesion",
		"cost": "-2M",
		"tooltip": "Cost: $5M <br> Maximun Expected Value: $14.2",
        "children": [
          {
            "name": "High",
            "parent": "Current Process",
			"probability": "0.1",
			"value":"50M",
			"NPV":"4.8M",
			"tooltip": "Return: $50M <br> Probability: 0.2 <br> NPV: $9M"
          },
          {
            "name": "Moderate",
            "parent": "Current Process",
			"probability": "0.3",
			"value":"16M",
			"NPV":"4.2M",
			"tooltip": "Return: $16M <br> Probability: 0.7 <br> NPV: $7.7M"
          },
		  {
            "name": "Decrease",
            "parent": "Current Process",
			"probability": "0.1",
			"value":"-20M",
			"NPV":"-13.2M",
			"tooltip": "Return: $-20M <br> Probability: 0.1 <br> NPV: $-2.5M"
          }
        ]
      }
    ]
  }
];


// ************** Generate the tree diagram	 *****************
var margin = {top: 20, right: 120, bottom: 20, left: 120},
	width = 960 - margin.right - margin.left,
	height = 500 - margin.top - margin.bottom;
	
var i = 0,
	duration = 750,
	root;

var tree = d3.layout.tree()
	.size([height, width]);

var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#decesion-tree").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0];
root.x0 = height / 2;
root.y0 = 0;
  
update(root);

d3.select(self.frameElement).style("height", "500px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
	  links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 150; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
  		
	  .data(nodes, function(d) { return d.id || (d.id = ++i); })
	  
	  
	

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	  
	  .on("click", click);

  nodeEnter.append("circle")
	  .attr("r", 1e-6)
	  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
	  .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
	  .attr("dy","0.35em" )
	  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
	  .text(function(d) { return d.name; })
	  .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
	  .duration(duration)
	  
	  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
	  .attr("r", 10)
	  /*.attr("title","Blue Cheese")*/
	  /*.attr("title","Blue Cheese")*/
	  /*.attr("data-toggle","tooltip")*/
	  /*.attr('data-content','This is some content')*/
	  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
	  .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	  .remove();

  nodeExit.select("circle")
	  .attr("r", 1e-6);

  nodeExit.select("text")
	  .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
	  .data(links, function(d) { return d.target.id; })
	  

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
	  .attr("class", "link")
	  .attr("d", function(d) {
		var o = {x: source.x0, y: source.y0};
		
		return diagonal({source: o, target: o});
		
	  });

  // Transition links to their new position.
  link.transition()
	  .duration(duration)
	  .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
	  .duration(duration)
	  .attr("d", function(d) {
		var o = {x: source.x, y: source.y};
		return diagonal({source: o, target: o});
	  })
	  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
	d.x0 = d.x;
	d.y0 = d.y;
  });
  updatetooltip();
  updatelines()
}

// Toggle children on click.
function click(d) {
  if (d.children) {
	d._children = d.children;
	d.children = null;
  } else {
	d.children = d._children;
	d._children = null;
  }
  update(d);
}
function updatetooltip() {
	svg.selectAll("g.node circle").attr('data-content',function(d) { return d.tooltip });
		

	$("svg g circle").popover({
        'container':"#decesion-tree",
        'placement': 'top',
		'trigger':'hover',
   		'white-space': 'nowrap',
   		'html':'true'
		
    });
	
	
}
function updatelines() {
	svg.selectAll("path.link")
	  
	  .style("stroke-width", "3px");
}

updatetooltip();
updatelines()
/*svg.selectAll("g.node circle").attr('data-content',function(d) { return d.tooltip });
$("svg g circle").popover({
        'container':"#decesion-tree",
        'placement': 'top',
		'trigger':'hover',
   		'white-space': 'nowrap',
   		'html':'true'
		
    });
	*/
$(document).ready(function () {
	$("a").tooltip({
        'placement': 'top'
    });
   /*$('[data-toggle="tooltip"]').tooltip({
    'placement': 'top'
   });*/
	
    /*$("svg g circle").tooltip({
        
        'placement': 'right'
    });*/
});

/**
 * This is an advanced demo of setting up Highcharts with the flags feature borrowed from Highstock. 
 * It also shows custom graphics drawn in the chart area on chart load.
 */


/**
 * Fires on chart load, called from the chart.events.load option.
 */
function onChartLoad() {

    var centerX = 140,
        centerY = 110,
        path = [],
        angle,
        radius,
        badgeColor = Highcharts.Color(Highcharts.getOptions().colors[0]).brighten(-0.2).get(),
        spike,
        empImage,
        big5,
        label,
        left,
        right,
        years,
        renderer;

    if (this.chartWidth < 530) {
        return;
    }


}

$(function () {
    var options = {

        chart: {
            events: {
                load: onChartLoad
            }
        },

        xAxis: {
            type: 'datetime',
            minTickInterval: 365 * 24 * 36e5,
            labels: {
                align: 'left'
            },
            plotBands: [{
                from: Date.UTC(2015, 10, 27),
                to: Date.UTC(2017, 11, 1),
                color: '#EFFFFF',
                label: {
                    text: 'Infrastructure Upgrades',
                    style: {
                        color: '#999999'
                    },
                    y: 30
                }
            }, {
                from: Date.UTC(2017, 11, 1),
                to: Date.UTC(2020, 3, 1),
                color: '#FFFFEF',
                label: {
                    text: 'Customer Service <br> Centralization',
                    style: {
                        color: '#999999'
                    },
                    y: 30
                }
            }, {
                from: Date.UTC(2020, 3, 1),
                to: Date.UTC(2020, 12, 31),
                color: '#FFEFFF',
                label: {
                    text: 'Training <br> and <br> Stabilization',
                    style: {
                        color: '#999999'
                    },
                    y: 30
                }
            }]

        },

        title: {
            text: 'Project Timeline'
        },

        tooltip: {
            style: {
                width: '250px'
            }
        },

        yAxis: [{
            max: 1000,
            labels: {
                enabled: true
            },
            title: {
                text: 'Quarterly Cost'
            },
            gridLineColor: 'rgba(0, 0, 0, 0.07)'
        }],

        plotOptions: {
            series: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2
                },
                fillOpacity: 0.5
            },
            flags: {
                tooltip: {
                    xDateFormat: '%B %e, %Y'
                }
            }
        },

        series: [{
            type: 'spline',
            id: 'google-trends',
            
            name: 'Projet and Operation Costs',
            data: [{x: Date.UTC(2016,1,1) , y: 700},
					{x: Date.UTC(2016,4,1) , y: 825},
					{x: Date.UTC(2016,7,1) , y: 875},
					{x: Date.UTC(2016,10,1) , y: 850},
					{x: Date.UTC(2017,1,1) , y: 875},
					{x: Date.UTC(2017,4,1) , y: 750},
					{x: Date.UTC(2017,7,1) , y: 800},
					{x: Date.UTC(2017,10,1) , y: 775},
					{x: Date.UTC(2018,1,1) , y: 750},
					{x: Date.UTC(2018,4,1) , y: 675},
					{x: Date.UTC(2018,7,1) , y: 625},
					{x: Date.UTC(2018,10,1) , y: 600},
					{x: Date.UTC(2019,1,1) , y: 575},
					{x: Date.UTC(2019,4,1) , y: 550},
					{x: Date.UTC(2019,7,1) , y: 500},
					{x: Date.UTC(2019,10,1) , y: 475},
					{x: Date.UTC(2020,1,1) , y: 450},
					{x: Date.UTC(2020,4,1) , y: 425},
					{x: Date.UTC(2020,7,1) , y: 425},
					{x: Date.UTC(2020,10,1) , y: 417},
					{x: Date.UTC(2021,1,1) , y: 413}],
            tooltip: {
                xDateFormat: '%B %Y',
                valueSuffix: ' thousand',
				valuePrefix: '$'
            }
        }, {
            type: 'spline',
            id: 'google-trends',
            dashStyle: 'dash',
            name: 'Current Operation Costs',
            data: [{x: Date.UTC(2016,1,1) , y: 609},
					{x: Date.UTC(2016,4,1) , y: 609},
					{x: Date.UTC(2016,7,1) , y: 609},
					{x: Date.UTC(2016,10,1) , y: 609},
					{x: Date.UTC(2017,1,1) , y: 609},
					{x: Date.UTC(2017,4,1) , y: 609},
					{x: Date.UTC(2017,7,1) , y: 609},
					{x: Date.UTC(2017,10,1) , y: 609},
					{x: Date.UTC(2018,1,1) , y: 609},
					{x: Date.UTC(2018,4,1) , y: 609},
					{x: Date.UTC(2018,7,1) , y: 609},
					{x: Date.UTC(2018,10,1) , y: 609},
					{x: Date.UTC(2019,1,1) , y: 609},
					{x: Date.UTC(2019,4,1) , y: 609},
					{x: Date.UTC(2019,7,1) , y: 609},
					{x: Date.UTC(2019,10,1) , y: 609},
					{x: Date.UTC(2020,1,1) , y: 609},
					{x: Date.UTC(2020,4,1) , y: 609},
					{x: Date.UTC(2020,7,1) , y: 609},
					{x: Date.UTC(2020,10,1) , y: 609},
					{x: Date.UTC(2021,1,1) , y: 609}],
            tooltip: {
                xDateFormat: '%B %Y',
                valueSuffix: ' thousand',
				valuePrefix: '$'
            }
        },{
            name: 'Timeline',
            id: 'timeline',
            type: 'area',
			tooltip: {
            	enabled: false
        	},
            data: [ {x: Date.UTC(2016,1,1) , y: 100},
					/*{x: Date.UTC(2016,4,1) , y: 100},
					{x: Date.UTC(2016,7,1) , y: 100},
					{x: Date.UTC(2016,10,1) , y: 100},
					{x: Date.UTC(2017,1,1) , y: 100},
					{x: Date.UTC(2017,4,1) , y: 100},
					{x: Date.UTC(2017,7,1) , y: 100},
					{x: Date.UTC(2017,10,1) , y: 100},
					{x: Date.UTC(2018,1,1) , y: 100},
					{x: Date.UTC(2018,4,1) , y: 100},
					{x: Date.UTC(2018,7,1) , y: 100},
					{x: Date.UTC(2018,10,1) , y: 100},
					{x: Date.UTC(2019,1,1) , y: 100},
					{x: Date.UTC(2019,4,1) , y: 100},
					{x: Date.UTC(2019,7,1) , y: 100},
					{x: Date.UTC(2019,10,1) , y: 100},
					{x: Date.UTC(2020,1,1) , y: 100},
					{x: Date.UTC(2020,4,1) , y: 100},
					{x: Date.UTC(2020,7,1) , y: 100},
					{x: Date.UTC(2020,10,1) , y: 100},*/
					{x: Date.UTC(2021,1,1) , y: 100}],
            

        }]
    };

    // Add flags for important milestones. This requires Highstock.
    if (Highcharts.seriesTypes.flags) {
        options.series.push({
            type: 'flags',
            name: 'Hardware',
            color: '#333333',
            shape: 'squarepin',
            y: -55,
            data: [
                { x: Date.UTC(2016, 4, 1), text: 'New Hardware Purchase', title: 'Hardware', shape: 'squarepin' }
            ],
			onSeries: 'timeline',
            showInLegend: false
        }, {
            type: 'flags',
            name: 'Software',
            color: '#333333',
            shape: 'squarepin',
            y: -55,
            data: [
                { x: Date.UTC(2016, 12, 13), text: 'New Software Purchase', title: 'Software' }
            ],
			onSeries: 'timeline',
            showInLegend: false
        }, {
            type: 'flags',
            name: 'Highcharts',
            color: '#333333',
            shape: 'circlepin',
            data: [
                { x: Date.UTC(2018, 1, 27), text: 'Centralizing of Region 1 Staff', title: '1' },
                { x: Date.UTC(2018, 7, 13), text: 'Centralizing of Region 2 Staff', title: '2' },
                { x: Date.UTC(2019, 1, 23), text: 'Centralizing of Region 3 Staff', title: '3' },
                
                { x: Date.UTC(2019, 7, 24), text: 'Centralizing of Region 4 Staff', title: '4' },
                { x: Date.UTC(2020, 2, 22), text: 'Centralizing of Region 5 Staff', title: '5' }
                
            ],
			onSeries: 'timeline',
            showInLegend: false
        }, {
            type: 'flags',
            name: 'Events',
            color: '#333333',
            fillColor: 'rgba(255,255,255,0.8)',
			y: -55,
            data: [
                { x: Date.UTC(2017, 10, 1), text: 'Centralization of Scheduling System', title: 'Milestone' }
                
            ],
            onSeries: 'timeline',
            showInLegend: false
        });
    }

    $('#container').highcharts(options);
});
$(function () {
    var chart;
    $(document).ready(function() {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'trendChart'
            },
            title: {
                text: 'Customer Satisfaction Trend',
                x: -20 //center
            },
            subtitle: {
                text: 'Five year forcast',
                x: -20
            },
            xAxis: {
                allowDecimals: false,
                labels: {
                    formatter: function() {
                       return this.value;
                    }
                }
            },
            yAxis: [{
                title: {
                    text: 'Customer Satisfaction Index'
                },
                min: 0
            }, { // Secondary yAxis
            title: {
                text: 'Number of Customer Service Regions',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
            plotOptions: {
                series: {
                    pointStart: 2009
                }
            },
            series: [{
            name: 'Regions',
            type: 'column',
            yAxis: 1,
            data: [3, 3, 3, 4, 4, 5, 5],
            tooltip: {
                
            }

        },{
                name: 'Current',
                type: 'line',
                color: '#4572A7',
                data: [ 0.60, 0.65, 0.65, 0.59, 0.62, 0.55, 0.54 ]
            }, {
                name: 'Forcast-Current Process',
                dashStyle: 'dot',
                color: '#4572A7',
                data: [ [ 2016, 0.52 ], [ 2017, 0.50 ], [ 2018, 0.51 ], [ 2019, 0.47 ], [ 2020, 0.48 ] ]
            }, {
                name: 'Forcast-Proposed Process',
                dashStyle: 'dot',
                color: '#4572A7',
                data: [ [ 2016, 0.60 ], [ 2017, 0.61 ], [ 2018, 0.65 ], [ 2019, 0.67 ], [ 2020, 0.71 ] ]
            }]
        });
    });
    
});