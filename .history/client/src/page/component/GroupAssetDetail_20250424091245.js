import { useParams, useNavigate } from "react-router-dom";
import DataTable from "compounds/tables/data-table";
import { useEffect, useState } from "react";
import { getAssetsByGroup } from "api/asset";

const GroupAssetDetail = () => {
  const { group } = useParams();
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await getAssetsByGroup(group);
        setAssets(response.data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    fetchAssets();
  }, [group]);

  return (
    <div style={{ padding: "1rem" }}>
      <DataTable
        title={`${group} Assets`}           {/* ← use backticks inside braces */}
        headers={["Name", "Quantity"]}
        fields={["name", "quantity"]}
        data={assets.map((item) => ({
          ...item,
          onClick: () =>
            navigate(
              `/group/${group}/${item.name}`,  // ← wrap path in backticks
              { state: item }
            ),
        }))}
        rowClickEnabled={true}
        allow_download={true}
        align="center"
      />
    </div>
  );
};

export default GroupAssetDetail;
