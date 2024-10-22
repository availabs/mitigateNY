import React from 'react';

import get from "lodash/get"
import { range as d3range } from "d3-array"
import { useNavigate } from 'react-router-dom'

import { DamaContext } from "~/pages/DataManager/store";
import { SourceAttributes, ViewAttributes, getAttributes } from "~/pages/DataManager/Source/attributes";

import { DAMA_HOST } from "~/config";

const defaultValueAccessor = o => o.value;
const defaultDisplayAccessor = o => o.display;

const SimpleSelect = props => {
  const {
    options,
    value,
    onChange,
    valueAccessor = defaultValueAccessor,
    displayAccessor = defaultDisplayAccessor,
    placeholder = "select an option..."
  } = props;

  const doOnChange = React.useCallback(e => {
    e.stopPropagation();
    onChange(e.target.value);
  }, [onChange]);

  return (
    <select value={ value }
      onChange={ doOnChange }
      className='px-2 py-4 w-full bg-white shadow'
    >
      <option hidden>{ placeholder }</option>
      { options.map(o =>
          <option key={ valueAccessor(o) }
            value={ valueAccessor(o) }
          >
            { displayAccessor(o)}
          </option>
        )
      }
    </select>
  )
}
const Button = ({ onClick, disabled, children }) => {
  return (
    <button
      className={ `
        rounded-md px-8 py-2 border-2 border-blue-300 bg-blue-500
        shadow hover:shadow-lg text-slate-100 hover:bg-blue-700
        disabled:opacity-50 disabled:cursor-not-allowed
      ` }
      onClick={ onClick }
      disabled={ disabled }
    >
      { children }
    </button>
  )
}

const sourceValueAccessor = s => s.source_id;
const sourceDisplayAccessor = s => s.name;

const viewValueAccessor = v => v.view_id;
const viewDisplayAccessor = v => v.version;

const Create = props => {
  const {
    source: { name: damaSourceName }
  } = props;

  const { pgEnv, baseUrl, falcor, falcorCache } = React.useContext(DamaContext);

  const [sourcesWithGeometries, setSourcesWithGeometries] = React.useState([]);
  const [viewsForSource, setViewsForSource] = React.useState([]);

  React.useEffect(() => {
    falcor.get(["dama", pgEnv, "sources", "length"]);

    const length = get(falcorCache, ["dama", pgEnv, "sources", "length"], 0);

    if (length) {
      falcor.get([
        "dama", pgEnv, "sources", "byIndex",
        { from: 0, to: length - 1 },
        "attributes", Object.values(SourceAttributes)
      ])
    }

    const sources = d3range(length)
      .reduce((a, c) => {
        const ref = get(falcorCache, ["dama", pgEnv, "sources", "byIndex", c, "value"], null);
        if (ref && ref.length) {
          const source = get(falcorCache, [...ref, "attributes"], null);
          const columns = get(source, ["metadata", "value", "columns"], []);
          if (columns && columns.length) {
            const hasGeom = columns.reduce((a, c) => {
              return a || c.name.includes("wkb_geometry");
            }, false);
            if (hasGeom) {
              a.push(source);
            }
          }
        }
        return a;
      }, []).sort((a, b) => a.name.localeCompare(b.name));
    setSourcesWithGeometries(sources)
  }, [falcor, falcorCache, pgEnv]);

  const [geomSourceId, _setGeomSourceId] = React.useState("null");
  const [sourceViewId, setSourceViewId] = React.useState("null");

  const setGeomSourceId = React.useCallback(v => {
    _setGeomSourceId(v);
    setSourceViewId("null");
  }, []);

  React.useEffect(() => {
    if (geomSourceId === "null") return;

    falcor.get(["dama", pgEnv, "sources", "byId", geomSourceId, "views", "length"]);

    const length = get(falcorCache, ["dama", pgEnv, "sources", "byId", geomSourceId, "views", "length"], 0);

    if (length) {
      falcor.get([
        "dama", pgEnv, "sources", "byId", geomSourceId, "views", "byIndex",
        { from: 0, to: length - 1 },
        "attributes", Object.values(ViewAttributes)
      ])
    }

    const views = d3range(length)
      .reduce((a, c) => {
        const ref = get(falcorCache, ["dama", pgEnv, "sources", "byId", geomSourceId, "views", "byIndex", c, "value"]);
        if (ref && ref.length) {
          a.push(get(falcorCache, [...ref, "attributes"]))
        }
        return a;
      }, [])
      .map((v, i) => {
        return {
          ...v,
          version: get(v, ["version", "value"], v.version) || `Version ${ i + 1 }`
        }
      });
    setViewsForSource(views);
  }, [falcor, falcorCache, pgEnv, geomSourceId]);

  const canSubmit = React.useMemo(() => {
    return Boolean(damaSourceName) && (sourceViewId !== "null");
  }, [sourceViewId, damaSourceName]);

  const navigate = useNavigate();

  const submit = React.useCallback(() => {
    if (!canSubmit) return;

    const publishData = {
      sourceValues: {
        name: damaSourceName,
        type: 'gis_dataset',
        categories: [["Elevations"]]
      },
      sourceViewId
    };

    fetch(
      `${ DAMA_HOST }/dama-admin/${ pgEnv }/geographies2elevations`,
      { method: "POST",
        body: JSON.stringify(publishData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(res => res.json())
      .then(({ source_id, etl_context_id }) => {
        if (source_id && etl_context_id) {
          navigate(`${ baseUrl }/source/${ source_id }/uploads/${ etl_context_id }`);
        }
      });
  }, [sourceViewId, damaSourceName, canSubmit, navigate, baseUrl, pgEnv]);

  return (
    <div className="group">

      <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
        <dt className="text-sm font-medium text-gray-500 py-5">
          Select Geometry Source
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <div className="pt-3 pr-8">
            <SimpleSelect
              value={ geomSourceId }
              onChange={ setGeomSourceId }
              options={ sourcesWithGeometries }
              valueAccessor={ sourceValueAccessor }
              displayAccessor={ sourceDisplayAccessor }
              placeholder="Select a geometry source"/>
          </div>
        </dd>
      </div>

      { geomSourceId === "null" ? null :
        <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
          <dt className="text-sm font-medium text-gray-500 py-5">
            Select Source View
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <div className="pt-3 pr-8">
              <SimpleSelect
                value={ sourceViewId }
                onChange={ setSourceViewId }
                options={ viewsForSource }
                valueAccessor={ viewValueAccessor }
                displayAccessor={ viewDisplayAccessor }
                placeholder="Select a view"/>
            </div>
          </dd>
        </div>
      }

      { sourceViewId === "null" ? null :
        <div className='w-full flex p-4'>
          <div className='flex-1' />
          <div>
            <Button
              className="rounded-md px-8 py-2 border-2 border-blue-300 bg-blue-500 shadow hover:shadow-lg text-slate-100 hover:bg-blue-700"
              onClick={ submit }
              disabled={ !canSubmit }
            >
                Process
            </Button>
          </div>
        </div>
      }

    </div>
  )
};

const geography2elevations = {
  sourceCreate: {
    name: 'Create',
    component: Create
  }
};

export default geography2elevations;
