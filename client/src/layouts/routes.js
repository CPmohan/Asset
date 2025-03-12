import { lazy } from "react";
const Home = lazy(() => import("page/home"));
const BasicExample = lazy(() => import("page/example"));

const routes = {
  Home,
  BasicExample,
};

export default routes;
