const checkAuth = (props,navigate) => {
  //const isAuthenticating = props?.user?.isAuthenticating
  
  //------------------------------------------
  // TODO : if user is logged in 
  // and refreshes authed page
  // isAuthenticating = false and Authed = false 
  // so user is sent to login
  // while token check happens in background
  // then user is send back to authed page
  // by /auth/login redirect using state:from
  // can we switch to isAuthenticating is true
  //------------------------------------------

  const {user = {}} = props
  let reqAuthLevel = props?.authLevel || -1;
  const authReq = props?.auth  || false;
  
  reqAuthLevel = Math.max(reqAuthLevel, authReq ? 0 : -1);

  const userAuthed = user?.authed || false
  const userAuthLevel = user?.authLevel || -1 //get(props, ["user", "authLevel"], -1);

  const sendToLogin = !userAuthed && (reqAuthLevel >= 0);
  const sendToHome = userAuthLevel < reqAuthLevel;

  // console.log('checkAuth', reqAuthLevel, userAuthLevel)

  //----------------------------------------
  // if page requires auth
  // && user isn't logged in
  // send to login 
  //----------------------------------------
  if( sendToLogin ) {
    //console.log('navigate to login', nav)
    navigate("/auth/login", {state:{ from: props.path }})
    // return <Navigate 
    //   to={ "/auth/login" } 
    //   state={{ from: props.path }}
    // />
  } 
  //----------------------------------------
  // if page requires auth level
  // && user is below that
  // send to home
  //----------------------------------------
  else if (sendToHome) {
    navigate('/')
    
  }

  return false
}

export default checkAuth