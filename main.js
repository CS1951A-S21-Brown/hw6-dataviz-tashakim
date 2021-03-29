// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

let svg1 = d3.select('#graph1')
    .append("svg")
    .attr("width", graph_1_width)
    .attr("height", graph_1_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
////////////////////////////////////////////////////////////////////////

let svg2 = d3.select('#graph2')
    .append("svg")
    .attr("width", graph_2_width + margin.left + margin.right)
    .attr("height", graph_2_height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${graph_2_width/2 -50}, ${graph_2_height/2 + 50})`)
// set the dimensions and margins of the graph
var width = 450,
    height = 450,
    margins = 10;
// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(graph_2_width, graph_2_height) / 2 - margins
// set the color scale
var colors = d3.scaleOrdinal()
    .domain(["a", "b", "c", "d", "e", "f"])
    .range(d3.schemeTableau10);
// Initialize the plot with the first dataset
////////////////////////////////////////////////////////////////////////

let countRef = svg1.append("g");

d3.csv("./data/video_games.csv").then(function(data){
    topTenData = getTopTen(data);
    var genres = d3.map(data, function(d){
        return(d.Genre)
      }).keys();

    data1 = getTopGenres(data, genres, 'NA_Sales');
    data2 = getTopGenres(data, genres, 'EU_Sales');
    data3 = getTopGenres(data, genres, 'JP_Sales');
    data4 = getTopGenres(data, genres, 'Other_Sales');
    update(data1);
    ////////////////////////////////////////////////////////////////////

    let x = d3.scaleLinear()
        .domain([0, d3.max(topTenData, function(d) {
            return parseInt(d["Global_Sales"])
        })])
        .range([0, graph_1_width - margin.left - margin.right]);

    let y = d3.scaleBand()
        .domain(topTenData.map(function(d) {
            return d['Name']
        }))
        .range([0, graph_1_height - margin.bottom - margin.top])
        .padding(0.1);

    svg1.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let bars = svg1.selectAll("rect").data(topTenData);
    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d['Global_Sales'] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 10));

    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d['Global_Sales']) }) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
        .attr("x", x(0))
        .attr("y", function(d) {
            return y(d['Name'])
        })
        .attr("width", function(d) {
            return x(parseInt(d["Global_Sales"]))
        })
        .attr("height", y.bandwidth());
    let counts = countRef.selectAll("text").data(topTenData);

    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) {
            return x(parseInt(d.Global_Sales)) + 5;
        })
        .attr("y", function(d) {
            return y(d.Name) + 13;
        })
        .style("text-anchor", "start")
        .text(function(d) {
            return parseInt(d.Global_Sales);
        });

    svg1.append("text")
        .attr("transform", `translate(${graph_1_width/2}, ${graph_1_height/2})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Global Sales (millions USD)");
    // Adds y-axis label
    svg1.append("text")
        .attr("transform", `translate(0, -10)`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Name of Game");
    // Adds chart title
    svg1.append("text")
        .attr("transform", `translate(${graph_1_width/2}, -10)`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Top 10 Video Games");
})

function update(data) {
    var text;
    if (text) {
        text.remove();
    }
    d3.select(".text").remove();

    var pie = d3.pie()
        .value(function(d) {return d.value; })
    var data_ready = pie(d3.entries(data))
    var arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius + 200);
    // map to data
    var u = svg2.selectAll("path")
        .data(data_ready);
        
    u.enter()
        .append('path')
        .merge(u)
        .transition()
        .duration(1000)
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius))
        .attr('fill', function(d){ 
            return(colors(d.data.key)) 
        })
        .attr("stroke", "white")
        .style("stroke-width", "0.7px")
        .style("opacity", 1);
        
        
    // Initialize the plot with the first dataset
    text = svg2
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function(d){ 
            return d.data.key + ": " + d.data.value.toFixed(2)
        })
        .attr("transform", function(d) { 
            return "translate(" + arcGenerator.centroid(d) + ")";  
        })
        .style("text-anchor", "middle")
        .style("font-size", 10);
        
};

function getTopTen(data) {
    let res = [];
    for (let row of data.slice(0, 10)) {
        var picked = (({ Name, Global_Sales }) => ({ Name, Global_Sales }))(row);
        res.push(picked)
    } 
    return res;
};

function getTopGenres(data, genres, region) {
    var dict = {};
    var arr = [];
    genres.forEach(element => {
        var num = 0;
        var tempData  = data.filter(function(a) { 
            return a.Genre === element; 
        });
        tempData.forEach(item => {
            num += parseFloat(item[region]);
        });
        arr.push([num, element]);
    });

    arr.forEach(element => {
        dict[element[1]] = element[0];
    })
    return dict;
};

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
};