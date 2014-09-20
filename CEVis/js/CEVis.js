// d3.legend.js 
// (C) 2012 ziggy.jonsson.nyc@gmail.com
// MIT licence
//Modified by Gil Kogan (gil@crowdemotion.co.uk)

(function() {
	d3.legend = function(g) {
		g.each(function() {
			var g= d3.select(this),
			items = {},
			svg = d3.select(g.property("nearestViewportElement")),
			legendPadding = g.attr("data-style-padding") || 5,
			lb = g.selectAll(".legend-box").data([true]),
			li = g.selectAll(".legend-items").data([true])

			lb.enter().append("rect").classed("legend-box",true)
			li.enter().append("g").classed("legend-items",true)

			svg.selectAll("[data-legend]").each(function() {
				var self = d3.select(this)
				items[self.attr("data-legend")] = {
					pos : self.attr("data-legend-pos") || this.getBBox().y,
					color : self.attr("data-legend-color") != undefined ? self.attr("data-legend-color") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke") 
				}
			})

			items = d3.entries(items).sort(function(a,b) { return a.value.pos-b.value.pos})


			function legendClick(d){ 
				if(d3.select("."+d.key+"line").attr("visibility")=="visible"){
					d3.selectAll("."+d.key+"line").attr("visibility","hidden");
					d3.selectAll(".lengend"+d.key).style("fill","grey");
				}
				else if(d3.select("."+d.key+"line").attr("visibility")=="hidden"){
					d3.selectAll("."+d.key+"line").attr("visibility","visible");
					d3.selectAll(".lengend"+d.key).style("fill",d.value.color);
				}		
			}

			function legendMouseover(d){
				d3.select("."+d.key+"line").style("stroke-width",5);
				d3.select("."+d.key+"line")[0][0].parentNode.appendChild(d3.select("."+d.key+"line")[0][0]);
			}
	
			function legendMouseout(d){
				d3.select("."+d.key+"line").style("stroke-width",1.5);
			}
		
			li.selectAll("text")
				.data(items,function(d) { return d.key})
				.call(function(d) { d.enter().append("text")})
				.call(function(d) { d.exit().remove()})
				.attr("y",function(d,i) { return i+"em"})
				.attr("x","1em")
				.attr("class",function(d){return "lengend"+d.key})
				.attr("id",function(d){return "lengend"+d.key+"text"})
				.text(function(d) { ;return d.key})
				.style("fill",function(d) {return d.value.color})
				.on("click",legendClick)
				.on("mouseover",legendMouseover)
				.on("mouseout", legendMouseout)	
		
			li.selectAll("circle")
				.data(items,function(d) { return d.key})
				.call(function(d) { d.enter().append("circle")})
				.call(function(d) { d.exit().remove()})
				.attr("cy",function(d,i) { return i-0.25+"em"})
				.attr("cx",0)
				.attr("r","0.4em")
				.style("fill",function(d) {return d.value.color})
				.attr("class",function(d){return "lengend"+d.key})
				.on("click",legendClick)
				.on("mouseover",legendMouseover)
				.on("mouseout", legendMouseout)
    
				var lbbox = li[0][0].getBBox()  
				lb.attr("x",(lbbox.x-legendPadding))
					.attr("y",(lbbox.y-legendPadding))
					.attr("height",(lbbox.height+2*legendPadding))
					.attr("width",(lbbox.width+2*legendPadding))
		})
  return g
	}
})()

////////////////
//Authored by gil@crowdemotion.co.uk
/////////////

function normalise(arr){
	minVal = d3.min(arr)
	range = d3.max(arr) - minVal;
	
	return arr.map(function (d) {
		if (d==null) {
			return null;
		}
		else {
			return (d-minVal)/range;
		}
	});
}


function showGraph(dataFull, graphType, initState, divId) {

	var positiveMood = [];
	var negativeMood = [];
	var engagement = [];
		for( var i = 0; i < dataFull[0].data.length; i++){
			if(dataFull[1].data[i]==null){
				positiveMood.push(null);
				negativeMood.push(null);
				engagement.push(null);
			}
			else {
				positiveMood.push(
					(dataFull[1].data[i]+dataFull[2].data[i])/2.0);
				negativeMood.push(
					(dataFull[3].data[i]+dataFull[4].data[i]+dataFull[5].data[i]+dataFull[6].data[i])/4.0);
				engagement.push(
					(dataFull[1].data[i]+dataFull[2].data[i]+dataFull[3].data[i]+dataFull[4].data[i]+dataFull[5].data[i]+dataFull[6].data[i])/6.0);
			}
		}
		
		positiveMood=normalise(positiveMood);
		negativeMood=normalise(negativeMood);
		engagement=normalise(engagement);
		
    dataFull = [{"name":dataFull[0].metricName.charAt(0).toUpperCase()+dataFull[0].metricName.slice(1),"data":dataFull[0].data},
				{"name":dataFull[1].metricName.charAt(0).toUpperCase()+dataFull[1].metricName.slice(1),"data":dataFull[1].data},
				{"name":dataFull[2].metricName.charAt(0).toUpperCase()+dataFull[2].metricName.slice(1),"data":dataFull[2].data},
				{"name":dataFull[3].metricName.charAt(0).toUpperCase()+dataFull[3].metricName.slice(1),"data":dataFull[3].data},
				{"name":dataFull[4].metricName.charAt(0).toUpperCase()+dataFull[4].metricName.slice(1),"data":dataFull[4].data},
				{"name":dataFull[5].metricName.charAt(0).toUpperCase()+dataFull[5].metricName.slice(1),"data":dataFull[5].data},
				{"name":dataFull[6].metricName.charAt(0).toUpperCase()+dataFull[6].metricName.slice(1),"data":dataFull[6].data},
				{"name":"PositiveMood","data":positiveMood},
				{"name":"NegativeMood","data":negativeMood},
				{"name":"Engagement","data":engagement}];



	if (graphType == "line") {
		var m = [20, 150, 100, 20];
		var m2 =[430, 150, 20, 20]; // margins
//        var w = d3.select('#'+divId).clientWidth - m[1] - m[3]; // width
		var w = 1200 - m[1] - m[3];
		console.log(d3.select('#'+divId));
		console.log("graph width");
        var h = 500 - m[0] - m[2];
 		var h2 = 500 - m2[0] - m2[2]; // height

		var normalised = false;
		var dataRanges=[];
		
		for (var pos = 1; pos <= dataFull.length-1; pos++){
			dataRanges.push([d3.min(dataFull[pos].data),d3.max(dataFull[pos].data)]);
		}
		
		var data = dataFull[1].data;
		
		function timetrans(timestamp){
			return timestamp / 1000.0;
		}

		var ymina = [];
		var ymaxa = [];
		for(var pos = 1; pos <= dataFull.length-1; pos++){
			ymina.push(d3.min(dataFull[pos].data));
			ymaxa.push(d3.max(dataFull[pos].data));
		}
		if (ymina.length) 
			{
				ymina=d3.min(ymina);
				ymaxa=d3.max(ymaxa);
			}
		else{
			ymina=0;
			ymaxa=1;
		}
  
		var x  = d3.scale.linear().domain([0, timetrans(dataFull[0].data[dataFull[0].data.length-1])]).range([0, w]);
		var x2 = d3.scale.linear().domain(x.domain()).range([0,w]);
		
        var y = d3.scale.linear().domain([ymina, ymaxa]).range([h, 0]);
		var y2= d3.scale.linear().domain(y.domain()).range([h2,0]);
		
		function adjustYDomain(){
			
			var ymin = [];
			var ymax = [];
			
			for(var pos = 1; pos <= dataFull.length-1; pos++){
				if(d3.select("."+dataFull[pos].name.charAt(0).toUpperCase()+dataFull[pos].name.slice(1)+"line").attr("visibility")=="visible")
					{
						ymin.push(d3.min(dataFull[pos].data));
						ymax.push(d3.max(dataFull[pos].data));
					}
			}
			
			if (ymin.length==0){return;}
			
			ymin=d3.min(ymin);
			ymax=d3.max(ymax);
			
			if(ymin==ymax){ymax+=1;}
			
			y.domain([ymin,ymax]);
			y2.domain([ymin,ymax])
			
			for (var pos = 1; pos <= dataFull.length-1; pos++) {
				graph.select("#path"+pos).attr("d",line(dataFull[pos].data));
				viewer.select("#vPath"+pos).attr("d",line2(dataFull[pos].data));
			}
			
		}
		

		
		var line = d3.svg.line()
			.defined(function(d) { return d!=null; }) //To remove null entries (will look like gaps in the line)
			//.interpolate('cardinal')
            .x(function (d, i) {
				return x(timetrans(dataFull[0].data[i]));
			})
			.y(function (d) {
				return y(d);
			});
		
		var line2 = d3.svg.line()
			.defined(function(d) { return d!=null; }) //To remove null entries (will look like gaps in the line)
        	.x(function (d, i) {
            	return x2(timetrans(dataFull[0].data[i]));
        	})
        	.y(function (d) {
				return y2(d);
        	});

		d3.select("svg").remove();
		
		var svgContainer = d3.select("#"+divId).append("svg:svg")
			.attr("width", w + m[1] + m[3])
			.attr("height", h + m[0] + m[2]);
        
		svgContainer.append("defs").append("clipPath")
			.attr("id","clip")
			.append("rect")
			.attr("width",w)
			.attr("height",h);
			
  		var graph =	svgContainer.append("svg:g")
			.attr("class","focus")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
		
		var viewer = svgContainer.append("g")
			.attr("class","context")
			.attr("transform","translate(" + m2[3] + ","+m2[0]+")");

        var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true).tickFormat(function(d){return d+"s"});
		var xAxis2= d3.svg.axis().scale(x2).tickSize(-h).tickSubdivide(true).tickFormat(function(d){return d+"s"});
		
		function brushed() {
			x.domain(brush.empty() ? x2.domain() : brush.extent());
			graph.select(".x.axis").call(xAxis);
			for (var pos = 1; pos <= dataFull.length-1; pos++) {
				graph.select("#path"+pos).attr("d",line(dataFull[pos].data));
			}
		}
		
		var brush = d3.svg.brush()
			.x(x2)
			.on("brush", brushed);
		
        graph.append("svg:g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + h + ")")
			.call(xAxis);

        var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");

        graph.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(-25,0)")
            .call(yAxisLeft);

		var yAxisV = d3.svg.axis().scale(y2).ticks(4).orient("left");

		viewer.append("svg:g")
			.attr("class", "y axis")
			.attr("transform", "translate(-25,0)")
			.call(yAxisLeft);

		var colorMap = d3.scale.ordinal().range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#bcbd22", "#17becf"]);
		
		function lineMouseover() {
			d3.select(this)
				.transition()
				.duration(100)
				.style("stroke-width", 5);
			this.parentNode.appendChild(this);
		}
		function lineMouseout() {
			d3.select(this)
				.transition()
				.duration(100)
				.style("stroke-width", 1.5);
		}
		
        for (var pos = 1; pos <= dataFull.length-1; pos++) {
			graph.append("svg:path").attr("id", "path"+pos)
			.attr("d", line(dataFull[pos].data))
			.attr("data-legend",dataFull[pos].name)
			.attr("data-legend-pos",pos)
			.attr("stroke",colorMap(dataFull[pos].name))
			.attr("stroke-width",1.5)
			.attr("fill","none")
			.attr("visibility","visible")
			.attr("class",dataFull[pos].name+"line")
			.on("mouseover", lineMouseover)
			.on("mouseout", lineMouseout)
			.attr("clip-path","url(#clip)");
			
			viewer.append("svg:path").attr("id","vPath"+pos)
			.attr("d", line2(dataFull[pos].data))
			.attr("stroke",colorMap(dataFull[pos].name))
			.attr("stroke-width",1.5)
			.attr("fill","none")
			.attr("visibility","visible")
			.attr("class",dataFull[pos].name+"line");
		}
		
		viewer.append("g")
			.attr("class", "x brush")
			.call(brush)
			.selectAll("rect")
			.attr("y", -6)
			.attr("height", h2 + 7);
		
		var legend = graph.append("g")
			.attr("class","legend")
			.attr("transform","translate("+(w+m[3])+",50)")
			.style("font-size","16px")
			.call(d3.legend)
			.on("click",adjustYDomain);
			

	}
	for (var pos = 1; pos <= dataFull.length-1; pos++){
		if(initState.indexOf(pos+2+"") == -1){
			d3.selectAll("."+dataFull[pos].name+"line").attr("visibility","hidden");
			d3.selectAll(".lengend"+dataFull[pos].name).style("fill","grey");
		}
	}
	
//	var el = d3.select('#'+divId);
//
//	function setSize(child, parent) {
//	    child && parent && 
//	    child.attr('width', parent.clientWidth)
//	         .attr('height', parent.clientHeight);
//	}
//	var that = this;
//	window.addEventListener('resize', function (e) {
//	    that.setSize(el);
//	});

}


