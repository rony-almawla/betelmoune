import {createContext, useReducer ,useEffect} from 'react';

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        userInfo: action.payload,
        isAuthDataLoaded: true, // Set to true when authentication data is loaded
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        userInfo: null,
        isAuthDataLoaded: true, // Set to true even on logout
      };
    default:
      return state;
  }
};


export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isLoggedIn: false,
    userInfo: null,
    isAuthDataLoaded: false, // Initialize as false
  });

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log('TEST USER : ', userInfo);
    if (userInfo) {
      dispatch({ type: 'LOGIN', payload: userInfo, isAuthDataLoaded: true }); // Set isAuthDataLoaded to true when logging in
    } else {
      dispatch({ type: 'LOGOUT', isAuthDataLoaded: true }); // Set isAuthDataLoaded to true even on logout
    }
  }, []);

  console.log('authContext state: ', state);
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};