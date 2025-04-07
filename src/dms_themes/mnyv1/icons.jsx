import { 
	SettingsAdjust,
	DocumentMultiple_01,
	RecentlyViewed,
	InsertPage,
	AddAlt,
	Add,
	OverflowMenuVertical,
	OverflowMenuHorizontal,
	Column,
	Row,
	OpenPanelFilledTop,
	BorderNone,
	Development
} from '@carbon/icons-react';


const Default = ({...props}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"  {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
  </svg>
);


const Settings = (props) => (
	<SettingsAdjust {...props} />
)

const Pages = (props) => (
	<DocumentMultiple_01 {...props} />
)

const History = (props) => (
	<RecentlyViewed {...props} />
)

const InsertSection = (props) => (
	<InsertPage {...props} />
)

const Menu = (props) => (
	<OverflowMenuHorizontal {...props} />
)

const ColumnWrap = (props) => (
	<Column {...props} />
)

const RowWrap = (props) => (
	<Row {...props} />
)

const Padding = (props) => <OpenPanelFilledTop {...props} />

const Border = (props) => <BorderNone {...props} />
const Grid = (props) => <Development {...props} />


export const Icons = {
	Default,
	Settings,
	Pages,
	InsertSection,
	Menu,
	Column: ColumnWrap,
	Row: RowWrap,
	Padding,
	Border,
	Grid
}

