import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'

import { ApiBooksComponent } from "./pages/apiBooks";
import Books from "./pages/books";
import Readers from "./pages/readers";
import Rets from "./pages/returns";
import Librarians from "./pages/Librarians";
import Loans from "./pages/loans";
import Fines from "./pages/fines";

const router = createBrowserRouter([

  { path: "/", element:  <ApiBooksComponent />},
  { path: "/Books", element:  <Books />},
  { path: "/Readers", element:  <Readers />},
  { path: "/Returns", element: <Rets /> },
  { path: "/Librarians", element: <Librarians />},
  { path: "/Loans", element: <Loans />},
  { path: "/Fines", element: <Fines />}

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)