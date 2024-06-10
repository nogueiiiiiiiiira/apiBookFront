import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'

import { RickAndMortyAPI } from "./pages/RickyAndMortyAPI";
import Librarians from "./pages/librarians";
import LibrariansSearch from "./pages/librarianSearch";
import Books from "./pages/books";
import BookSearch from "./pages/bookSearch";
import Readers from "./pages/readers";
import ReadersSearch from "./pages/readerSearch";
import Rets from "./pages/returns";

const router = createBrowserRouter([

  { path: "/", element:  <RickAndMortyAPI />},
  { path: "/Librarians", element:  <Librarians />},
  { path: "/LibrariansSearch", element:  <LibrariansSearch />},
  { path: "/Books", element:  <Books />},
  { path: "/BookSearch", element:  <BookSearch />},
  { path: "/Readers", element:  <Readers />},
  { path: "/ReadersSearch", element:  <ReadersSearch />},
  { path: "/returns", element: <Rets /> }

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)