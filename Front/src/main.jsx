import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'

import BookSearch from "./pages/teste";
import Books from "./pages/books";
import Librarians from "./pages/librarians";
import Readers from "./pages/readers";

const router = createBrowserRouter([

  {
    path: "/books",
    element:  <Books />,
  },

  {
    path: "/",
    element:  <BookSearch />,
  },
  
  {
    path: "/librarians",
    element:  <Librarians />,
  },

  {
    path: "/readers",
    element:  <Readers />,
  }

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)