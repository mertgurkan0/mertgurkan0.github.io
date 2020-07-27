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

Promise.all([
	d3.json(topologyFile),
	d3.csv(migFile),
	d3.csv(estFile),
	d3.csv(unFile),
	d3.csv(porFile),
    d3.json(tradeNetFile),
    d3.csv(migDistFile)])
		.then(([country_geojson, migData, estData, unData, porData, tradeNet, countryMigDist]) => {

        /*
            country_geojson: topology for boundries
			migData: Facebook aggregated data for obtained countries
			estData: Country2Country net migration estimates
            tradeNet: trade network between countries
            countryMigDist: migration distribution to various destinations for a specific country
        */

        //var controller = new SimF("#netSVG");
        var ISO_map = {}
        country_geojson.features.map((d) => {
        	ISO_map[d.properties["ISO_A3"]] = d.properties["ISO_A2"];
        });

        var name_map = {}
        country_geojson.features.map((d) => {
        	name_map[d.properties["ISO_A3"]] = d.properties["ADMIN"];
		});
		
		function onEachFeatureClosurePor(){
			return function onEachFeature(feature, layer){
				let selectedCountry = feature.properties["ADMIN"];
				let sindex = _.findIndex(porData, function(o) {return o.country_name == selectedCountry;});
				//console.log("Test Layer", selectedCountry, sindex);
				if (sindex != -1) {
					// To-Do: popup func. should change
					layer.bindPopup(getPopUpContentPor(porData[sindex]), {class: "popupContent"});

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

					//$(".leaflet-control-layers").prepend("<label id='panel-title'>Control Panel</label>");

                    layer.on("click", function(e) {
						//comment 2 lines below after testing
						base_map.removeLayer(por_layer);
						baseMaps['Facebook Estimates of Migration'].addTo(base_map);
						//$(".leaflet-control-layers").prepend("<label id='panel-title' style='text-align:center; font-size:1.5em;'>Available Layers</label>");

                        let ISO_A3 = e.target.feature.properties["ISO_A3"];
                        let ISO_A2 = e.target.feature.properties["ISO_A2"];

                        let egoNet = extractEgo(tradeNet, ISO_A3);

                        let table = displayTable(migDistTable, countryMigDist, ""); 

                        //updateNet(extractEgo(_.cloneDeep(tradeNet), ISO_A3), controller, table, ISO_map);

                        //$("#cName").text(" Trade Network of " + name_map[ISO_A3]);

                        let mapLayers = base_map._layers;
                        for (l in mapLayers) {
                        	clayer = mapLayers[l];
                        	//console.log(clayer);

                        	if ("feature" in clayer) {
                        		clayer.setStyle({color: "#f0f0f0"});
                        	}
                        }

                        layer.setStyle({color: "red"});

                    });

			    }
			}
		}

		
		function onEachFeatureClosureUn(){
			return function onEachFeature(feature, layer){
				let selectedCountry = feature.properties["ADMIN"];
				let sindex = _.findIndex(unData, function(o) {return o.country_name == selectedCountry;});
				//console.log("Test Layer", selectedCountry, sindex);
				if (sindex != -1) {
					layer.bindPopup(getPopUpUn(unData[sindex]), {class: "popupContent"});

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

                        //updateNet(extractEgo(_.cloneDeep(tradeNet), ISO_A3), controller, table, ISO_map);

                        //$("#cName").text(" Trade Network of " + name_map[ISO_A3]);

                        let mapLayers = base_map._layers;
                        for (l in mapLayers) {
                        	clayer = mapLayers[l];
                        	//console.log(clayer);

                        	if ("feature" in clayer) {
                        		clayer.setStyle({color: "#f0f0f0"});
                        	}
                        }

                        layer.setStyle({color: "red"});

                    });

			    }
			}
		}

		function onEachFeatureClosureAllCountries(){
			return function onEachFeature(feature, layer){
				let selectedCountry = feature.properties["ADMIN"];
				let sindex = _.findIndex(estData, function(o) {return o.country_name == selectedCountry;});
				//console.log("Test Layer", selectedCountry, sindex);
				if (sindex != -1) {
					layer.bindPopup(getPopUpPnas(estData[sindex]), {class: "popupContent"});

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

                        //updateNet(extractEgo(_.cloneDeep(tradeNet), ISO_A3), controller, table, ISO_map);

                        //$("#cName").text(" Trade Network of " + name_map[ISO_A3]);

                        let mapLayers = base_map._layers;
                        for (l in mapLayers) {
                        	clayer = mapLayers[l];
                        	//console.log(clayer);

                        	if ("feature" in clayer) {
                        		clayer.setStyle({color: "#f0f0f0"});
                        	}
                        }

                        layer.setStyle({color: "red"});

                    });

			    }
			}
		}

  		function onEachFeatureClosure() {
		    return function onEachFeature(feature, layer) {

				let selectedCountry = feature.properties["ADMIN"];
				// fix csv files if country name columns are not named as 'country_name'
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
						//comment 2 lines below after testing
						base_map.removeLayer(baseMaps['Facebook Estimates of Migration']);
						por_layer.addTo(base_map);
						
						let colorInter = layerInterpolator["Portugal Layer"];

						d3.selectAll(".legend-rect")
							.style("fill", function(d, i){ return colorInter(i/4)});

                        let ISO_A3 = e.target.feature.properties["ISO_A3"];
                        let ISO_A2 = e.target.feature.properties["ISO_A2"];

                        let egoNet = extractEgo(tradeNet, ISO_A3);

                        let table = displayTable(migDistTable, countryMigDist, ""); 

                        //updateNet(extractEgo(_.cloneDeep(tradeNet), ISO_A3), controller, table, ISO_map);

                        //$("#cName").text(" Trade Network of " + name_map[ISO_A3]);
                        $("#netSVG").style("opacity", 1);

                        let mapLayers = base_map._layers;
                        for (l in mapLayers) {
                        	clayer = mapLayers[l];
                        	//console.log(clayer);

                        	if ("feature" in clayer) {
                        		clayer.setStyle({color: "#f0f0f0"});
                        	}
                        }

                        layer.setStyle({color: "red"});

                    });

			    }
		    }
		}

		function getStyle(dataset, layer_cat, ColorInterpolator) {

			var normalizer = d3.scaleLinear()
							.domain(d3.extent(dataset.map(x => parseInt(x[layer_cat]))))
  							.range([0, 1]);
			//console.log(layer_cat, normalizer.domain(), normalizer.range());
			return function createStyle(feature) {

				let style_elems = {
					color: emptyColor,
					opacity: 0.0,
					fillOpacity: 0.0,
					weight: 1,
					fillColor: emptyColor
				};

				let selectedCountry = feature.properties["ADMIN"];
				let sindex = _.findIndex(dataset, function(o) {return o.country_name == selectedCountry;});

				if (sindex != -1) {
					let c = ColorInterpolator(normalizer(dataset[sindex][layer_cat]));
					style_elems["fillColor"] = c;
					style_elems["opacity"] = 0.8;
					style_elems["fillOpacity"] = 0.8;
				}

				return style_elems;
			}
		}

		var mpr_layer = L.geoJSON(country_geojson, {
			style: getStyle(migData, "mpr_categories", ColorInterpolatorOpt1),
			onEachFeature: onEachFeatureClosure()
		});

		var fp_layer = L.geoJSON(country_geojson, {
			style: getStyle(migData, "original_categories", ColorInterpolatorOpt2),
			onEachFeature: onEachFeatureClosure()
		});

		var pnas_layer = L.geoJSON(country_geojson, {
			style: getStyle(estData, "2015_categories", ColorInterpolatorOpt3),
			onEachFeature: onEachFeatureClosureAllCountries()
		});

		var un_layer = L.geoJSON(country_geojson, {
			style: getStyle(unData, "2019_immigrant_categories", ColorInterpolatorOpt4),
			onEachFeature: onEachFeatureClosureUn()
		}); 

		var por_layer = L.geoJSON(country_geojson, {
			style: getStyle(porData, "Daily_Audience_cats", ColorInterpolatorOpt5),
			onEachFeature: onEachFeatureClosurePor()
		}); 

		var baseMaps = {
			"Facebook Estimates of Migration": fp_layer,
			"Facebook Migration Est./Population Ratio": mpr_layer,
			"Estimation of Emigration": pnas_layer,
			"UN Migrant Stock (2019)": un_layer
		};

		fp_layer.addTo(base_map);  // default layer

		// adding base layers as radio buttons
		L.control.layers(baseMaps, null, {collapsed: false}).addTo(base_map);
		$(".leaflet-control-layers").prepend("<label id='panel-title' style='text-align:center; font-size:1.5em;'>Available Layers</label>");


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

