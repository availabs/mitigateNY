import React, {useEffect} from 'react'
// import { checkAuth } from "~/utils/session.server";

import { 
  registerDataType,
  dmsPageFactory
} from '~/modules/dms'


import DmsDraft from '~/modules/dms-custom/draft'
import DmsLexical from '~/modules/dms-custom/lexical'

import {siteConfig} from './site.config.jsx'

registerDataType('richtext', DmsDraft)
registerDataType('lexical', DmsLexical)


export default dmsPageFactory(siteConfig,'/site/')