function getPopUpContent(properties) {
	let content = {
		"country_name": properties["country_name"],
		"migration_population_ratio": properties["migration_population_ratio"],
		"audience_size": properties["audience_size"],
		"current_population": properties["current_population"]
	};

	let htmlContent = "<span>Country Name<br>" + "<strong>" + content["country_name"] + "</strong>" + "<br>"
					+ "Facebook Migration Est.<br>" + "<strong>" + d3.format(',')(content["audience_size"]) + "</strong>" + "<br>"
					+ "Current Population<br>" + "<strong>" + d3.format(',')(content["current_population"]) + "</strong>" + "<br>"
					+ "Migration Population Ratio<br>" + "<strong>" + d3.format(".3r")(content["migration_population_ratio"]) + "</strong><br><br>" 
					+ "<i>(Data Source: Facebook Marketing API)</i>"
					+ "</span>";

	return htmlContent;
}

function getPopUpContentPor(properties) {
	let content = {
		"country_name": properties["country_name"],
		"daily_audience": properties["Daily_Audience"]
	};

	let htmlContent = "<span>Country Name<br>" + "<strong>" + content["country_name"] + "</strong>" + "<br>"
					+ "Facebook Migration Est.<br>" + "<strong>" + d3.format(',')(content["daily_audience"]) + "</strong>" + "<br>"
					+ "<i>Only migrants from Portugal are displayed.</i><br>"
					+ "<i>(Data Source: Facebook Marketing API)</i>"
					+ "</span>";

	return htmlContent;
}

function getPopUpPnas(properties) {
	let content = {
		"country_name": properties["country_name"],
		"category": properties["2015_categories"],
		"2015estimate": properties["2015_total"]
	};

	let htmlContent = "<span>Country Name:<br>"+ "<strong>" + content["country_name"] + "</strong> <br>" 
					+ "Estimated Total Emigration Stock: <br> <strong>" + d3.format(',')(content["2015estimate"]) + "</strong><br><br>"
					+ "<i>from the article <strong>Estimation of emigration, return migration, and transit migration between all pairs of countries</strong><br>"
					+ "by <strong>Jonathan J. Azose</strong> and <strong>Adrian E. Raftery</strong></i>"
					+ "</span>";
	return htmlContent;
}

function getPopUpUn(properties) {
	let content = {
		"country_name": properties["country_name"],
		"category": properties["2019_immigrant_categories"],
		"2019estimate": properties["total_immigrants_2019"]
	};

	let htmlContent = "<span>Country Name<br>"+ "<strong>" + content["country_name"] + "</strong> <br>" 
					+ "Est. Immigrant Stock <br> <strong>" + d3.format(',')(content["2019estimate"]) + "</strong>"
					+ "<br><br><i>(Data Source: International Migrant Stock <br>2019 Dataset of UN)</i>"
					+ "</span>";
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
	    .attr("y", -6)
	    .style("fill", (d, i) => { return layerInterpolator[layerName](i/(len-1))});

	g.selectAll("legend-labels")
	  .data(boxSequence)
	  .enter()
	  .append("text")
	    .attr("x", (d,i) => { return 2 + i*20})
	    .attr("y", 28)
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
		
	g.selectAll("info-text")
		.data([null]).enter().append("text")
			.text("Squares denote percentiles.")
			.attr('y', 42)
			.attr('font-size', '9px')
			.attr('font-style', 'italic');
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
