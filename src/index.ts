import * as d3 from "d3";
import { interpolateMagma } from "d3";
import { on } from "node:events";
import * as topojson from "topojson-client";
const spainjson = require("./spain.json");
const d3Composite = require("d3-composite-projections");
import { latLongCommunities } from "./communities";
import { stats_current, stats_previous, ResultEntry } from "./stats";

const div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

/*const color = d3
  .scaleThreshold<number, string>()
  .domain([0, 1, 100, 500, 700, 5000])
  .range([
    "#FFFFF",
    "#FFE8E5",
    "#F88F70",
    "#CD6A4E",
    "#A4472D",
    "#7B240E",
    "#540000",
  ]);

  const colorCommunity = d3
  .scaleThreshold<number, string>()
  .domain([0, 3, 10, 20, 50, 100, 200])
  .range([
    "#FFFFF",
    "#FFE8E5",
    "#F88F70",
    "#CD6A4E",
    "#A4472D",
    "#7B240E",
    "#540000",
  ]);*/

/*const maxAffected = (data: ResultEntry[]) => data.reduce(
  (max, item) => (item.value > max ? item.value : max),
  0
);

const affectedRadiusScale = (data: ResultEntry[]) => d3
  .scaleLinear()
  .domain([0, maxAffected(data)])
  .range([0, 50]);
*/

  const calculateBasedOnAffectedCases = (comunidad: string, data: any[]) => {
    const entry = data.find((item) => item.name === comunidad);
    var max = data.reduce((max, item) => (item.value > max ? item.value : max), 0);
    return entry ? (entry.value / max) * 40 : 0;
  };
  
const calculateRadiusBasedOnAffectedCases = (
    comunidad: string,
    data: any[]
  ) => {
    return calculateBasedOnAffectedCases(comunidad, data);
  };

const aProjection = d3Composite
  .geoConicConformalSpain()
  .scale(3300)
  .translate([500, 400]);
const geoPath = d3.geoPath().projection(aProjection);

const geojson = topojson.feature(spainjson, spainjson.objects.ESP_adm1);

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 1024)
  .attr("height", 800)
  .attr("style", "background-color: #FBFAF0");

svg
  .selectAll("path")
  .data(geojson["features"])
  .enter()
  .append("path")
  .attr("class", "country")
  .attr("d", geoPath as any);

  const updateData = (data: ResultEntry[]) => {
    svg.selectAll("circle").remove();
    svg
      .selectAll("circle")
      .data(latLongCommunities)
      .enter()
      .append("circle")
      .attr("class", "affected-marker")
      .attr("r", (d) => calculateRadiusBasedOnAffectedCases(d.name, data))
      .attr("cx", (d) => aProjection([d.long, d.lat])[0])
      .attr("cy", (d) => aProjection([d.long, d.lat])[1])
      /*.on("mouseover", function (e: any, datum:any) {            
        const coords = { x: e.x, y: e.y };
        div.transition().duration(200).style("opacity", 0.9);
        div
          .html(`<span>${datum.name}: ${calculateBasedOnAffectedCases(datum.name, data)}</span>`)
          .style("left", `${coords.x}px`)
          .style("top", `${coords.y - 28}px`);
      })
      .on("mouseout", function (datum) {    
        div.transition().duration(500).style("opacity", 0);
      });*/
  };

  document
  .getElementById("Previous")
  .addEventListener("click", function handleResultsApril() {
    updateData(stats_previous);
  });

document
  .getElementById("Actual")
  .addEventListener("click", function handleResultsNovember() {
    updateData(stats_current);
  });