import React from "react"


const EditorButton = ({ active, disabled, children, ...props }) => {
  return (
    <button { ...props } disabled={ disabled } tabIndex={ -1 }
      onMouseDown={ e => e.preventDefault() }
      className={ `px-1 first:rounded-l last:rounded-r focus:border-none focus:outline-none` }>
      { children }
    </button>
  )
}
export default EditorButton;
