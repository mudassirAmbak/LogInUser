export const setUser = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    console.log("User set in localStorage:", data.user);
  };
  
  export const getUser = () => {
    const user = localStorage.getItem("user");
    console.log("User in getUser:", user);
    return user ? JSON.parse(user) : null;
  };
  
  export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("User logged out and localStorage cleared");
  }
  





