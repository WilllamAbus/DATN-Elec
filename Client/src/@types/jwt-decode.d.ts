// src/@types/jwt-decode.d.ts  
// src/@types/jwt-decode.d.ts
declare module 'jwt-decode' {
  export function jwtDecode<T = any>(token: string): T;
}


