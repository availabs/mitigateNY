import React from "react"

// import { API_HOST } from "config"

export default (Component, options = {}) => {
  // const {
  //   baseUrl = API_HOST
  // } = options;
  class ImgLoaderWrapper extends React.Component {
    
    state = {
      loading: false,
      message: ""
    }
    uploadImage(file) {
      if (!file) return Promise.resolve(null);
      if (!/^image[/]/.test(file.type)) {
        this.setState({ message: "File was not an image." });
        return Promise.resolve(null);
      }
      const filename = file.name.replace(/\s+/g, "_");

      this.setState({ message: "", loading: true });

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      return new Promise(resolve => {
        reader.addEventListener("load", () => {
          fetch(`${ this.props.imgUploadUrl }/upload/${ filename }`, {
            method: "POST",
            body: reader.result,
            headers: {
              "Content-Type": "application/octet-stream",
              "Authorization": window.localStorage.getItem("userToken")
            }
          })
          .then(res => {
            if (!res.ok) {
              resolve({ url: null });
            }
            return res.json();
          })
          .then(resolve);
        })
      })
      .then(({ url }) => {
        this.setState({ loading: false });
        return { url, filename };
      })
    }
    editImage(src, filename, action, args) {
      this.setState({ loading: true });
      return new Promise(resolve => {
        fetch(`${ this.props.imgUploadUrl }/edit/${ filename }/${ action }/${ args }`, {
          method: "POST",
          body: JSON.stringify({ src: encodeURI(src) }),
          headers: {
            "Content-Type": "application/json",
            "Authorization": window.localStorage.getItem("userToken")
          }
        })
        .then(res => {
          if (!res.ok) {
            resolve({ url: null });
          }
          return res.json();
        })
        .then(resolve);
      })
      .then(({ url }) => {
        this.setState({ loading: false });
        return url;
      })
    }
    saveImage(src, filename, history) {
      this.setState({ loading: true });
      return new Promise(resolve => {
        fetch(`${ this.props.imgUploadUrl }/save/${ filename }`, {
          method: "POST",
          body: JSON.stringify({
            src,
            history
          }),
          headers: {
            "Content-Type": "application/json",
            "Authorization": window.localStorage.getItem("userToken")
          }
        })
        .then(res => {
          if (!res.ok) {
            resolve({ url: null });
          }
          return res.json();
        })
        .then(resolve);
      })
      .then(({ url }) => {
        this.setState({ loading: false });
        return url;
      })
    }
    render() {
      const { forwardRef, ...props } = this.props;
      return (
        <Component { ...props } { ...this.state } ref={ forwardRef }
          uploadImage={ (...args) => this.uploadImage(...args) }
          editImage={ (...args) => this.editImage(...args) }
          saveImage={ (...args) => this.saveImage(...args) }/>
      )
    }
  }
  return React.forwardRef((props, ref) => <ImgLoaderWrapper { ...props } forwardRef={ ref }/>)
}
