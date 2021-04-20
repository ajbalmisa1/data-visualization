# data-visualization-covid19-spain-map



# Objective
Our objective is to visualize a map of Spain having the possibility to see those affected by COVID-19 in March 2020 and April 2021 by clicking on two buttons, managing to see the difference of those affected from the beginning of the pandemic until a year later, representing affected number with scale pin radius. 

# Prerequisits

Let start using the example in the sandbox of ```https://github.com/Lemoncode/d3js-typescript-examples/tree/master/02-maps/02-pin-location-scale```.

Then we need to run _npm install_ in the terminal among other commands to install everything necessary to have our map running. 

```bash
npm install
```

To have projections on our map and bring the Canary Islands closer to the peninsula, we must install the _d3-composite-projections_ module and be able to include it in a topojson map using the second command.

```bash
npm install d3-composite-projections --save
```
```bash
npm install @types/topojson-client --save-dev
```

In order to read the _require_ in _index.ts_ we need to launch the following command:

```bash
npm i --save-dev @types/node
```

# Steps

The first thing we have had to do is search for the data, for this we have gone to the government data repository (datos.gob.es), to search for those affected by the pandemic at the autonomous community level . The data has been saved in a stats.ts file along with the data that we had of affected by COVID-19 in March 2020 inside the src folder, leaving the following result.

./stats.ts
```typescript
export const stats_previous = [
  { name: "Andalucía", value: 34 },
  { name: "Aragón", value: 11 },
  { name: "Asturias", value: 5 },
  { name: "Islas Baleares", value: 6 },
  { name: "Islas Canarias", value: 18 },
  { name: "Cantabria", value: 10 },
  { name: "Castilla La Mancha", value: 16 },
  { name: "Castilla y León", value: 19 },
  { name: "Cataluña", value: 24 },  
  { name: "Ceuta", value: 0 },
  { name: "Valencia", value: 30},
  { name: "Extremadura", value: 6},
  { name: "Galicia", value: 3 },
  { name: "Madrid", value: 174 },
  { name: "Melilla", value: 0 },
  { name: "Murcia", value: 0 },
  { name: "Navarra", value: 32 },
  { name: "País Vasco", value: 45},
  { name: "La Rioja", value: 39 },
];

export const stats_current = [
  { name: "Andalucía", value: 6392 },
  { name: "Aragón", value: 2491 },
  { name: "Asturias", value: 1322 },
  { name: "Baleares", value: 1131 },
  { name: "Canarias", value: 1380 },
  { name: "Cantabria", value: 1213 },
  { name: "Castilla La Mancha", value: 7047 },
  { name: "Castilla y León", value: 6847 },
  { name: "Cataluña", value: 19991 },
  { name: "Ceuta", value: 51 },
  { name: "Valencia", value: 5922 },
  { name: "Extremadura", value: 1679 },
  { name: "Galicia", value: 4432 },
  { name: "Madrid", value: 29840 },
  { name: "Melilla", value: 62 },
  { name: "Murcia", value: 1041 },
  { name: "Navarra", value: 2497 },
  { name: "Pais Vasco", value: 6838 },
  { name: "La Rioja", value: 1960 },
];
```

We have also created the ResultEntry interface to dynamically assign the data according to the button we click. 

```typescript
export interface ResultEntry {
  name: string;
  value: number;
}
```
## src/index.html

To add the buttons we must include the following code in html, within the group 'body' 

```html
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="./map.css" />
    <link rel="stylesheet" type="text/css" href="./base.css" />
    <link rel="stylesheet" type="text/css" href="./style.css" />
  </head>
  <body>
    <button id="Previous">Resultados anteriores</button>
    <button id="Actual">Resultados Actuales</button>
    <script src="./index.ts"></script>
  </body>
</html>
```
## src/communities.ts

In this file, we need include the next code:

```typescript
export const latLongCommunities = [
    {
      name: "Madrid",
      long: -3.70256,
      lat: 40.4165,
    },
    {
      name: "Andalucía",
      long: -4.5,
      lat: 37.6,
    },
    {
      name: "Valencia",
      long: -0.37739,
      lat: 39.45975,
    },
    {
      name: "Murcia",
      long: -1.13004,
      lat: 37.98704,
    },
    {
      name: "Extremadura",
      long: -6.16667,
      lat: 39.16667,
    },
    {
      name: "Cataluña",
      long: 1.86768,
      lat: 41.82046,
    },
    {
      name: "País Vasco",
      long: -2.75,
      lat: 43.0,
    },
    {
      name: "Cantabria",
      long: -4.03333,
      lat: 43.2,
    },
    {
      name: "Asturias",
      long: -5.86112,
      lat: 43.36662,
    },
    {
      name: "Galicia",
      long: -7.86621,
      lat: 42.75508,
    },
    {
      name: "Aragón",
      long: -1.0,
      lat: 41.0,
    },
    {
      name: "Castilla y León",
      long: -4.45,
      lat: 41.383333,
    },
    {
      name: "Castilla La Mancha",
      long: -3.000033,
      lat: 39.500011,
    },
    {
      name: "Islas Canarias",
      long: -15.5,
      lat: 28.0,
    },
    {
      name: "Islas Baleares",
      long: 2.52136,
      lat: 39.18969,
    },
    {
      name: "Navarra",
      long: -1.65,
      lat: 42.816666,
    },
    {
      name: "La Rioja",
      long: -2.445556,
      lat: 42.465,
    },
  ];
```

## src/map.css

```css
.country {
    stroke-width: 1;
    stroke: #2f4858;
    fill: #008c86;
  }

.selected-country {
    stroke-width: 1;
    stroke: #bc5b40;
    fill: #f88f70;
  }

.affected-marker {
    stroke-width: 1;
    stroke: #bc5b40;
    fill: #f88f70;
    fill-opacity: 0.7;
  }
```

## src/index.ts

First, we need include the imports routes:

```typescript
import * as d3 from "d3";
import * as topojson from "topojson-client";
const spainjson = require("./spain.json");
const d3Composite = require("d3-composite-projections");
import { latLongCommunities } from "./communities";
import { initialStats, finalStats, ResultEntry } from "./stats";
```



Then, we must create a function to return those affected, given the name of a community and the dataset of the values, we will return the scaled value. The result is as follows:

```typescript
  const calculateBasedOnAffectedCases = (comunidad: string, data: any[]) => {
    const entry = data.find((item) => item.name === comunidad);
    var max = data.reduce((max, item) => (item.value > max ? item.value : max), 0);
    return entry ? (entry.value / max) * 40 : 0;
  };
```
Next, we will change the function to calculate the radius based on the number of affected: 

```typescript
const calculateRadiusBasedOnAffectedCases = (
    comunidad: string,
    data: any[]
  ) => {
    return calculateBasedOnAffectedCases(comunidad, data);
  };
```

Build and creation of Spain map

```typescript
const aProjection = d3Composite
  .geoConicConformalSpain() // Let's make the map bigger to fit in our resolution
  .scale(3300) // Let's center the map
  .translate([500, 400]);

const geoPath = d3.geoPath().projection(aProjection);
const geojson = topojson.feature(spainjson, spainjson.objects.ESP_adm1);
);

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
```
At this point, we must create the UpdateData function, in order to erase the existing circles and create new circles with dynamic radius depending on the number of cases and using what was previously created.

 ```typescript
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
  };
 ```

Finally, we add the button logic with the click event

```typescript
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
``` 