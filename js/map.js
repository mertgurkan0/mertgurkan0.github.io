const mapID = "map-container";

d3.select("#"+mapID)
	.style("height", mapContainerHeight + "px");

var base_map = L.map(mapID).setView(initLoc, initZoom);

// to store label names
base_map.createPane('labels');
base_map.getPane('labels').style.zIndex = 650;
base_map.getPane('labels').style.pointerEvents = 'none';

// base layer without labels
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        attribution: '©OpenStreetMap, ©CartoDB',
        noWrap: true
}).addTo(base_map);

// actual labels
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
        attribution: '©OpenStreetMap, ©CartoDB',
        pane: 'labels',
        noWrap: true
}).addTo(base_map);

d3.queue()
	.defer(d3.json, topologyFile)
	.defer(d3.csv, migFile)
    .defer(d3.json, tradeNetFile)
    .defer(d3.csv, migDistFile)
	.await((err, country_geojson, migData, tradeNet, countryMigDist) => {

        /*
            country_geojson: topology for boundries
            migData: Facebook aggregated data for obtained countries
            tradeNet: trade network between countries
            countryMigDist: migration distribution to various destinations for a specific country
        */

        var controller = new SimF("#netSVG");

        var ISO_map = {}
        country_geojson.features.map((d) => {
        	ISO_map[d.properties["ISO_A3"]] = d.properties["ISO_A2"];
        });

        var name_map = {}
        country_geojson.features.map((d) => {
        	name_map[d.properties["ISO_A3"]] = d.properties["ADMIN"];
        });

  		function onEachFeatureClosure() {
		    return function onEachFeature(feature, layer) {

		    	let selectedCountry = feature.properties["ADMIN"];
				let sindex = _.findIndex(migData, function(o) {return o.country_name == selectedCountry;});

				if (sindex != -1) {
					layer.bindPopup(getPopUpContent(migData[sindex]), {class: "popupContent"});

			        layer.on("mouseover", function(e) {
			        	var popup = e.target.getPopup();
    					popup.setLatLng(e.latlng).openOn(base_map);
			        });

			        layer.on('mouseout', function(e) {
				    	e.target.closePopup();
				    });

				    layer.on('mousemove', function (e) {
				    	// move popup
						var popup = e.target.getPopup().setLatLng(e.latlng);
					});

                    layer.on("click", function(e) {
                        let ISO_A3 = e.target.feature.properties["ISO_A3"];
                        let ISO_A2 = e.target.feature.properties["ISO_A2"];

                        let egoNet = extractEgo(tradeNet, ISO_A3);

                        let table = displayTable(migDistTable, countryMigDist, ""); 

                        updateNet(extractEgo(_.cloneDeep(tradeNet), ISO_A3), controller, table, ISO_map);

                        $("#cName").text(name_map[ISO_A3] + " Trade Network -- Bigger Area For Import, Darker Colors For Export Magnitude");

                    });

			    }
		    }
		}

		function getStyle(layer_cat, ColorInterpolator) {

			var normalizer = d3.scaleLinear()
							.domain(d3.extent(migData.map(x => parseInt(x[layer_cat]))))
  							.range([0, 1]);

			return function createStyle(feature) {

				let style_elems = {
					color: emptyColor,
					opacity: 0.0,
					fillOpacity: 0.0,
					weight: 1,
					fillColor: emptyColor
				};

				let selectedCountry = feature.properties["ADMIN"];
				let sindex = _.findIndex(migData, function(o) {return o.country_name == selectedCountry;});

				if (sindex != -1) {
					let c = ColorInterpolator(normalizer(migData[sindex][layer_cat]));
					style_elems["fillColor"] = c;
					style_elems["opacity"] = 0.8;
					style_elems["fillOpacity"] = 0.8;
				}

				return style_elems;
			}
		}

		var mpr_layer = L.geoJSON(country_geojson, {
			style: getStyle("mpr_categories", ColorInterpolatorOpt1),
			onEachFeature: onEachFeatureClosure()
		});

		var fp_layer = L.geoJSON(country_geojson, {
			style: getStyle("original_categories", ColorInterpolatorOpt2),
			onEachFeature: onEachFeatureClosure()
		});

		var baseMaps = {
			"Migration/Population Ratio": mpr_layer,
			"Facebook Estimates of Migration": fp_layer
		};

		fp_layer.addTo(base_map);  // default layer

		// adding base layers as radio buttons
		L.control.layers(baseMaps, null, {collapsed: false}).addTo(base_map);

		// legend control
		var legend = L.control({position: 'bottomleft'});

	    legend.onAdd = function (map) {

		    var div = L.DomUtil.create('div', 'legend');
		    div.innerHTML += "<svg id=\"legend-svg\" height=" + legendHeight +" width=" + legendWidth + "></svg>";

		    return div;
	    };

	    legend.addTo(base_map);

	    // initialize legend wiht deafult layer
	    changeLegend("Facebook Estimates of Migration", "#legend-svg");

	    // change legend color scale on layer change
		base_map.on("baselayerchange", function(e) {
			let colorInter = layerInterpolator[e.name];

			d3.selectAll(".legend-rect")
				.style("fill", function(d, i){ return colorInter(i/4)});
		});

	});
