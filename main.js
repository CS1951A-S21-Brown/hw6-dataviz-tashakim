// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height  = 320;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

let svg1 = d3.select('#graph1')
    .append("svg")
    .attr("width", graph_1_width)
    .attr("height", graph_1_height + margin.bottom + margin.top)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
////////////////////////////////////////////////////////////////////////

let svg2 = d3.select('#graph2')
    .append("svg")
    .attr("width", graph_2_width )
    .attr("height", graph_2_height + margin.top + margin.bottom*2)
    .append("g")
    .attr("transform", `translate(${margin.left * 2.3}, ${margin.top * 4.8})`)
// set the dimensions and margins of the graph
var width = 450,
    height = 450,
    margins = 10;
// The radius of the pieplot is half the width or half the height (smallest one)
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
        .range([0, graph_1_height - margin.bottom ])
        .padding(0.3);

    svg1.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let bars = svg1.selectAll("rect").data(topTenData);
    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d['Global_Sales'] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 10));

    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { 
            return color(d['Global_Sales']) 
        }) 
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
        .attr("transform", `translate(${graph_1_width/4}, ${graph_1_height - 10})`)   
        .style("text-anchor", "middle")
        .text("Global Sales (millions USD)");
    // Adds y-axis label
    svg1.append("text")
        .attr("transform", `translate(-60, -10)`)    
        .style("text-anchor", "middle")
        .text("Name of Game");

})

function update(data) {
    
    d3.select(".text").remove();

    var pie = d3.pie()
        .value(function(d) {return d.value; })
    var data_ready = pie(d3.entries(data))
    var arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius + 230);
    // map to data
    var u = svg2.selectAll("path")
        .data(data_ready);
        
    u.enter()
        .append('path')
        .merge(u)
        .transition()
        .duration(1500)
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
    svg2.selectAll("text").remove();

    var tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'd3-tooltip')
        .style('background', 'rgba(0,0,0,0.6)')
        .style('visibility', 'hidden')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('border-radius', '4px')
        .style('padding', '20px')
        .style('color', '#fff')
        .text('a simple tooltip');

    var slices = svg2
        .selectAll('path')
        .on("mouseover", function(d) {
            tooltip
            .html(
              `<div># ${d.index +1}: <b>${d.data.key}</b></div><div>Regional Sales: <b>${d.value.toFixed(2)} Million USD</b></div>`
            )
            .style('visibility', 'visible');
            d3.select(this).style("fill", d3.rgb(colors(d.data.key)).darker(-1));
        })
        .on('mousemove', function () {
            tooltip
              .style('top', d3.event.pageY - 10 + 'px')
              .style('left', d3.event.pageX + 10 + 'px');
        })
        .on("mouseout", function(d) {
            tooltip.html(``).style('visibility', 'hidden');
            d3.select(this).style("fill", colors(d.data.key));
        })

    var text = svg2
        .selectAll('mySlices')
        .data(data_ready)

    var total = Object.values(data).reduce((a, b) => a + b, 0);

    text.enter()
        .append('text')
        .merge(text)
        .transition()
        .text(function(d){ 
            if (d.index < 10) {
                console.log("percent: " + d)
                return d.index + 1 + ". " + d.data.key + " (" + (d.data.value * 100 / total).toFixed(1) + "%) "
            }
            
        })
        .attr("transform", function(d) { 
            return "translate(" + arcGenerator.centroid(d) + ")";  
        })
        .style("text-anchor", "middle")
        .style("font-size", 9);
    
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