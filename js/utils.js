function getPopUpContent(properties) {
	let content = {
		"country_name": properties["country_name"],
		"migration_population_ratio": properties["migration_population_ratio"],
		"audience_size": properties["audience_size"],
		"current_population": properties["current_population"]
	};

	let htmlContent = "<span>Country Name<br>" + "<strong>" + content["country_name"] + "</strong>" + "<br>"
					+ "Facebook Migration Est.<br>" + "<strong>" + content["audience_size"] + "</strong>" + "<br>"
					+ "Current Population<br>" + "<strong>" + content["current_population"] + "</strong>" + "<br>"
					+ "Migration Population Ratio<br>" + "<strong>" + content["migration_population_ratio"] + "</strong>" + "</span>";

	return htmlContent;
}

function changeLegend(layerName, legendSvg) {

	// numeric sequence to control length
	let len = 5;
	var boxSequence = d3.range(len);

	var svg = d3.select(legendSvg);

	//  move legend to bottom
	let g = svg.append("g")
	  .attr("class", "legendLinear")
	  .attr("transform", "translate(20,20)");

	g.selectAll("legend-rects")
	  .data(boxSequence)
	  .enter()
	  .append("rect")
	  	.attr("class", "legend-rect")
	  	.attr("height", 20)
	  	.attr("width", 20)
	    .attr("x", function(d,i){ return 5 + i*25})
	    .attr("y", 4)
	    .style("fill", function(d, i){ return layerInterpolator[layerName](i/(len-1))});

	g.selectAll("legend-labels")
	  .data(boxSequence)
	  .enter()
	  .append("text")
	    .attr("x", function(d,i){ return 12 + i*25})
	    .attr("y", 35)
	    .text(function(d){ return d})
	    .attr("text-anchor", "left")
	    .style("alignment-baseline", "middle")
	    .style("font-weight", "bold")
	    .style("font-family", "Open Sans");
}