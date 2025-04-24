import { useParams, useNavigate } from "react-router-dom";
import DataTable from "compounds/tables/data-table";
import { useEffect, useState } from "react";
import { getAssetsByGroup } from "api/asset";

const GroupAssetDetail = () => {
  const { group } = useParams();
  console.log("Group name from URL:", group); // Log the group name from URL
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);

  useEffect(() => {
console.log("Fetching assets..."); // Log when fetching starts
const fetchAssets = async () => {
      try {
        const response = await getAssetsByGroup(group);
        console.log("Fetched assets:", response.data); // Log the fetched assets
console.log("Fetched assets:", response.data); // Log the fetched assets
setAssets(response.data);
console.log("Assets state after setting:", response.data); // Log the assets state
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    fetchAssets();
  }, [group]);

  return (
    <div style={{ padding: "1rem" }}>
      <DataTable
        title={${group} Assets}
        headers={["Name", "Quantity"]}
        fields={["name", "quantity"]}
        data={assets.map((item) => ({
          ...item,
          onClick: () =>
            navigate(/group/${group}/${item.name}, {
              state: item,
            }),
        }))}
        rowClickEnabled={true}
        allow_download={true}
        align="center"
      />
    </div>
  );
};