import {dmsPageFactory} from "~/modules/dms/src"
import {withAuth} from "~/modules/ams/src"
import {menuItems} from "../../index"
import dmsFormsTheme from "../dmsFormsTheme"

import siteConfig from '~/modules/dms/src/patterns/forms/config'
import {API_HOST} from "../../../../../../config.js";

const baseUrl = "/admin/forms/form/measures";

export default {
    ...dmsPageFactory(
        siteConfig({
            app: 'dms-site',
            type: 'forms-measures',
            title: 'Mitigation Measures',
            columns: ['name'],
            baseUrl,
            API_HOST,
        }),
        withAuth,
        dmsFormsTheme
    ),
    name: "Mitigation Measures",
    sideNav: {
        size: 'compact',
        color: 'white',
        menuItems
    },
}