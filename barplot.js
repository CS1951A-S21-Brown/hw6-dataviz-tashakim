d3.csv("./data/video_games.csv").then(function(data){
    var genres = d3.map(data, function(d){
        return(d.Genre)
    }).keys();

    var publishers = d3.map(data, function(d){
        return(d.Publisher)
    }).keys();

    var visited = [];
    var groupData = getTopPublishers(data, visited, genres, publishers);
    console.log("groupData: ", groupData);

    var margins = {top: 20, right: 20, bottom: 30, left: 40},
        widths = 600 - margins.left - margins.right,
        heights = 400 - margins.top - margins.bottom;

    var x0  = d3.scaleBand()
        .rangeRound([0, widths], .5)
        .padding(0.2);
    var x1  = d3.scaleBand();
    var y   = d3.scaleLinear()
        .rangeRound([heights, 0]);
    var xAxis = d3.axisBottom().scale(x0)
                .tickValues(groupData.map(d=>d.key));
    var yAxis = d3.axisLeft()
        .scale(y);
    const color = d3.scaleOrdinal(d3.schemePaired);

    var svg3 = d3.select('#graph3')
        .append("svg")
        .attr("width", widths + margin.left + margin.right)
        .attr("height", heights + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left/2 + 30 + "," + margin.top + ")");

    var categoriesNames = groupData.map(function(d) { return d.key; });
    var rateNames       = groupData[0].values.map(function(d) { return d.grpName; });


    x0.domain(categoriesNames);
    x1.domain(rateNames).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(groupData, function(key) { return d3.max(key.values, function(d) { return parseInt(d.grpValue); }); })]);

    svg3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heights + ")")
        .call(xAxis);

    svg3.append("g")
        .attr("class", "y axis")
        .style('opacity','0')
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style('font-weight','bold')
        .attr("stroke", "black")

    svg3.select('.y').transition().duration(500).delay(1300).style('opacity','1');

    var slice = svg3.selectAll(".slice")
        .data(groupData)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform",function(d) { return "translate(" + x0(d.key) + ",0)"; });
    
    
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

    slice.selectAll("rect")
        .data(function(d) { return d.values; })
        .enter().append("rect")
            .attr("width", x1.bandwidth())
            .attr("x", function(d) { return x1(d.grpName); })
            .style("fill", function(d) { return color(d.grpName) })
            .attr("y", function(d) { return y(0); })
            .attr("height", function(d) { return heights - y(0); })
            .on("mouseover", function(d) {
                tooltip
                .html(
                  `<div>Top Publisher: <b>${d.grpName}</b></div><div>Publisher's global sales: <br/>${d.grpValue} Mn USD</div>`
                )
                .style('visibility', 'visible');
                d3.select(this).style("fill", d3.rgb(color(d.grpName)).darker(2));
            })
            .on('mousemove', function () {
                tooltip
                  .style('top', d3.event.pageY - 10 + 'px')
                  .style('left', d3.event.pageX + 10 + 'px');
            })
            .on("mouseout", function(d) {
                tooltip.html(``).style('visibility', 'hidden');
                d3.select(this).style("fill", color(d.grpName));
            })
            

    slice.selectAll("rect")
        .transition()
        .delay(function (d) {return Math.random()*1000;})
        .duration(1000)
        .attr("y", function(d) { return y(d.grpValue); })
        .attr("height", function(d) { return heights- y(d.grpValue); });

        //Legend
    var legend = svg3.selectAll(".legend")
        .data(visited.map(function(d) { return d; }))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
        .style("opacity","0");

    legend.append("rect")
        .attr("x", widths - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return color(d); });

    legend.append("text")
        .attr("x", widths - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {return d; });

    legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");
            

    svg3.append("text")
        .attr("transform", `translate(-45,150) rotate(270)`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Global Sales (Million USD)");
    // Adds y-axis label
    svg3.append("text")
        .attr("transform", `translate(200, 390)`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Genre");

    svg3.append("text")
        .attr("transform", `translate(480, -20)`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 18)
        .text("Company Names");
});

function getTopPublishers(data, visited, genres, publishers) {
    var groupData = [];
    genres.forEach(element => {
        var category = [];
        var tempData  = data.filter(function(a) { 
            return a.Genre === element; 
        });
        
        // for each data in tempdata, add the sales for each publisher
        var pub = [];
        publishers.forEach(publisher => {
            var num = 0;
            tempData.forEach(item => {
                if (item.Publisher === publisher) {
                    num += parseFloat(item['Global_Sales']);
                }
            });
            pub.push([num, publisher]);
            
        })
        pub = pub.sort(function(a, b){return b[0]-a[0]}).slice(0, 1);

        pub.forEach(element => {
            category.push({'grpName' : element[1], grpValue: element[0].toFixed(2)})
            if (!visited.includes(element[1]) ) {
                visited.push(element[1])
            }
        })
        groupData.push({"key" : element, "values": category})
    });
    return groupData;
}