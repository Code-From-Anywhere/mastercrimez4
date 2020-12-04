const Amsterdam = require("../assets/citiesraw/amsterdam.json");
const Bali = require("../assets/citiesraw/bali.json");
const Barcelona = require("../assets/citiesraw/barcelona.json");
const Berlin = require("../assets/citiesraw/berlin.json");
const Brussels = require("../assets/citiesraw/brussels.json");
const Dublin = require("../assets/citiesraw/dublin.json");
const London = require("../assets/citiesraw/london.json");
const Madrid = require("../assets/citiesraw/madrdid.json");
const newyork = require("../assets/citiesraw/newyork.json");
const Paris = require("../assets/citiesraw/paris.json");
const Porto = require("../assets/citiesraw/porto.json");
const Rome = require("../assets/citiesraw/rome.json");
const sanfransisco = require("../assets/citiesraw/sanfransisco.json");
const fs = require("fs");

function Point(latitude, longitude) {
  this.latitude = latitude;
  this.longitude = longitude;
}

function Region(points) {
  this.points = points || [];
  this.length = points.length;
}

Region.prototype.area = function () {
  var area = 0,
    i,
    j,
    point1,
    point2;

  for (i = 0, j = this.length - 1; i < this.length; j = i, i++) {
    point1 = this.points[i];
    point2 = this.points[j];
    area += point1.latitude * point2.longitude;
    area -= point1.longitude * point2.latitude;
  }
  area /= 2;

  return area;
};

Region.prototype.centroid = function () {
  var latitude = 0,
    longitude = 0,
    i,
    j,
    f,
    point1,
    point2;

  for (i = 0, j = this.length - 1; i < this.length; j = i, i++) {
    point1 = this.points[i];
    point2 = this.points[j];
    f = point1.latitude * point2.longitude - point2.latitude * point1.longitude;
    latitude += (point1.latitude + point2.latitude) * f;
    longitude += (point1.longitude + point2.longitude) * f;
  }

  f = this.area() * 6;

  return new Point(latitude / f, longitude / f);
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

Array.prototype.getLength = function () {
  return this.reduce((sum, elt) => sum + (elt.length ? elt.getLength() : 1), 0);
};

function earthDistance(lat1, long1, lat2, long2, response) {
  const m = Math.PI / 180;

  lat1 = lat1 * m;
  long1 = long1 * m;
  lat2 = lat2 * m;
  long2 = long2 * m;

  var R = 6371e3; // metres of earth radius

  var x = (long2 - long1) * Math.cos((lat1 + lat2) / 2);
  var y = lat2 - lat1;

  var d = Math.sqrt(x * x + y * y) * R;

  return response === "m" ? Math.round(d / 10) * 10 : Math.round(d / 1000); //in kilometers!
}

const cities = {
  Amsterdam,
  Bali,
  Barcelona,
  Berlin,
  Brussels,
  Dublin,
  London,
  Madrid,
  "New York": newyork,
  Paris,
  Porto,
  Rome,
  "San Fransisco": sanfransisco,
};

const takeBiggest = (previous, current) =>
  previous.getLength() > current.getLength() ? previous : current;

const importAreas = async (MapArea) => {
  await MapArea.destroy({ where: {} });
  const newJson = Object.keys(cities).map((name) => {
    const data = cities[name];
    //const data = Amsterdam; //keep for type interpretation purposes

    const areas = data.features.map((feature, index) => {
      let areaName;
      if (name === "Amsterdam" || name === "Brussels") {
        areaName = feature.properties.neighbourhood;
      } else if (name === "Barcelona") {
        areaName = feature.properties.NOM;
      } else if (name === "Bali") {
        areaName = capitalizeFirstLetter(
          feature.properties.nm_kabkota.toLowerCase()
        );
      } else if (name === "Porto") {
        areaName = feature.properties.title;
      } else {
        areaName = feature.properties.name;
      }

      const coords = feature.geometry.coordinates;
      areaPolygon = coords.reduce(takeBiggest, []); //takes the biggest, and latest

      if (areaPolygon.length === 1) {
        areaPolygon = areaPolygon[0];
      } else if (areaPolygon[0].length !== 2) {
        //this is scary, but i assume the area exists of multiple polygons and I just simply concatenate them.
        // areaPolygon = areaPolygon.reduce(
        //   (previous, current) => previous.concat(current),
        //   []
        // );
        areaPolygon = areaPolygon.reduce(takeBiggest, []);

        //areaPolygon = areaPolygon[0].concat(areaPolygon[1]);
      }

      areaPolygon = areaPolygon.map((coord) => ({
        latitude: coord[1],
        longitude: coord[0],
      }));

      if (areaPolygon.length > 100) {
        let n = 0;
        areaPolygon = areaPolygon.filter((current, index) => {
          const next = areaPolygon[index + 1];

          //   if (
          //     next &&
          //     earthDistance(
          //       current.latitude,
          //       current.longitude,
          //       next.latitude,
          //       next.longitude,
          //       "m"
          //     ) < 100 &&
          //     n < 10
          //   ) {
          //     n++;
          //     return false;
          //   } else {
          //     n = 0;
          //     return true;
          //   }

          // slaat sommige coordinates over als er meer dan 100 zijn(bij 300 slaat hij 1 op de 3 over)
          // echter word hij niet overgeslagen als de volgende coordinaat verder dan 100 meter ver weg is.
          return (
            index % Math.round(areaPolygon.length / 100) === 0 ||
            (next &&
              earthDistance(
                current.latitude,
                current.longitude,
                next.latitude,
                next.longitude,
                "m"
              ) > 100)
          );
          //deze optimalisatie werkt wel, want de file gaat van 9 mb naar 800kb maar helaas pakt hij soms een hoekje niet mee omdat hij gewoon simpelweg lineair datapoints overslaat
        });
      }

      //we now got a good areaPolygon

      const region = new Region(areaPolygon);

      const center = region.centroid();

      const lowestLatitude = areaPolygon.reduce(
        (previous, current) =>
          current.latitude < previous ? current.latitude : previous,
        Infinity
      );
      const highestLatitude = areaPolygon.reduce(
        (previous, current) =>
          current.latitude > previous ? current.latitude : previous,
        -1 * Infinity
      );

      const lowestLongitude = areaPolygon.reduce(
        (previous, current) =>
          current.longitude < previous ? current.longitude : previous,
        Infinity
      );
      const highestLongitude = areaPolygon.reduce(
        (previous, current) =>
          current.longitude > previous ? current.longitude : previous,
        -1 * Infinity
      );

      const latitudeDelta = highestLatitude - lowestLatitude;
      const longitudeDelta = highestLongitude - lowestLongitude;

      console.log("CENter", center);
      const centerLatitude = center.latitude;
      const centerLongitude = center.longitude;
      //   const delta = 0.05;

      console.log(`for ${name} - ${areaName}: ${areaPolygon.length}`);

      const code = `${name}${index}`;
      MapArea.create({
        code,
        city: name,
        name: areaName,
        centerLatitude,
        centerLongitude,
        latitudeDelta,
        longitudeDelta,
      });

      return {
        code,
        city: name,
        name: areaName,
        area: areaPolygon,
        centerLatitude,
        centerLongitude,
        latitudeDelta,
        longitudeDelta,
      };
    });

    return { city: name, areas: areas };
  });

  let jsonString = JSON.stringify(newJson);

  fs.writeFile("../client/assets/map/cities.json", jsonString, (err) => {
    if (err) throw err;
    console.log("Data written to file");
  });

  return "hoi";
};

module.exports = { importAreas };
