import React from 'react';

import get from "lodash/get"
import { range as d3range } from "d3-array"
import { useNavigate } from 'react-router'

import { DamaContext } from "~/pages/DataManager/store";
import {
  SourceAttributes,
  ViewAttributes,
  getAttributes
} from "~/pages/DataManager/Source/attributes";

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

  const [buildingSources, setBuildingSources] = React.useState([]);

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

          let isBuildings = false;
          let hasGeom = false;
          let hasOgcFid = false;

          const categories = get(source, ["categories", "value"], []);
          if (categories && categories.length) {
            isBuildings = categories.reduce((a, c) => {
              return c.reduce((aa, cc) => {
                return aa || (cc === "Buildings");
              }, a)
            }, false)
          }

          const columns = get(source, ["metadata", "value", "columns"], []);
          if (columns && columns.length) {
            hasGeom = columns.reduce((a, c) => {
              return a || c.name.includes("wkb_geometry");
            }, false);
            hasOgcFid = columns.reduce((a, c) => {
              return a || c.name.includes("ogc_fid");
            }, false);
          }

          if (isBuildings && hasGeom && hasOgcFid) {
            a.push(source);
          }
        }
        return a;
      }, []).sort((a, b) => a.name.localeCompare(b.name));

    setBuildingSources(sources);
  }, [falcor, falcorCache, pgEnv]);

console.log("BUILDING SOURCES:", buildingSources)

  const [selectedSourcesAndViews, setSelectedSourcesAndViews] = React.useState([]);

  const length = selectedSourcesAndViews.length;

  const updateSelected = React.useCallback((index, update) => {
    setSelectedSourcesAndViews(prev => {
      return prev.map((srcNview, i) => {
        if (i === index) {
          return { ...srcNview, ...update };
        }
        return srcNview;
      })
    })
  }, [])

  const [activeSource, _setActiveSource] = React.useState(null);
  const [viewsForActiveSource, setViewsForActiveSource] = React.useState([]);
  const [activeView, setActiveView] = React.useState(null);

  const setActiveSource = React.useCallback(src => {
    _setActiveSource(src);
    setActiveView(null);
  }, []);

  React.useEffect(() => {
    if (activeSource && activeView) {
      setSelectedSourcesAndViews(prev => {
        return [
          ...prev,
          { sourceId: activeSource, viewId: activeView }
        ]
      })
      _setActiveSource(null);
      setViewsForActiveSource([]);
      setActiveView(null);
    }
  }, [activeSource, activeView]);

  React.useEffect(() => {
    if (activeSource === null) return;

    falcor.get(["dama", pgEnv, "sources", "byId", activeSource, "views", "length"]);

    const length = get(falcorCache, ["dama", pgEnv, "sources", "byId", activeSource, "views", "length"], 0);

    if (length) {
      falcor.get([
        "dama", pgEnv, "sources", "byId", activeSource, "views", "byIndex",
        { from: 0, to: length - 1 },
        "attributes", Object.values(ViewAttributes)
      ])
    }

    const views = d3range(length)
      .reduce((a, c) => {
        const ref = get(falcorCache, ["dama", pgEnv, "sources", "byId", activeSource, "views", "byIndex", c, "value"]);
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
    setViewsForActiveSource(views);
  }, [falcor, falcorCache, pgEnv, activeSource]);

  const okToSubmit = React.useMemo(() => {
    if (!damaSourceName) return false;
    if (selectedSourcesAndViews.length < 2) return false;
    return selectedSourcesAndViews.reduce((a, c) => {
      return a && Boolean(c.sourceId && c.viewId);
    }, true);
  }, [selectedSourcesAndViews, damaSourceName]);

  const navigate = useNavigate();

  const submit = React.useCallback(() => {
    if (!okToSubmit) return;

    const publishData = {
      sourceValues: {
        name: damaSourceName,
        type: 'gis_dataset',
        categories: [["Buildings", "Buildings Aggregated"]]
      },
      viewIds: selectedSourcesAndViews.map(srcNview => srcNview.viewId)
    };

    fetch(
      `${ DAMA_HOST }/dama-admin/${ pgEnv }/aggregate_buildings`,
      { method: "POST",
        body: JSON.stringify(publishData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(res => res.json())
      .then(({ source_id, etl_context_id }) => {
        console.log("SERVER RESPONSE:", source_id, etl_context_id)
        if (source_id && etl_context_id) {
          navigate(`${ baseUrl }/source/${ source_id }/uploads/${ etl_context_id }`);
        }
      });
  }, [damaSourceName, okToSubmit, navigate, baseUrl, pgEnv, selectedSourcesAndViews]);

  return (
    <div>

      { selectedSourcesAndViews.map((srcNview, i) => (
          <SourceAndViewSelection key={ i }
            index={ i }
            sources={ buildingSources }
            update={ updateSelected }
            { ...srcNview }/>
        ))
      }

      { !okToSubmit ? null :
        <div className='w-full flex p-4'>
          <div className='flex-1' />
          <div>
            <Button
              className="rounded-md px-8 py-2 border-2 border-blue-300 bg-blue-500 shadow hover:shadow-lg text-slate-100 hover:bg-blue-700"
              onClick={ submit }
              disabled={ !okToSubmit }
            >
                Process
            </Button>
          </div>
        </div>
      }

      <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
        <dt className="text-sm font-medium text-gray-500 py-5">
          Select { length === 0 ? "Primary" : "Another" } Building Source
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <div className="pt-3 pr-8">
            <SimpleSelect key={ activeSource }
              value={ activeSource }
              onChange={ setActiveSource }
              options={ buildingSources }
              valueAccessor={ sourceValueAccessor }
              displayAccessor={ sourceDisplayAccessor }
              placeholder="Select a building source..."/>
          </div>
        </dd>
      </div>

      { activeSource === null ? null :
        <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
          <dt className="text-sm font-medium text-gray-500 py-5">
            Select { length === 0 ? "Primary" : "" }  Source View
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <div className="pt-3 pr-8">
              <SimpleSelect key={ activeView }
                value={ activeView }
                onChange={ setActiveView }
                options={ viewsForActiveSource }
                valueAccessor={ viewValueAccessor }
                displayAccessor={ viewDisplayAccessor }
                placeholder="Select a view..."/>
            </div>
          </dd>
        </div>
      }

    </div>
  )
};

const SourceAndViewSelection = ({ sourceId, viewId, update, index, sources }) => {

  const { pgEnv, baseUrl, falcor, falcorCache } = React.useContext(DamaContext);

  const [views, setViews] = React.useState([]);

  const updateSource = React.useCallback(sourceId => {
    update(index, { sourceId, viewId: null });
  }, [update, index]);
  const updateView = React.useCallback(viewId => {
    update(index, { viewId });
  }, [update, index]);

  React.useEffect(() => {
    if (sourceId === null) return;

    falcor.get(["dama", pgEnv, "sources", "byId", sourceId, "views", "length"]);

    const length = get(falcorCache, ["dama", pgEnv, "sources", "byId", sourceId, "views", "length"], 0);

    if (length) {
      falcor.get([
        "dama", pgEnv, "sources", "byId", sourceId, "views", "byIndex",
        { from: 0, to: length - 1 },
        "attributes", Object.values(ViewAttributes)
      ])
    }

    const views = d3range(length)
      .reduce((a, c) => {
        const ref = get(falcorCache, ["dama", pgEnv, "sources", "byId", sourceId, "views", "byIndex", c, "value"]);
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
    setViews(views);
  }, [falcor, falcorCache, pgEnv, sourceId]);

  return (
    <div>

      <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
        <dt className="text-sm font-medium text-gray-500 py-5">
          { index === 0 ? "Primary" : "" } Building Source
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <div className="pt-3 pr-8">
            <SimpleSelect key={ sourceId }
              value={ sourceId }
              onChange={ updateSource }
              options={ sources }
              valueAccessor={ sourceValueAccessor }
              displayAccessor={ sourceDisplayAccessor }
              placeholder="Select a building source..."/>
          </div>
        </dd>
      </div>

      { sourceId === null ? null :
        <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
          <dt className="text-sm font-medium text-gray-500 py-5">
            { index === 0 ? "Primary" : "" } Source View
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <div className="pt-3 pr-8">
              <SimpleSelect
                value={ viewId }
                onChange={ updateView }
                options={ views }
                valueAccessor={ viewValueAccessor }
                displayAccessor={ viewDisplayAccessor }
                placeholder="Select a view..."/>
            </div>
          </dd>
        </div>
      }

    </div>
  )
}

const AggregateBuildings = {
  stats: {
      name: 'Stats',
      path: '/stats',
      component: () => <div> No stats </div>
  },
  sourceCreate: {
      name: 'Create',
      component: Create
  }
};

export default AggregateBuildings;
