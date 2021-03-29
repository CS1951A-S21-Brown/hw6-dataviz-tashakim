
// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like

let graph_4_width = MAX_WIDTH / 1.5, graph_4_height = 575;
let scale = 7;

// The svg
var svg4 = d3.select("#graph4")
    .append("svg")
    .attr("width", graph_4_width)
    .attr("height",graph_4_height)

// Map and projection
var projection = d3.geoMercator()
    .center([2, 47])                // GPS of location to zoom on
    .scale(100)                       // This is like the zoom
    .translate([ graph_4_width/3, graph_4_height/2 ])


// Create data for circles:
var markers = [
  {long: -97.000, lat: 38.090, group: "A", size: 877.83/scale, region: "North America", sales: 877.83, genre: "Action"}, // North america
  {long: 138.2529, lat: 36.2048, group: "B", size: 352.31/scale, region: "Japan", sales: 352.31,  genre: "Role-Playing"}, // Japan
  {long: 15.255, lat: 54.526, group: "C", size: 525.00/scale, region: "Europe", sales: 525.00, genre: "Action"}, // Europe
];
console.log(svg4)



// Load external data and boot
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then (function(t){
    console.log(t);    
    // Filter data
   
    // Create a color scale
    var color2 = d3.scaleOrdinal()
      .domain(["A", "B", "C" ])
      .range([ "#402D54", "#D18975", "#8FD175"])

    // Add a scale for bubble size
    var size = d3.scaleLinear()
      .domain([1,100])  // What's in the data
      .range([ 4, 50])  // Size in pixel

    // Draw the map
    var bubbles = svg4.append("g")
        .selectAll("path")
        .data(t.features)
        .enter()
        .append("path")
          .attr("fill", "#b8b8b8")
          .attr("d", d3.geoPath()
              .projection(projection)
          )
        .style("stroke", "black")
        .style("opacity", .3)

    // Add circles:

    var tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'd3-tooltip')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .style('padding', '10px')
        .style('background', 'rgba(0,0,0,0.6)')
        .style('border-radius', '4px')
        .style('color', '#fff')
        .text('a simple tooltip');
        
    svg4
      .selectAll("myCircles")
      .data(markers)
      .enter()
      .append("circle")
        .attr("cx", function(d){ return projection([d.long, d.lat])[0] })
        .attr("cy", function(d){ return projection([d.long, d.lat])[1] })
        .attr("r", function(d){ return size(d.size) })
        .style("fill", function(d){ return color2(d.group) })
        .attr("stroke", function(d){ return color2(d.group) })
        .attr("stroke-width", 3)
        .attr("fill-opacity", .3)
        .on("mouseover", function(d) {
            tooltip
            .html(
              `<div>Most Popular Genre: <b>${d.genre}</b></div><div>Region sales: ${d.sales} Mn USD</div>`
            )
            .style('visibility', 'visible');
            d3.select(this).style("fill", d3.rgb(colors(d.group)).darker(2));
        })
        .on('mousemove', function () {
            tooltip
              .style('top', d3.event.pageY - 10 + 'px')
              .style('left', d3.event.pageX + 10 + 'px');
        })
        .on("mouseout", function(d) {
            tooltip.html(``).style('visibility', 'hidden');
            d3.select(this).style("fill", colors(d.group));
        })

})

