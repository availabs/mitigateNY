import get from "lodash/get";
import { LayerContainer } from "~/modules/avl-maplibre/src";
import { getColorRange } from "~/modules/avl-components/src";
// import {drawLegend} from "./drawLegend.jsx";
import {d3Formatter} from "../../../../../../../utils/macros.jsx";

class CirclesOptions extends LayerContainer {
  constructor(props) {
    super(props);
  }

  name = "ccl";
  id = "ccl";
  data = [];
  sources = [
    {
      id: "counties",
      source: {
        "type": "vector",
        "url": "https://tiles.availabs.org/data/tl_2020_36_county.json"
      },
    },
    {
      id: "tracts",
      source: {
        "type": "vector",
        "url": "https://tiles.availabs.org/data/tl_2020_36_tract.json"
      },
    },
    {
      id: "circles",
      source: {
        "type": "geojson",
        data: {
          type: 'FeatureCollection',
          features: [],
        }
      },
    }
  ];

  layers = [
    {
      "id": "counties",
      "source": "counties",
      "source-layer": "tl_2020_us_county",
      "type": "fill",
      "paint": {
        "fill-color": '#d3d3d3'
      }
    },
    {
      "id": "counties-line",
      "source": "counties",
      "source-layer": "tl_2020_us_county",
      "type": "line",
      paint: {
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          5, 0,
          22, 1
        ],
        "line-color": "#000000",
        "line-opacity": 0.5
      }
    },
    {
      "id": "tracts",
      "source": "tracts",
      "source-layer": "tl_2020_36_tract",
      "type": "fill",
      "paint": {
        "fill-color": '#d3d3d3'
      }
    },
    {
      "id": "tracts-line",
      "source": "tracts",
      "source-layer": "tl_2020_36_tract",
      "type": "line",
      "paint": {
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          5, 0,
          22, 1
        ],
        "line-color": "#252525",
        "line-opacity": 0.3
      }
    },
    {
      "id": "circles",
      "source": "circles",
      "type": "circle",
      "paint": {
        'circle-color': ['get', 'color'],
        'circle-opacity': 0.5,
        'circle-radius': ['get', 'radius'],
      }
    },
  ];

  legend = {
    Title: e => '',
    type: "threshold",
    format: "0.2s",
    domain: [0, 25, 50, 75, 100],
    range: getColorRange(5, "RdYlGn", false),
    show: true
  };

  onHover = {
    layers: ['circles'],
    HoverComp: ({ data, layer }) => {
      return (
        <div style={{ maxHeight: "300px" }} className={`rounded relative px-1 overflow-auto scrollbarXsm bg-white`}>
          {
            data?.length && data.map((row, i) =>
              <div key={i} className="flex">
                {
                  row?.length && row.map((d, ii) =>
                    <div key={ii}
                      // style={{maxWidth: '200px'}}
                         className={`
                    ${ii === 0 ? "flex-1 font-bold" : "overflow-auto scrollbarXsm"}
                    ${row.length > 1 && ii === 0 ? "mr-4" : ""}
                    ${row.length === 1 && ii === 0 ? `border-b-2 text-lg ${i > 0 ? "mt-1" : ""}` : ""}
                    `}>
                      {d}
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
      );
    },
    callback: (layerId, features, lngLat) => {
      return features.reduce((a, feature) => {
        console.log('feature', feature)
        let { view: currentView, data } = this.props;
        const fmt = d3Formatter('0.2s');
        let record = data.find(d => d.event_id === feature.properties.event_id),
          response = [
            [feature.properties.geoid, ''],
            ...Object.keys(record || {})
              .filter(key => key !== 'geoid')
              .map(key => [key, fmt(get(record, key))]),
            currentView?.paintFn ? ['Total', fmt(currentView.paintFn(record || {}) || 0)] : null,
          ];
        return response;
      }, []);
    }
  };

  init(map, falcor, props) {
    map.fitBounds([-125.0011, 24.9493, -66.9326, 49.5904]);
    map.on('idle', (e) => {
      const canvas = document.querySelector("canvas.maplibregl-canvas"),
          newCanvas = document.createElement("canvas");

      let img;

      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height;

      const context = newCanvas.getContext("2d")
      context.drawImage(canvas, 0, 0);


      // drawLegend({legend: this.legend, filters: this.filters, size: this.props.size}, newCanvas, canvas);
      img = newCanvas.toDataURL();
      this.img = img;
      this.props.change({filters: this.filters, img, bounds: map.getBounds(), legend: this.legend, style: this.style})

    })

  }

  handleMapFocus(map, props) {
    if (props.mapFocus) {
      try {
          map.fitBounds(props.mapFocus)
      } catch (e) {
        map.fitBounds([-125.0011, 24.9493, -66.9326, 49.5904]);
      }
    } else {
    map.fitBounds([-125.0011, 24.9493, -66.9326, 49.5904]);
    }
  }

  paintMap(map, props) {
    let { geoColors = {}, domain = [], colors = [], title = '', geoLayer = 'counties', geoJson = {} } = props
    this.legend.domain = domain;
    this.legend.range = colors;
    this.legend.title = title;
    const hideLayer = geoLayer === 'counties' ? 'tracts' : 'counties';
    map.setFilter(geoLayer, ["in", ['get', "geoid"], ['literal', Object.keys(geoColors)]]);
    map.setFilter(`${geoLayer}-line`, ["in", ['get', "geoid"], ['literal', Object.keys(geoColors)]]);
    map.setLayoutProperty(hideLayer, 'visibility', 'none');
    map.setLayoutProperty(`${hideLayer}-line`, 'visibility', 'none');
    map.getSource('circles').setData(geoJson);
  }

  receiveProps(props, prev, map, falcor) {
    console.log('props circles')
    this.paintMap(map, props);
    this.handleMapFocus(map, props);
  }

  render(map, falcor) {
    console.log('rendering circles', this.props)
  }
}

export const CirclesFactory = (options = {}) => new CirclesOptions(options);