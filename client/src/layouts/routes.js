import { lazy } from "react";
const Home = lazy(() => import("page/home"));
const BasicExample = lazy(() => import("page/example"));
const AddAssetModal = lazy(() => import("../page/component/AddAsset")); // Corrected import
const AssetDetail = lazy(() => import("page/component/asset-detail")); 
const GroupAssetDetail = lazy(() => import("page/component/GroupAssetDetail"));

const routes = {
  Home,
  BasicExample,
  AddAssetModal,
  AssetDetail,
  GroupAssetDetail, // Add to routes

};

export default routes;
