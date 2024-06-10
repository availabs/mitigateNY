import {dmsPageFactory} from "~/modules/dms/src"
import {withAuth} from "~/modules/ams/src"
import {menuItems} from "../../index"
import dmsFormsTheme from "../dmsFormsTheme"

import siteConfig from '~/modules/dms/src/patterns/forms/config'
import {API_HOST} from "../../../../../../config.js";

const baseUrl = "/admin/forms/form/rv-matrix";

export default {
    ...dmsPageFactory(
        siteConfig({
            app: 'dms-site',
            type: 'forms-rv-matrix',
            title: 'R+V Matrix',
            columns: ['domain', 'subdomain'],
            baseUrl,
            API_HOST,
        }),
        withAuth,
        dmsFormsTheme
    ),
    name: "R+V Matrix",
    sideNav: {
        size: 'compact',
        color: 'white',
        menuItems
    },
}