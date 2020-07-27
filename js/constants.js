const topologyFile = "data/countries.geojson";
const migFile = "data/mig_data.csv";
const estFile = "data/5yearestimates.csv";
const unFile = "data/un_data_formatted.csv"
const tradeNetFile = "data/2017.json";
const migDistFile = "data/formatted_fromPortugal4.csv";
const porFile = "data/formatted_fromPortugal3.csv";

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
var ColorInterpolatorOpt3 = d3.interpolatePuRd;
var ColorInterpolatorOpt4 = d3.interpolateReds;
var ColorInterpolatorOpt5 = d3.interpolateGreens;

var emptyColor = "#f0f0f0";

const initLoc = [30, 0];
const initZoom = 3;

const layerInterpolator = {
	"Facebook Migration Est./Population Ratio": ColorInterpolatorOpt1,
	"Facebook Estimates of Migration": ColorInterpolatorOpt2,
	"Estimation of Emigration": ColorInterpolatorOpt3,
	"UN Migrant Stock (2019)": ColorInterpolatorOpt4,
	"Portugal Layer": ColorInterpolatorOpt5
};

const tableColumns = [
    {"title": "Country", "field": "country_name", "align": "center"},
    {"title": "Daily Audience", "field": "Daily_Audience", "align": "center"},
    {"title": "Norm. Daily Audience", "field": "Daily_Audience_Per", "align": "center", formatter:"money", formatterParams:{
		    decimal:".",
		    thousand:",",
		    precision:2
		}
	},
    {"title": "Monthly Audience", "field": "Monthly_Audience", "align": "center"},
    {"title": "Norm. Monthly Audience", "field": "Monthly_Audience_Per", "align": "center", formatter:"money", formatterParams:{
		    decimal:".",
		    thousand:",",
		    precision:2
		}
	}

];

const tableDivName = "#migDistTable";
const linkColor = "#737373";
