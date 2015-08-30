var treeData = [
  {
    "name": "Training",
    "type":"n",
    "children": [
        {
            "name": "Class A",
            "type":"n",
			
            "children": [
                {
                    "name": "Outcome 1",
                    "type":"e",
					"tooltip": "Probability: 0.7 <br> Value: 70%",
                    "children": [
                        
                        
                        /*{"name": "Child 3","type":"e"}*/
                    ]
                },
                {
                    "name": "Outcome 2",
                    "type":"e",
					"tooltip": "Probability: 0.3 <br> Value: 27%",
                    "children": [
                        
                        /*{"name": "Child 3","type":"e"}*/
                    ]
                }
            ]
        },
        {
            "name": "Class B",
            "type":"n",
			
            "children": [
                {
                    "name": "Outcome 1",
                    "type":"e",
					"tooltip": "Probability: 0.8 <br> Value: 60%",
                    "children": [
                        
                        
                        /*{"name": "Child 3","type":"e"}*/
                    ]
                },
                {
                    "name": "Outcome 2",
                    "type":"e",
					"tooltip": "Probability: 0.2 <br> Value: 35%",
                    "children": [
                        /*{"name": "Child 3","type":"e"}*/
                        
                    ]
                }
            ]
        },
        {
            "name": "Current",
            "type":"e",
			
            "children": [
                {
                    "name": "Outcome 1",
                    "type":"e",
					"tooltip": "Probability: 1.0 <br> Value: 50%",
                    "children": [
                        
                        
                        /*{"name": "Child 3","type":"e"}*/
                    ]
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

var svg = d3.select("#decesion-risk-tree").append("svg")
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
		
		return elbow({source: o, target: o});
		
	  });

  // Transition links to their new position.
  link.transition()
	  .duration(duration)
	  .attr("d", elbow);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
	  .duration(duration)
	  .attr("d", function(d) {
		var o = {x: source.x, y: source.y};
		return elbow({source: o, target: o});
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
        'container':"#decesion-risk-tree",
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
function elbow(d, i) {
  return "M" + d.source.y + "," + d.source.x + "L" + d.target.y +","+ d.target.x ;
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
$(function () {
    $('#utility').highcharts({
        xAxis: {
            min: 0,
            max: 100,
            format:"{value}",
            title: {
            text: 'Value'
        }
        },
        yAxis: {
           title: {
            text: 'Utiltiy'
        }
        },
        title: {
            text: 'Training Utiltiy Curve'
        },
        series: [{
            type: 'line',
            name: 'Utility curve',
            data: [
                [21,-3.37192698613298],
                [22,-2.68037736384787],
                [23,-2.2758467674232],
                [24,-1.98882774156276],
                [25,-1.76619848914044],
                [26,-1.58429714513809],
                [27,-1.4305017501638],
                [28,-1.29727811927765],
                [29,-1.17976654871342],
                [30,-1.07464886685533],
                [31,-0.979558356943189],
                [32,-0.892747522852979],
                [33,-0.812889296763687],
                [34,-0.738952127878689],
                [35,-0.67011827043066],
                [36,-0.605728496992539],
                [37,-0.545243602161884],
                [38,-0.488216926428311],
                [39,-0.434274318716541],
                [40,-0.383099244570219],
                [41,-0.334421531454019],
                [42,-0.288008734658079],
                [43,-0.243659424038459],
                [44,-0.20119790056787],
                [45,-0.160469992147898],
                [46,-0.121339674478578],
                [47,-0.0836863300036421],
                [48,-0.0474025055935787],
                [49,-0.0123920638842641],
                [50,0.02143135185445],
                [51,0.0541456010413498],
                [52,0.0858211252925704],
                [53,0.116521861766589],
                [54,0.146306020123225],
                [55,0.175226746828741],
                [56,0.203332695856798],
                [57,0.230668521179615],
                [58,0.257275303568569],
                [59,0.283190921946091],
                [60,0.308450377714891],
                [61,0.33308607903349],
                [62,0.35712809083109],
                [63,0.380604355400261],
                [64,0.40354088762703],
                [65,0.425961948279118],
                [66,0.447890198246651],
                [67,0.469346836193774],
                [68,0.49035172171724],
                [69,0.510923485805381],
                [70,0.531079630137211],
                [71,0.550836616547894],
                [72,0.570209947806532],
                [73,0.589214240699356],
                [74,0.607863292281468],
                [75,0.626170140049351],
                [76,0.644147116691532],
                [77,0.661805899993237],
                [78,0.679157558400845],
                [79,0.696212592691329],
                [80,0.71298097413956],
                [81,0.729472179530833],
                [82,0.745695223326459],
                [83,0.761658687255759],
                [84,0.777370747577679],
                [85,0.792839200228852],
                [86,0.808071484051699],
                [87,0.82307470227588],
                [88,0.837855642408335],
                [89,0.85242079467132],
                [90,0.866776369113852],
                [91,0.880928311509427],
                [92,0.894882318141908],
                [93,0.908643849571593],
                [94,0.922218143464726],
                [95,0.93561022656188],
                [96,0.948824925853678],
                [97,0.961866879025991],
                [98,0.9747405442312],
                [99,0.987450209237044],
                [100,1]
            ],
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        }, {
            type: 'scatter',
            name: 'Observations',
            data: [[70,0.53],
                    [60,0.308],
                    [50,0],
                    [35,-0.67],
                    [27,-1.43]
                  ],
            marker: {
                radius: 4,
                symbol: "circle"
            },
            tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: 'Value {point.x}, Utility {point.y}'
                }
        }]
    });
});