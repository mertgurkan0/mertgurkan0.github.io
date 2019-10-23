const topologyFile = "data/countries.geojson";
const migFile = "data/mig_data.csv";
const tradeNetFile = "data/2017.json";
const migDistFile = "data/portugal.csv";

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
const statContainerHeight = parseInt(h*(1-scaleRatio)) + mapMargins.top;
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

const tableColumns = [
    {"title": "Country", "field": "Country_Names", "align": "center"},
    {"title": "Daily Audience", "field": "Daily_Audience", "align": "center"},
    {"title": "Norm. Daily Audience", "field": "Daily_Audience_Per", "align": "center"},
    {"title": "Monthly Audience", "field": "Monthly_Audience", "align": "center"},
    {"title": "Norm. Monthly Audience", "field": "Monthly_Audience_Per", "align": "center"}

];

const tableDivName = "#migDistTable";

const linkColor = "#525252";
