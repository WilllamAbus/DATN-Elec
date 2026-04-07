// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  url: 'http://localhost:4000/api',
  firebaseConfig: {
    apiKey: "AIzaSyBp3FCZooC20Kg-ctztPaL6cH_udz1oJQo",
    authDomain: "xprojreact.firebaseapp.com",
    databaseURL: "https://xprojreact-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "xprojreact",
    storageBucket: "xprojreact.appspot.com",
    messagingSenderId: "188618487582",
    appId: "1:188618487582:web:56f2b99e3356dd08e63b0f",
    measurementId: "G-LYJXQYRYBV"
  }
};
