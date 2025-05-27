import React, {useContext, useEffect, useMemo} from 'react';



import { Dropdown } from '~/modules/avl-components/src'
import { Item } from '~/pages/Auth/AuthMenu'

import { Link, useParams } from 'react-router'
import get from 'lodash/get'


const SourcesLayout = ({children, fullWidth, hideBreadcrumbs, isListAll }) => {

  return (
    <div className={`${fullWidth ? '' : 'max-w-6xl mx-auto'} h-full flex flex-col`}>
   
      <div className='flex-1 flex flex-col'>
        {children}
      </div>
    </div>
  )
}



export default SourcesLayout
