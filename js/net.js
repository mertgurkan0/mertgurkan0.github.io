'use strict'

function SimF(svgname) {
    this.svgname = svgname;

    var margin = 10;

    let w = $("#netContainer").width();
    let h = statContainerHeight;

    this.ego_svg = d3.select(this.svgname).attr("width", w - 2*margin).attr("height", h);

    this.ego_width = +this.ego_svg.attr("width");
    this.ego_height = +this.ego_svg.attr("height");

    this.ego_svg.attr("viewBox", [-this.ego_width / 2, -this.ego_height / 2, this.ego_width, this.ego_height]);

    this.ego_g = this.ego_svg.append("g")
        .attr("class", "tradeNets")
        .attr("transform","translate(0,-10) scale(1.2, 1.2)");

    this.ego_g.append("g")
    .attr("class", "links");

    this.ego_g.append("g")
        .attr("class", "nodes");

    this.zoom_handler_ego = d3.zoom()
        .on("zoom", () => {
            this.ego_g.attr("transform", d3.event.transform);
        });

    this.zoom_handler_ego(this.ego_svg);
    this.ego_svg.call(this.zoom_handler_ego.transform, d3.zoomIdentity.translate(0, 0).scale(1.2));

    this.simulation_ego = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) {return d.id;}))
        .force("charge", d3.forceManyBodySampled().strength(-350))
        .force('forceX', d3.forceX())
        .force('forceY', d3.forceY())
        .force('center', d3.forceCenter(0,0))
        .force('collision', d3.forceCollide().radius((d) => d.radius));

    this.dragStarted = d => {
        if (!d3.event.active) this.simulation_ego.alphaTarget(0.003).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    this.dragged = d => {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    this.dragEnded = d => {
        if (!d3.event.active) this.simulation_ego.alphaTarget(0);
    }

}

function updateNet(net, cont, table, ISO_map) {
    let nodes = net.nodes;
    let links = net.links;
    links = links.sort((a,b) => d3.descending(a.import, b.import)).slice(0,21);
    let ids = links.map(d => d.target);
    let source = links[0]["source"];
    nodes = nodes.filter(d => ids.includes(d.id));
    nodes.push({"id": source});

    let sizeScaler = d3.scaleLinear()
        .domain(d3.extent(links.map((d) => +d["import"])))
        .range([5, 20]);

    let colorScaler = d3.scaleLinear()
        .domain(d3.extent(links.map((d) => +d["export"])))
        .range(["#e87474", "#99000d"]);

    let ego_link = cont.ego_g.selectAll("g.links").selectAll("line").data(links, function(d) {
        return "l" + d.source + "_" + d.target;
    });

    ego_link.exit().remove();

    ego_link = ego_link.enter().append("line")
        .attr("id", function(d) {
            return "l" + d.source + "_" + d.target;
        })
        .attr("stroke-width", function(d) {
            return 1;
        })
        .attr("stroke", linkColor)
        .merge(ego_link);

    let ego_node = cont.ego_g.select("g.nodes").selectAll("circle").data(nodes, (d) => {
        var comp = "";
        for (var property in d) {
            if (d.hasOwnProperty(property)) {
                comp += d[property];
            }
        }
        return comp;
    });

    ego_node.exit().remove();

    ego_node = ego_node.enter().append("circle")
        .attr("fill", (d) => {
            let r = _.filter(links, (v) => d.id == v.target);
            if (r.length != 0)
                return colorScaler(r[0]["export"]);
            else
                return "white";
        })
        .attr("r", (d) => {
            let r = _.filter(links, (v) => d.id == v.target);
            if (r.length != 0)
                return sizeScaler(r[0]["import"]);
            else
                return 1;
        })
        .on("mouseover", (d) => {
            table.scrollToRow(ISO_map[d.id.toUpperCase()], "center", false);
            table.selectRow(ISO_map[d.id.toUpperCase()]);
        })
        .on("mouseout", (d) => {
            table.deselectRow();
        })
        .call(d3.drag()
            .on("start", cont.dragStarted)
            .on("drag", cont.dragged)
            .on("end", cont.dragEnded));

    cont.simulation_ego.nodes(nodes).on("tick", ticked);
    cont.simulation_ego.force("link").links(links);
    cont.simulation_ego.alpha(0.5).restart();

    function ticked() {
        ego_link
            .attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        //cont.ego_g.selectAll("g.nodes").selectAll("circle")
        ego_node
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
    }
         
}
