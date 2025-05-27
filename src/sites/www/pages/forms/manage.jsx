import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {falcor} from "~/modules/avl-falcor";
import MetadataTable from "./Metadata/advanced.jsx";
export const Manage = (props) => {
  const config = JSON.parse(props?.item?.config || '{}');

  const submit = async (config) => {
    if(!props.item?.id) return;
    const data = {name: props.item.name, config}
    console.log('data', data)
    await falcor.call(["dms", "data", "edit"], [props.item?.id, JSON.stringify(data)]);
    await falcor.invalidate(['dms', 'data', 'byId', props.item?.id])
  }

  return (
      <div className=''>
        <div className='text-xl p-3 font-thin flex-1'>Manage {props?.item?.name}</div>
        <MetadataTable metadata={config} update={submit}/>
      </div>
  )
}
