import {dmsPageFactory} from "~/modules/dms/src"
import {withAuth} from "~/modules/ams/src"
import {menuItems} from "../../index"
import dmsFormsTheme from "../dmsFormsTheme"

import siteConfig from '~/modules/dms/src/patterns/forms/config'

const baseUrl = "/admin/forms/form/actions";

export default {
    ...dmsPageFactory(
        siteConfig({
            app: 'dms-site',
            type: 'forms-actions-test',
            title: 'Actions',
            columns: ['action_name'],
            baseUrl
        }),
        withAuth,
        dmsFormsTheme
    ),
    name: "Actions",
    sideNav: {
        size: 'compact',
        color: 'white',
        menuItems
    },
}