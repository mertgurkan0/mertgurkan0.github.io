let names = ['ESP', 'CHE', 'TUR', 'GBR', 'USA', 'BEL', 'FRA', 'DEU', 'ITA', 'NLD', 'POL', 'PRT']
let matrix = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 28566554320], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1815977106], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1014009119], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3877296892], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2833900000], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3041258882], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9210902834], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11492024496], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4586841382], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4301522646], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 934913000], [30098014342, 699473339, 605864436, 4338345000, 2777797855, 2716007883, 9386661059, 11942815260, 4459358097, 4755617480, 898202398, 0]]

const width = $("#netContainer").width();
const height = statContainerHeight;

const innerRadius = Math.min(width, height) * 0.5 - 20;
const outerRadius = innerRadius + 10;

/*
const matrix = matrixOld.map(d => {
    let arr = [];
    for (let i=0; i<d.length; i++){
        //arr.push(parseInt(Math.abs(Math.log(d[i] + 0.001))));
        arr.push(2);
    }
    return arr;});
*/

//console.log(matrix);

formatValue = x => `${x.toFixed(0)}B`;

color = d3.scaleOrdinal(names, d3.schemeCategory10);

ribbon = d3.ribbonArrow()
    .radius(innerRadius - 0.5)
    .padAngle(1 / innerRadius);

arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

chord = d3.chordDirected()
    .padAngle(12 / innerRadius)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending);


const svg = d3.select("#netSVG")
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

const chords = chord(matrix);

const textId = "qq";

svg.append("path")
    .attr("id", textId)
    .attr("fill", "none")
    .attr("d", d3.arc()({outerRadius, startAngle: 0, endAngle: 3 * Math.PI}));

svg.append("g")
    .attr("fill-opacity", 0.75)
    .selectAll("g")
    .data(chords)
    .join("path")
    .attr("d", ribbon)
    .attr("fill", d => color(names[d.target.index]))
    .style("mix-blend-mode", "multiply")
    .append("title")
    .text(d => `${names[d.source.index]} owes ${names[d.target.index]} ${formatValue(d.source.value)}`);

svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 9)
    .selectAll("g")
    .data(chords.groups)
    .join("g")
    .call(g => g.append("path")
        .attr("d", arc)
        .attr("fill", d => color(names[d.index]))
        .attr("stroke", "#fff"))
    .call(g => g.append("text")
        .attr("dy", -1)
    .append("textPath")
        .attr("xlink:href", 'http://0.0.0.0:8000#qq')
        .attr("startOffset", d => ((d.endAngle - d.startAngle) / 2 + d.startAngle) * outerRadius - 10)
        .text(d => names[d.index]))
    .call(g => g.append("title")
        .text(d => `${names[d.index]}
owes ${formatValue(d3.sum(matrix[d.index]))}
is owed ${formatValue(d3.sum(matrix, row => row[d.index]))}`));

