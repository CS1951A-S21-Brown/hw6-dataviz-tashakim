var svg5 = d3.select("#graph5");
    var height5 = 500;
    var width5 = 500;
    var color5 = d3.scaleOrdinal(d3.schemeCategory10);
    var f1 = d3.format(".2%");
    var f2 = d3.format(",.0f");
    var link = svg5.append("g").attr("fill","none") 	
        .attr("stroke","#000") 		
        .attr("stroke-opacity",0.2) 
        .selectAll("path") ; 	
    var rect5 = svg5.append("g").selectAll("rect");
    var text5 = svg5.append("g")
            .selectAll("text");
    update();     

function update(){
  
 	var energy = {"nodes":[{"name":"Agricultural 'waste'","category":1},{"name":"Bio-conversion","category":1},{"name":"Liquid","category":1},{"name":"Losses","category":1},{"name":"Solid","category":1},{"name":"Gas","category":1},{"name":"Biofuel imports","category":1},{"name":"Biomass imports","category":1},{"name":"Coal imports","category":1},{"name":"Coal","category":1},{"name":"Coal reserves","category":1},{"name":"District heating","category":1},{"name":"Industry","category":1},{"name":"Heating and cooling - commercial","category":1},{"name":"Heating and cooling - homes","category":1},{"name":"Electricity grid","category":1},{"name":"Over generation / exports","category":1},{"name":"H2 conversion","category":1},{"name":"Road transport","category":1},{"name":"Agriculture","category":1},{"name":"Rail transport","category":1},{"name":"Lighting & appliances - commercial","category":1},{"name":"Lighting & appliances - homes","category":1},{"name":"Gas imports","category":1},{"name":"Ngas","category":1},{"name":"Gas reserves","category":1},{"name":"Thermal generation","category":1},{"name":"Geothermal","category":1},{"name":"H2","category":1},{"name":"Hydro","category":1},{"name":"International shipping","category":1},{"name":"Domestic aviation","category":1},{"name":"International aviation","category":1},{"name":"National navigation","category":1},{"name":"Marine algae","category":1},{"name":"Nuclear","category":1},{"name":"Oil imports","category":1},{"name":"Oil","category":1},{"name":"Oil reserves","category":1},{"name":"Other waste","category":1},{"name":"Pumped heat","category":1},{"name":"Solar PV","category":1},{"name":"Solar Thermal","category":1},{"name":"Solar","category":1},{"name":"Tidal","category":1},{"name":"UK land based bioenergy","category":1},{"name":"Wave","category":1},{"name":"Wind","category":1}],"links":[{"source":0,"target":1,"value":124.729,"category":1},{"source":1,"target":2,"value":0.597,"category":1},{"source":1,"target":3,"value":26.862,"category":1},{"source":1,"target":4,"value":280.322,"category":1},{"source":1,"target":5,"value":81.144,"category":1},{"source":6,"target":2,"value":35,"category":1},{"source":7,"target":4,"value":35,"category":1},{"source":8,"target":9,"value":11.606,"category":1},{"source":10,"target":9,"value":63.965,"category":1},{"source":9,"target":4,"value":75.571,"category":1},{"source":11,"target":12,"value":10.639,"category":1},{"source":11,"target":13,"value":22.505,"category":1},{"source":11,"target":14,"value":46.184,"category":1},{"source":15,"target":16,"value":104.453,"category":1},{"source":15,"target":14,"value":113.726,"category":1},{"source":15,"target":17,"value":27.14,"category":1},{"source":15,"target":12,"value":342.165,"category":1},{"source":15,"target":18,"value":37.797,"category":1},{"source":15,"target":19,"value":4.412,"category":1},{"source":15,"target":13,"value":40.858,"category":1},{"source":15,"target":3,"value":56.691,"category":1},{"source":15,"target":20,"value":7.863,"category":1},{"source":15,"target":21,"value":90.008,"category":1},{"source":15,"target":22,"value":93.494,"category":1},{"source":23,"target":24,"value":40.719,"category":1},{"source":25,"target":24,"value":82.233,"category":1},{"source":5,"target":13,"value":0.129,"category":1},{"source":5,"target":3,"value":1.401,"category":1},{"source":5,"target":26,"value":151.891,"category":1},{"source":5,"target":19,"value":2.096,"category":1},{"source":5,"target":12,"value":48.58,"category":1},{"source":27,"target":15,"value":7.013,"category":1},{"source":17,"target":28,"value":20.897,"category":1},{"source":17,"target":3,"value":6.242,"category":1},{"source":28,"target":18,"value":20.897,"category":1},{"source":29,"target":15,"value":6.995,"category":1},{"source":2,"target":12,"value":121.066,"category":1},{"source":2,"target":30,"value":128.69,"category":1},{"source":2,"target":18,"value":135.835,"category":1},{"source":2,"target":31,"value":14.458,"category":1},{"source":2,"target":32,"value":206.267,"category":1},{"source":2,"target":19,"value":3.64,"category":1},{"source":2,"target":33,"value":33.218,"category":1},{"source":2,"target":20,"value":4.413,"category":1},{"source":34,"target":1,"value":4.375,"category":1},{"source":24,"target":5,"value":122.952,"category":1},{"source":35,"target":26,"value":839.978,"category":1},{"source":36,"target":37,"value":504.287,"category":1},{"source":38,"target":37,"value":107.703,"category":1},{"source":37,"target":2,"value":611.99,"category":1},{"source":39,"target":4,"value":56.587,"category":1},{"source":39,"target":1,"value":77.81,"category":1},{"source":40,"target":14,"value":193.026,"category":1},{"source":40,"target":13,"value":70.672,"category":1},{"source":41,"target":15,"value":59.901,"category":1},{"source":42,"target":14,"value":19.263,"category":1},{"source":43,"target":42,"value":19.263,"category":1},{"source":43,"target":41,"value":59.901,"category":1},{"source":4,"target":19,"value":0.882,"category":1},{"source":4,"target":26,"value":400.12,"category":1},{"source":4,"target":12,"value":46.477,"category":1},{"source":26,"target":15,"value":525.531,"category":1},{"source":26,"target":3,"value":787.129,"category":1},{"source":26,"target":11,"value":79.329,"category":1},{"source":44,"target":15,"value":9.452,"category":1},{"source":45,"target":1,"value":182.01,"category":1},{"source":46,"target":15,"value":19.013,"category":1},{"source":47,"target":15,"value":289.366,"category":1}]}
    var sankey = d3.sankey()
            .nodeWidth(15)
                .nodePadding(10)
            .extent([[1, 1], [width5-10, height5-10]]);;

    var graph = sankey(energy);
    
    console.clear();
	console.log(energy);

      					
        link.data(graph.links) 		
      						.join("path")
                .attr("class","path") 
                .attr("d",d3.sankeyLinkHorizontal())
                .attr("stroke-width", function(d) { 
                return Math.max(1, d.width);});
        
    let sumOfNodesWithoutTargetLinks = d3.sum(graph.nodes, function(node){
      											return node.targetLinks.length == 0 ? 0 : node.value}); 
        
		let sumOfNodesWithoutSourceLinks = d3.sum(graph.nodes, function(node){
      											return node.sourceLinks.length == 0 ? 0 : node.value});
        rect5.data(graph.nodes)
          .join("rect")
            .attr("class","rect")
            .attr("height", d => { return d.y1 - d.y0; })
            .attr("width", d => { return d.x1 - d.x0; })
            .attr("x", d =>{return d.x0})
            .attr("y", d =>{return d.y0})
            .attr("fill", (d,i)=>{return color5(i)})
          .append("title")
          	.text(d => {return `${d.name}\n${f2(d.value)}TWh`
            		+ "\nProportion of graph start total: " + 									f1(d.value/sumOfNodesWithoutTargetLinks)
            		+ " \nProportion of graph end total: " + 						f1(d.value/sumOfNodesWithoutSourceLinks)});
			
   		
        text5.data(graph.nodes)
          .enter()
          .append("text")
            .attr("class", "text")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("x", function(d) { return d.x0 - 6; })
            .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(function(d) { return d.name; })
          .filter(function(d) { return d.x0 < width5 / 2; })
            .attr("x", function(d) { return d.x1 + 6; })
            .attr("text-anchor", "start");


  		console.log(rect5);
    };