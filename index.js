// first lets fetch the data 
let baseTemp;
let values;
const colors = [{color: "rgb(69, 117, 180)",
                 var: -2},
                {color: "rgb(224, 243, 248)",
                 var: 0}, 
                {color: "rgb(253, 174, 97)",
                 var: 2},
                {color: "rgb(215, 48, 39)",
                 var: 5
                }];
const dataSet = {}
const req = new XMLHttpRequest()
req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json", true)
req.send()
req.onload = function(){
    let json = JSON.parse(req.responseText)
    baseTemp = json["baseTemperature"]
    values = json['monthlyVariance']
    console.log(json)
    console.log(values)
    console.log(baseTemp)
    w = 1300
    h = 600
    padding = 60
    //* lets create the svg
    const svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h)
                  .style("background-color", "white")


    //* lets create the scales
    //! xScale
    const xScale = d3.scaleLinear()
                     .range([padding, w - padding])
                     .domain([d3.min(values, (d) => d["year"]), d3.max(values, (d) => d["year"])])

    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d"))
                    .ticks(26)

    svg.append("g")
       .attr("transform", "translate(0, " + (h- padding) +")")
       .attr("id", "x-axis")
       .call(xAxis)

    //! yScale
    const yScale  = d3.scaleTime()
                      .range([padding, h - padding])
                      .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
                      

    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat("%B"))

    svg.append("g")
        .attr("transform", "translate(" +padding + ", 0)")
        .attr("id", "y-axis")
        .call(yAxis)

    
    svg.selectAll("rect")
        .data(values)
        .enter()
        .append("rect")
        .attr("x", (d) => {
         return xScale(d.year)
        })
        .attr("y", (d) => {
            return yScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0))
        })
        .attr("height", (h - (padding * 2))/ 12)
        .attr("width", 3)
        .attr("class", "cell") 
        .style("fill", (d) => {
            if(d.variance < -2){
                return "rgb(69, 117, 180)"
            }else if(d.variance < 0 && d. variance >= -2 ){
                return "rgb(224, 243, 248)"
            }else if(d.variance < 2 && d.variance >= 0){
                return "rgb(253, 174, 97)"
            }else if (d.variance > 2){
                return "rgb(215, 48, 39)"
            }
        })
        .attr("data-month", (d) => d.month - 1)
        .attr("data-year", (d) => d.year)
        .attr("data-temp", (d) => d.variance + baseTemp)
        .on('mouseover', function(e, d){

            d3.select("#tooltip")
              .attr("data-year", d.year)
              .style("opacity", 1)
              .style("left", (e.target.pageX) + "px")
              .style("top", (e.target.pageY) + "px")
              .style("background-color", "rgba(0, 0, 0, .7")
              .html("<p>"+  "Year: "+ d.year + " Month: " + d.month + "  Temp: " +(d.variance + baseTemp) + "  Variance: " + d.variance)
        })
        .on('mouseout', function(e, d){
            d3.select("#tooltip")
              .style("opacity", 0)
              .style("background-color", "none")
        })

    

    const legend = d3.select("#legend")
                     .append("svg")
                     .attr("width", 200)
                     .attr("height", 50)
                     .selectAll("rect")
                     .data(colors)
                     .enter()
                     .append("rect")
                     .attr("width", 40)
                     .attr("height", 40)
                     .attr("y", 0)
                     .attr("x", (d, i) => {d = i * 50; return d})
                     .attr("fill", (d) => d.color)
                     .append("title")
                     .text((d) => d.var);

   
}