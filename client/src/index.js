import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./sass/main.min.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
//require("file-loader?name=[name].[ext]!../public/index.html");

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </BrowserRouter>
);

/*   <React.StrictMode>
  </React.StrictMode>
*/
