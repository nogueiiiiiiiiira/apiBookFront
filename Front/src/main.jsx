import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'

import BookSearch from "./pages/teste";
import Books from "./pages/books";
import Librarians from "./pages/Librarians";

const router = createBrowserRouter([

  { path: "/", element:  <Librarians />},
  { path: "/Books", element:  <Books />},
  { path: "/BookSearch", element:  <BookSearch />},
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)