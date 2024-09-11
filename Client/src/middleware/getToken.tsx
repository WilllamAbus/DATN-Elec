import { jwtDecode } from 'jwt-decode';
import { useCookies } from "react-cookie";
interface Permission {
    name: string;
    resources: string[];
    _id: string;
  }
  
  interface Role {
    _id: string;
    roleId: string;
    name: string;
    permissions: Permission[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  interface DecodedToken {
    id: string;
    email: string;
    roles: Role[];
    name: string;
    avatar: string;
    iat: number;
    exp: number;
  }
  
  const decodeToken = (token: string): DecodedToken => {
    try {
      const decoded: any = jwtDecode(token);
      return {
        id: decoded.id || '',
        email: decoded.email || '',
        roles: decoded.roles || [],
        name: decoded.name || '',
        avatar: decoded.avatar || '',
        iat: decoded.iat || 0,
        exp: decoded.exp || 0
      };
    } catch (error) {
      console.error('Failed to decode token:', error);
      return {
        id: '',
        email: '',
        roles: [],
        name: '',
        avatar: '',
        iat: 0,
        exp: 0
      };
    }
  };
  
  export const getUserData = (): DecodedToken => {
    const [cookies] = useCookies(['token']);
    const token = cookies.token;
  
    console.log('Token data:', token);
  
    if (token) {
      try {
        return decodeToken(token);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  
    // Return default value if data is not available or error occurs
    return {
      id: '',
      email: '',
      roles: [],
      name: '',
      avatar: '',
      iat: 0,
      exp: 0
    };
  };


  // export  const getUserDataV2= (): DecodedToken => {
  //   const userDataV2 = localStorage.getItem("token");
  //   // const [cookies] = useCookies(["token"]);
  //   // const token = cookies.token;
  //   if (userDataV2 ) {
  //     try {
  //       // Parse the root state
  //       const parsedData = JSON.parse(userDataV2);
        
  //       // Access the login data from parsedData
  //       const loginData = JSON.parse(parsedData.auth)?.login;
  
  //       // Check if loginData and token are available
  //       if (loginData && loginData.token) {
  //         const token = loginData.token;
  
  //         // Decode the token and return the result
  //         return decodeToken(token);
  //       }
  //     } catch (error) {
  //       console.error("Failed to parse user data:", error);
  //     }
  //   }
  
  //   // Return default value if data is not available or error occurs
  //   return {
  //     id: "",
  //     email: "",
  //     roles: [],
  //     name: "",
  //     avatar: "",
  //     iat: 0,
  //     exp: 0
  //   };
  // };


