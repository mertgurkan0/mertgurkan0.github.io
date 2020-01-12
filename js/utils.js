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

	var svg = d3.select(legendSvg).attr("transform", "translate(0,10)");

	//  move legend to bottom
	let g = svg.append("g")
	  .attr("class", "legendLinear")
	  .attr("transform", "translate(10,10)");

	g.selectAll("legend-rects")
	  .data(boxSequence)
	  .enter()
	  .append("rect")
	  	.attr("class", "legend-rect")
	  	.attr("height", 20)
	  	.attr("width", 20)
	    .attr("x", (d,i) => { return 10 + i*20})
	    .attr("y", 2)
	    .style("fill", (d, i) => { return layerInterpolator[layerName](i/(len-1))});

	g.selectAll("legend-labels")
	  .data(boxSequence)
	  .enter()
	  .append("text")
	    .attr("x", (d,i) => { return 2 + i*20})
	    .attr("y", 35)
	    .text(d => {
	    	if (d == 0)
	    		return "Low";
	    	else if (d == 4)
	    		return "High";
	    })
	    .attr("text-anchor", "left")
	    .style("alignment-baseline", "middle")
	    .style("font-weight", "bold")
	    .style("font-family", "Open Sans");
}

function extractEgo(net, countryCode) {

    // countryCode: selected country code of ISO_A3 type

    let nodes = net.nodes;
    let edges = net.links;

    let egoEdges = _.filter(edges, (edge) => { 
        return edge["source"].toLowerCase() == countryCode.toLowerCase()
    });    

    let rNodes = egoEdges.map((e)=>e["target"].toLowerCase());
    
    let egoNodes = _.filter(nodes, (node) => {
        return ( _.includes(rNodes, node["id"].toLowerCase())) || (node["id"].toLowerCase() == countryCode.toLowerCase()); 
    });

    return {"nodes": egoNodes, "links": egoEdges};

}

function displayTable(tableDiv, migDistData, countryCode) {

    // countryCode: selected country code of ISO_A2 type

    var table = new Tabulator(tableDiv, {
    	index:"Country_Code",
        height:statContainerHeight + "px",
        selectable:1,
        scrollToRowPosition: "center",
        layout: "fitColumns",
        columns: tableColumns 
    });

    table.setData(migDistData); 

    return table;
}
