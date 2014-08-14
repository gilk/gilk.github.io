var emoName = ["happy", "surprised", "puzzled", "disgusted", "afraid", "sad"];

function showGraphDT(dataFull, graphType) {

    /*
     example

     var svg = dimple.newSvg("#graph", 600, 400),
     chart = null,
     s1 = null,
     s2 = null,
     x = null,
     y1 = null,
     y2 = null;

     chart = new dimple.chart(svg);
     x = chart.addCategoryAxis("x", "Fruit");
     y1 = chart.addMeasureAxis("y", "Value");
     y2 = chart.addMeasureAxis("y", "Value");
     s1 = chart.addSeries("Year", dimple.plot.line, [x, y1]);
     s1.data = [
     { "Value" : 100000, "Fruit" : "Grapefruit", "Year" : 2012 },
     { "Value" : 400000, "Fruit" : "Apple", "Year" : 2012 },
     { "Value" : 120000, "Fruit" : "Banana", "Year" : 2012 }
     ];
     s2 = chart.addSeries("Year", dimple.plot.line, [x, y2]);
     s2.data = [
     { "Value" : 110000, "Fruit" : "Grapefruit", "Year" : 2013 },
     { "Value" : 300000, "Fruit" : "Apple", "Year" : 2013 },
     { "Value" : 140000, "Fruit" : "Banana", "Year" : 2013 }
     ];
     chart.draw();
     */
    if (graphType == "dimple") {
        var svg = dimple.newSvg("#graph", 1200, 400),
            chart = null,
            ss = [], // series
            x = null,
            ys = [], // y axis


        chart = new dimple.chart(svg);
        x = chart.addCategoryAxis("x", "Time");
        for (var posEmo = 0; posEmo <= 5; posEmo++) {
            ys[posEmo] = chart.addMeasureAxis("y", "Value");
            ss[posEmo] = chart.addSeries("Emotion", dimple.plot.line, [x, ys[posEmo]]);
            ss[posEmo].data = [];
        }
        for (var posData = 0; posData <= dataFull[0].length; posData++) {
            for (var posEmo = 0; posEmo <= 5; posEmo++) {
                ss[posEmo].data.push(
                    {
                        "Time": dataFull[0][posData],
                        "Emotion": emoName[posEmo],
                        "Value": dataFull[(posEmo + 1)][posData]
                    }
                )
            }
        }
        chart.draw();
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (graphType == "dt") {
        var m = [20, 150, 20, 20]; // margins
        var w = 1200 - m[1] - m[3]; // width
        var h = 400 - m[0] - m[2]; // height
        var data = dataFull[1].data;
		function timetrans(timestamp){
			return timestamp / 1000.0;
			}
        var x = d3.scale.linear().domain([0, timetrans(dataFull[0].data[dataFull[0].data.length-1])]).range([0, w]);
        // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
        var y = d3.scale.linear().domain([0, 1]).range([h, 0]);
        // automatically determining max range can work something like this
        // var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

        // create a line function that can convert data[] into x and y points
        var line = d3.svg.line()
					.defined(function(d) { return d!=null; }) //To remove null entries (will look like gaps in the line)
					//.interpolate('cardinal')
            // assign the X function to plot our line as we wish
            .x(function (d, i) {
                // verbose logging to show what's actually being done
                //console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
                // return the X coordinate where we want to plot this datapoint
                return x(timetrans(dataFull[0].data[i]));
            })
            .y(function (d) {
                // verbose logging to show what's actually being done
                //console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
                // return the Y coordinate where we want to plot this datapoint
                return y(d);
            })

        // Add an SVG element with the desired dimensions and margin.
		d3.select("svg").remove();
		
        var graph = d3.select("#graph").append("svg:svg")
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
            .append("svg:g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

        // create yAxis
        var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true).tickFormat(function(d){return d+"s"});
        // Add the x-axis.
        graph.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis);


        // create left yAxis
        var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
        // Add the y-axis to the left
        graph.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(-25,0)")
            .call(yAxisLeft);

        // Add the line by appending an svg:path element with the data line we created above
        // do this AFTER the axes above so that the line is above the tick-lines

		var colorMap = d3.scale.category10();
		
		
		function lineMouseover() {
		    d3.select(this)
		        .transition()
		        .duration(100)
		        .style("stroke-width", 5);
			this.parentNode.appendChild(this);
			console.log(this);
			}
		function lineMouseout() {
		    d3.select(this)
		        .transition()
		        .duration(100)
		        .style("stroke-width", 1.5);
		}
		
        for (var pos = 1; pos <= 7; pos++) {
            graph.append("svg:path").attr("class", "path" + pos)
			.attr("d", line(dataFull[pos].data))
			.attr("data-legend",dataFull[pos].name.charAt(0).toUpperCase()+dataFull[pos].name.slice(1))
			.attr("stroke",colorMap(dataFull[pos].name.charAt(0).toUpperCase()+dataFull[pos].name.slice(1)))
			.attr("stroke-width",1.5)
			.attr("fill","none")
			.attr("visibility","visible")
			.attr("class",dataFull[pos].name.charAt(0).toUpperCase()+dataFull[pos].name.slice(1)+"line")
			.on("mouseover", lineMouseover)
			.on("mouseout", lineMouseout);
			console.log(dataFull[pos].data);
        }
		
		var legend = graph.append("g")
		  .attr("class","legend")
		  .attr("transform","translate("+(w+m[3])+",50)")
		  .style("font-size","16px")
		  .call(d3.legend);

    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////

	if (graphType == "gk-test") {
		var m = [20, 150, 100, 20];
		var m2 =[430, 150, 20, 20]; // margins
        var w = 1200 - m[1] - m[3]; // width
        var h = 500 - m[0] - m[2];
 		var h2 = 500 - m2[0] - m2[2]; // height

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
			for (var pos = 1; pos <= 7; pos++) {
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
		
        var svgContainer = d3.select("#graph").append("svg:svg")
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

        // create yAxis
        var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true).tickFormat(function(d){return d+"s"});
		var xAxis2= d3.svg.axis().scale(x2).tickSize(-h).tickSubdivide(true).tickFormat(function(d){return d+"s"});
		
		function brushed() {
		  x.domain(brush.empty() ? x2.domain() : brush.extent());
			graph.select(".x.axis").call(xAxis);
			for (var pos = 1; pos <= 7; pos++) {
			graph.select("#path"+pos).attr("d",line(dataFull[pos].data));
			}
		}
		
		var brush = d3.svg.brush()
		    .x(x2)
		    .on("brush", brushed);
		
        // Add the x-axis.
        graph.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis);


        // create left yAxis
        var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
        // Add the y-axis to the left
        graph.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(-25,0)")
            .call(yAxisLeft);

	        var yAxisV = d3.svg.axis().scale(y2).ticks(4).orient("left");
	        // Add the y-axis to the left
	        viewer.append("svg:g")
	            .attr("class", "y axis")
	            .attr("transform", "translate(-25,0)")
	            .call(yAxisLeft);


		var colorMap = d3.scale.category10();
		
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
		
        for (var pos = 1; pos <= 7; pos++) {
            graph.append("svg:path").attr("id", "path"+pos)
			.attr("d", line(dataFull[pos].data))
			.attr("data-legend",dataFull[pos].name.charAt(0).toUpperCase()+dataFull[pos].name.slice(1))
			.attr("data-legend-pos",pos)
			.attr("stroke",colorMap(dataFull[pos].name.charAt(0).toUpperCase()+dataFull[pos].name.slice(1)))
			.attr("stroke-width",1.5)
			.attr("fill","none")
			.attr("visibility","visible")
			.attr("class",dataFull[pos].name.charAt(0).toUpperCase()+dataFull[pos].name.slice(1)+"line")
			.on("mouseover", lineMouseover)
			.on("mouseout", lineMouseout)
			.attr("clip-path","url(#clip)");
			console.log(dataFull[pos].data);
			
			viewer.append("svg:path").attr("id","vPath"+pos)
			.attr("d", line2(dataFull[pos].data))
			.attr("stroke",colorMap(dataFull[pos].name.charAt(0).toUpperCase()+dataFull[pos].name.slice(1)))
			.attr("stroke-width",1.5)
			.attr("fill","none")
			.attr("visibility","visible")
			.attr("class",dataFull[pos].name.charAt(0).toUpperCase()+dataFull[pos].name.slice(1)+"line");
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


}
