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
        .text(function(d) { ;return d.key})
		.style("fill",function(d) { console.log(d.value.color);console.log(d.key);return d.value.color})
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
        .style("fill",function(d) { console.log(d.value.color);return d.value.color})
  		.attr("class",function(d){return "lengend"+d.key})
		.on("click",legendClick)
		.on("mouseover",legendMouseover)
	    .on("mouseout", legendMouseout)
    
    // Reposition and resize the box
    var lbbox = li[0][0].getBBox()  
    lb.attr("x",(lbbox.x-legendPadding))
        .attr("y",(lbbox.y-legendPadding))
        .attr("height",(lbbox.height+2*legendPadding))
        .attr("width",(lbbox.width+2*legendPadding))
  })
  return g
}
})()