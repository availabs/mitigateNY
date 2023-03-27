import React from 'react'

export const combineCompProps = (...props) =>
  props.reduce((a, c) => {
    for (const key in c) {
      if (!(key in a)) {
        a[key] = c[key];
      }
      else {
        switch (key) {
          case "className":
            a[key] = `${ a[key] } ${ c[key] }`;
            break;
          case "style":
            a[key] = { ...a[key], ...c[key] };
            break;
          case "onMouseOut":
          case "onMouseDown":
          case "onMouseMove": {
            const prev = a[key];
            a[key] = e => {
              prev(e);
              c[key](e);
            }
            break;
          }
          default:
            break;
        }
      }
    }
    return a;
  }, {})

export const useSetRefs = (...refs) => {
  return React.useCallback(node => {
    [...refs].forEach(ref => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      }
      else {
        ref.current = node;
      }
    })
  }, [refs])
}