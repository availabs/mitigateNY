import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";
import { getDamaApiRoutePrefix } from "../utils/DamaControllerApi";
import { DamaContext } from "~/pages/DataManager/store";
import {RenderAddNewVariables, CallServer} from "./index.jsx";

const Create = ({ source, newVersion, baseUrl }) => {
    const navigate = useNavigate();
    const { pgEnv, user } = React.useContext(DamaContext)
    const rtPfx = getDamaApiRoutePrefix(pgEnv);

    const [newVariables, setNewVariables] = useState([]);
    const [newVariable, setNewVariable] = useState({});
    const [geoLevel, setGeoLevel] = useState('state');
    const [loading, setLoading] = useState(false);

    return (
        <div className='w-full'>
            <RenderAddNewVariables newVariables={newVariables} setNewVariables={setNewVariables}
                                   newVariable={newVariable} setNewVariable={setNewVariable}
                                   geoLevel={geoLevel} setGeoLevel={setGeoLevel}
                                   loading={loading}
                                   serverCall={() => CallServer({
                                       rtPfx, baseUrl, source, user, navigate, newVersion, newVariables, geoLevel, setLoading
                                   })}
            />
        </div>
    )
}

export default Create