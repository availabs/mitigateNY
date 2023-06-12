import get from "lodash/get";
import { LayerContainer } from "~/modules/avl-maplibre/src";
//import { length } from "tailwindcss/lib/util/dataTypes";
import { getColorRange } from "~/modules/avl-components/src";
import { fnum } from "~/utils/macros";
import ckmeans from "~/utils/ckmeans";
import { scaleThreshold } from "d3-scale";
import {drawLegend} from "../drawLegend.jsx";
import isEqual from 'lodash/isEqual'

class EALChoroplethOptions extends LayerContainer {
  constructor(props) {
    super(props);
  }

  name = "ccl";
  id = "ccl";
  data = [];
  sources = [
    // {
    //   id: "states",
    //   source: {
    //     "type": "vector",
    //     "url": "https://api.mapbox.com/v4/mapbox.satellite/{x}/{y}/{z}.webp?sku=101PRSiEvYwSK&access_token=tk.eyJ1IjoiYW0zMDgxIiwiZXhwIjoxNjg2NTk1ODM1LCJpYXQiOjE2ODY1OTIyMzUsInNjb3BlcyI6WyJlc3NlbnRpYWxzIiwic2NvcGVzOmxpc3QiLCJtYXA6cmVhZCIsIm1hcDp3cml0ZSIsInVzZXI6cmVhZCIsInVzZXI6d3JpdGUiLCJ1cGxvYWRzOnJlYWQiLCJ1cGxvYWRzOmxpc3QiLCJ1cGxvYWRzOndyaXRlIiwic3R5bGVzOnRpbGVzIiwic3R5bGVzOnJlYWQiLCJmb250czpsaXN0IiwiZm9udHM6cmVhZCIsImZvbnRzOndyaXRlIiwic3R5bGVzOndyaXRlIiwic3R5bGVzOmxpc3QiLCJzdHlsZXM6ZG93bmxvYWQiLCJzdHlsZXM6cHJvdGVjdCIsInRva2VuczpyZWFkIiwidG9rZW5zOndyaXRlIiwiZGF0YXNldHM6bGlzdCIsImRhdGFzZXRzOnJlYWQiLCJkYXRhc2V0czp3cml0ZSIsInRpbGVzZXRzOmxpc3QiLCJ0aWxlc2V0czpyZWFkIiwidGlsZXNldHM6d3JpdGUiLCJkb3dubG9hZHM6cmVhZCIsInZpc2lvbjpyZWFkIiwidmlzaW9uOmRvd25sb2FkIiwibmF2aWdhdGlvbjpkb3dubG9hZCIsIm9mZmxpbmU6cmVhZCIsIm9mZmxpbmU6d3JpdGUiLCJzdHlsZXM6ZHJhZnQiLCJmb250czptZXRhZGF0YSIsInNwcml0ZS1pbWFnZXM6cmVhZCIsImRhdGFzZXRzOnN0dWRpbyIsImN1c3RvbWVyczp3cml0ZSIsImNyZWRlbnRpYWxzOnJlYWQiLCJjcmVkZW50aWFsczp3cml0ZSIsImFuYWx5dGljczpyZWFkIl0sImNsaWVudCI6Im1hcGJveC5jb20iLCJsbCI6MTY2NzMyNjMxNDMwMSwiaXUiOm51bGwsImVtYWlsIjoiYW0zMDgxQGdtYWlsLmNvbSJ9.MUxuViB3XLGcyKfIvNuP3A"
    //   },
    // },
    {
      id: "counties",
      source: {
        "type": "vector",
        "url": "https://tiles.availabs.org/data/tl_2020_36_county.json"
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
        "fill-color": '#8f680f'
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
          4, 1,
          22, 1
        ],
        "line-color": "#000000",
        "line-opacity": 0.5
      }
    }
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
    layers: ["counties"],
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
        let { view, views } = this.props;
        const currentView = views.find(v => v.id.toString() === view.toString());
        const keyMapping = key => Array.isArray(currentView?.columns) ? key : Object.keys(currentView?.columns || {}).find(k => currentView.columns[k] === key);
        let record = this.data.find(d => d.geoid === feature.properties.geoid),
          response = [
            [feature.properties.geoid, ''],
            ...Object.keys(record || {})
              .filter(key => key !== 'geoid')
              .map(key => [keyMapping(key), fnum(get(record, key))]),
            currentView?.paintFn ? ['Total', fnum(currentView.paintFn(record || {}) || 0)] : null
          ];
        return response;
      }, []);
    }
  };

  init(map, falcor, props) {
    map.fitBounds([-125.0011, 24.9493, -66.9326, 49.5904]);
    map.on('idle', (e) => {
      console.log('IDLEd')
      const canvas = document.querySelector("canvas.maplibregl-canvas"),
          newCanvas = document.createElement("canvas");

      let img;

      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height;

      const context = newCanvas.getContext("2d")
      context.drawImage(canvas, 0, 0);


      drawLegend({legend: this.legend, filters: this.filters}, newCanvas, canvas);
      img = newCanvas.toDataURL();
      this.img = img;
      this.props.change({filters: this.filters, img, bounds: map.getBounds(), legend: this.legend, style: this.style})

    })

  }

  fetchData(falcor) {

    const {disaster_number, geoid, ealViewId, view, views, pgEnv} = this.props;

    if(!disaster_number || !view) return Promise.resolve();
    this.data = [];
    const currentView = views.find(v => v.id.toString() === view.toString());
    const columns = Array.isArray(currentView?.columns) ? currentView?.columns : Object.values(currentView?.columns);

    if(!currentView) return Promise.resolve();

    const dependencyPath = ['dama', pgEnv, 'viewDependencySubgraphs', 'byViewId', ealViewId],
      geomColName = `substring(${currentView.geoColumn || 'geoid'}, 1, 5)`,
      disasterNumberColName = currentView.disasterNumberColumn || 'disaster_number',
      options = JSON.stringify({
        aggregatedLen: true,
        filter: false && geoid?.length === 5 ? { [disasterNumberColName]: [disaster_number], [geomColName]: [geoid] } : { [disasterNumberColName]: [disaster_number] },
        groupBy: [disasterNumberColName, geomColName]
      }),
      attributes = {
        geoid: `${geomColName} as geoid`,
        ...(columns || [])
          .reduce((acc, curr) => ({...acc, [curr]: `sum(${curr}) as ${curr}`}) , {})
      },
      path = view_id => ['dama', pgEnv, 'viewsbyId', view_id, 'options', options]

    return falcor.get([...path(view), 'length'], dependencyPath)
      .then(async res => {

        const geomDep = get(res, ['json', ...dependencyPath, 'dependencies'], [])
                          .find(d => d.type === (false && geoid?.length === 5 ? 'tl_county' : 'tl_state'));
        const len = get(res, ['json', ...path(view), 'length']);

       await len && falcor.get([...path(view), 'databyIndex', {from:0, to:len - 1}, Object.values(attributes)])
              .then(async res => {
                let data = Object.values(get(res, ['json', ...path(view), 'databyIndex'], {}));
                data = [...Array(len).keys()].map(i => {
                  return Object.keys(attributes).reduce((acc, curr) => ({...acc, [curr]: data[i][attributes[curr]]}) ,{});
                });
                this.data = data;

                if(!data?.length) return Promise.resolve();

                const geomColTransform = [`st_asgeojson(st_envelope(ST_Simplify(geom, ${false && geoid?.length ===  5 ? `0.1` : `0.5`})), 9, 1) as geom`],
                  geoIndices = {from: 0, to: 0},
                  stateFips = get(data, [0, 'geoid']) || this.props.geoid?.substring(0, 2),
                  geoPath    = ({view_id}) =>
                    ['dama', this.props.pgEnv, 'viewsbyId', view_id,
                      'options', JSON.stringify({ filter: { geoid: [false && geoid?.length === 5 ? geoid : stateFips.substring(0, 2)]}}),
                      'databyIndex'
                    ];
                const geomRes = await falcor.get([...geoPath(geomDep), geoIndices, geomColTransform]);
                const geom = get(geomRes, ["json", ...geoPath(geomDep), 0, geomColTransform]);
                if(geom){
                  this.mapFocus = get(JSON.parse(geom), 'bbox');
                }
              })
      })
  }

  handleMapFocus(map) {
    if (this.mapFocus) {
      try {
          map.fitBounds(this.mapFocus)
      } catch (e) {
        map.fitBounds([-125.0011, 24.9493, -66.9326, 49.5904]);
      }
    } else {
    map.fitBounds([-125.0011, 24.9493, -66.9326, 49.5904]);
    }
  }

  getColorScale(domain) {
    if(!domain.length) domain = [0, 25, 50, 75, 100];


    this.legend.range = getColorRange(9, "Oranges", false)

    this.legend.domain = ckmeans(domain,Math.min(domain.length,this.legend.range.length)).map(d => parseInt(d))

    return scaleThreshold()
      .domain(this.legend.domain)
      .range(this.legend.range);
  }

  paintMap(map) {
    let { geoid, view, views } = this.props
    const currentView = views.find(v => v.id?.toString() === view?.toString());
    const columns = Array.isArray(currentView?.columns) ? currentView?.columns : Object.values(currentView?.columns);

    const colors = {};

    let colorScale = null;

    colorScale = this.getColorScale(
      this.data.map((d) => currentView?.paintFn ? currentView.paintFn(d) : d[columns?.[0]])
        .filter(d => d)
    );

    if(false && geoid?.length === 5){
      const record = this.data.find(d => d.geoid === geoid);
      const value = currentView?.paintFn ? currentView.paintFn(record) : record?.[columns?.[0]];
      colors[geoid] = colorScale(value);
    }else{
      const geoids = this.data.map(d => d.geoid);
      const stateFips = (geoid?.substring(0, 2) || geoids[0] || '00').substring(0, 2);

      for (let id = 0; id <= 999; id += 1){
        const gid = stateFips + id.toString().padStart(3, '0');

        const record = this.data.find(d => d.geoid === gid) || {};
        const value = currentView?.paintFn ? currentView.paintFn(record) : record[columns?.[0]];
        colors[gid] = geoids.includes(gid) && value ? colorScale(value) : '#CCC';
      }
    }

    map.setFilter("counties", ["in", ['get', "geoid"], ['literal', Object.keys(colors)]]);
    map.setFilter("counties-line", ["in", ['get', "geoid"], ['literal', Object.keys(colors)]]);
    map.setPaintProperty("counties", "fill-color", ["get", ["get", "geoid"], ["literal", colors]]);

  }

  receiveProps(props, prev) {
    //console.log('receiveProps',Object.values(prev).filter(d => typeof d !== 'function')),props, prev)
    this.paintMap(this.mapboxMap);
    this.handleMapFocus(this.mapboxMap);
  }

  render(map, falcor) {
    console.log('render', this)
    
    if(this.props.change){

      // map.on('resize', (e) => {
      //   this.bounds = map.getBounds();
      //   this.props.change({filters: this.filters, img: this.img, bounds:  this.bounds, legend: this.legend, style: this.style});
      // })
      //
      // map.on('render', (e) => {
      //   const canvas = document.querySelector("canvas.maplibregl-canvas"),
      //       newCanvas = document.createElement("canvas");
      //
      //   let img;
      //
      //   newCanvas.width = canvas.width;
      //   newCanvas.height = canvas.height;
      //
      //   const context = newCanvas.getContext("2d")
      //   context.drawImage(canvas, 0, 0);
      //
      //   drawLegend({legend: this.legend, filters: this.filters}, newCanvas, canvas);
      //   img = newCanvas.toDataURL();
      //   this.img = img;
      //   this.props.change({filters: this.filters, img, bounds: map.getBounds(), legend: this.legend, style: this.style})
      //
      // })

      

    }


  }
}

export const ChoroplethCountyFactory = (options = {}) => new EALChoroplethOptions(options);