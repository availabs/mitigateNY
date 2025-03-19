
const Default = ({...props}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"  {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
  </svg>
);


const Settings = (props) => (
	<svg viewBox="0 0 32 32"  xml:space="preserve" stroke="currentColor" fill="currentColor" {...props}>
		<path d="M30,8h-4.1c-0.5-2.3-2.5-4-4.9-4s-4.4,1.7-4.9,4H2v2h14.1c0.5,2.3,2.5,4,4.9,4s4.4-1.7,4.9-4H30V8z M21,12c-1.7,0-3-1.3-3-3
			s1.3-3,3-3s3,1.3,3,3S22.7,12,21,12z"/>
		<path d="M2,24h4.1c0.5,2.3,2.5,4,4.9,4s4.4-1.7,4.9-4H30v-2H15.9c-0.5-2.3-2.5-4-4.9-4s-4.4,1.7-4.9,4H2V24z M11,20c1.7,0,3,1.3,3,3
			s-1.3,3-3,3s-3-1.3-3-3S9.3,20,11,20z"/>
	</svg>
)

const Pages = (props) => (
	<svg viewBox="0 0 32 32"  xml:space="preserve" stroke="currentColor" fill="currentColor" {...props}>
		
		<rect x="2" y="6" width="2" height="20"/>
		<rect x="6" y="4" width="2" height="24"/>
		<rect x="14" y="22" width="12" height="2"/>
		<rect x="14" y="16" width="12" height="2"/>
		<path d="M29.7,9.3l-7-7C22.5,2.1,22.3,2,22,2H12c-1.1,0-2,0.9-2,2v24c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V10
			C30,9.7,29.9,9.5,29.7,9.3z M22,4.4l5.6,5.6H22V4.4z M28,28H12V4h8v6c0,1.1,0.9,2,2,2h6V28z"/>
		
	</svg>
)

const History = (props) => (
	<svg viewBox="0 0 32 32"  xml:space="preserve" stroke="currentColor" fill="currentColor" {...props}>
		<polygon points="20.59 22 15 16.41 15 7 17 7 17 15.58 22 20.59 20.59 22"/>
		<path d="M16,2A13.94,13.94,0,0,0,6,6.23V2H4v8h8V8H7.08A12,12,0,1,1,4,16H2A14,14,0,1,0,16,2Z"/>
	</svg>
)


export const Icons = {
	Default,
	Settings,
	Pages,
	History
}

