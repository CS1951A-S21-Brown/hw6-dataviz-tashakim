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
.attr("transform", `translate(${margin}, ${margin})`)

svg1.append("text")
        .attr("transform", `translate(100,100)`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Count");
// Adds y-axis label
svg1.append("text")
    .attr("transform", `translate(140,140)`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
    .style("text-anchor", "middle")
    .text("Artist");
// Adds chart title
svg1.append("text")
    .attr("transform", `translate(200,200)`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .text("Top Artists in Billboard 100 Charts");

let countRef = svg.append("g");

d3.csv("../data/video_games.csv").then(function(data){
    cleanedData = cleanData(
        data, 
        function(x,y) {
            return parseInt(y["count"], 10) - parseInt(x["count"], 10)}, 
        NUM_EXAMPLES)
    console.log(data)
        
})