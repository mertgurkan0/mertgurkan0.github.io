const mapMargins = {
	"top": 20,
	"bottom": 20,
	"left": 10,
	"right": 10
};

const w = window.innerWidth - mapMargins.left - mapMargins.right;
const h = window.innerHeight - mapMargins.top - mapMargins.bottom;

var scaleRatio = 0.7;
var legendRatioHeight = 0.1;
var legendRatioWidth = 0.1;

const mapContainerHeight = parseInt(h*scaleRatio);
const legendHeight = parseInt(mapContainerHeight*legendRatioHeight);
const legendWidth = parseInt(w*legendRatioWidth);

var ColorInterpolatorOpt1 = d3.interpolateYlOrRd;
var ColorInterpolatorOpt2 = d3.interpolateYlGnBu;

var emptyColor = "#f0f0f0";

const initLoc = [30, 0];
const initZoom = 3;

const layerInterpolator = {
	"Migration/Population Ratio": ColorInterpolatorOpt1,
	"Facebook Estimates of Migration": ColorInterpolatorOpt2
};