import React, { Fragment } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { publicRoutes } from "./routes";
import "antd/dist/reset.css";
import DefaultLayout from "./components/Layouts/DefaultLayout";
import "./styles/global.css";
function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
