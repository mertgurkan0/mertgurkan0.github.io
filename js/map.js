const mapID = "map-container";

d3.select("#"+"map-container")
	.style("height", mapContainerHeight + "px");

var base_map = L.map(mapID).setView(initLoc, initZoom);

// to store label names
base_map.createPane('labels');
base_map.getPane('labels').style.zIndex = 650;
base_map.getPane('labels').style.pointerEvents = 'none';

// mbAttr = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
// mbUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';

// L.tileLayer(mbUrl, {id: 'mapbox.streets', attribution: mbAttr}).addTo(base_map);

// L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
// 	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
// 	maxZoom: 16
// }).addTo(base_map);

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
	.defer(d3.json, "data/countries.geojson")
	.defer(d3.csv, "data/mig_data.csv")
	.await((err, country_geojson, migData) => {

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