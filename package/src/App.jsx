// import './App.css';
// import { CssBaseline, ThemeProvider } from '@mui/material';
// import { baselightTheme } from "./theme/DefaultColors";
// import { RouterProvider } from 'react-router';
// import router from "./routes/Router.js";
// import TrackerProvider from "src/utils/TrackerProvider";

// function App() {
//   const theme = baselightTheme;

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <TrackerProvider>
//         <RouterProvider router={router} />
//       </TrackerProvider>
//     </ThemeProvider>
//   );
// }

// export default App;




// App.js - Keep this simple
import './App.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { baselightTheme } from "./theme/DefaultColors";
import { RouterProvider } from 'react-router';
import router from "./routes/Router.js";

function App() {
  const theme = baselightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;