// Consider:  Should this be a class so that tasks can extend and override methods?
// Consider: DONT USE THIS
// --------  this codebase is not designed to have centralized api calls
// --------  please put your api calls where you use them for readability

import { DAMA_HOST } from "~/config";
import get from "lodash/get";

export async function checkApiResponse(res) {
  if (!res.ok) {
    let errMsg = res.statusText;
    try {
      const { message } = await res.json();
      errMsg = message;
    } catch (err) {
      console.error(err);
    }

    throw new Error(errMsg);
  }
}

export function getDamaApiRoutePrefix(pgEnv) {
  return `${DAMA_HOST}/dama-admin/${pgEnv}`;
}

export async function getNewEtlContextId(pgEnv) {
  const rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}`;

  const newEtlCtxRes = await fetch(`${rtPfx}/etl/new-context-id`);

  await checkApiResponse(newEtlCtxRes);

  const etlContextId = +(await newEtlCtxRes.text());

  return etlContextId;
}

export async function getDamaTileServerUrl() {
  const res = await fetch(`${DAMA_HOST}/dama-info/getTileServerUrl`);
  // const damaTileServerUrl = await res.text();
  const damaTileServerUrl = await res.json();

  return damaTileServerUrl;
}

export const getSrcViews = async ({rtPfx, falcor, pgEnv, setVersions, type}) => {
  await falcor.get(['dama', pgEnv, 'views', 'bySourceType', type]);
  const res = get(falcor.getCache(), ['dama', pgEnv, 'views', 'bySourceType', type, 'value']);
  console.log('res', res)
  setVersions({views: res})

  return {views: res}
}

export const makeAuthoritative = async (rtPfx, viewId) => {
  const url = new URL(`${rtPfx}/makeAuthoritativeDamaView`);

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ "view_id": viewId }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  await checkApiResponse(res);

  const viewMetaRes = await res.json();

  return viewMetaRes;
};


