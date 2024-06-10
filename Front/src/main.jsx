import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'

import { RickAndMortyAPI } from "./pages/RickyAndMortyAPI";
import Librarians from "./pages/librarians";
import Books from "./pages/books";
import Readers from "./pages/readers";
import Loans from "./pages/loans";

const router = createBrowserRouter([

  { path: "/", element:  <RickAndMortyAPI />},
  { path: "/Librarians", element:  <Librarians />},
  { path: "/Books", element:  <Books />},
  { path: "/Readers", element:  <Readers />},
  { path: "/Loans", element: <Loans />}

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)