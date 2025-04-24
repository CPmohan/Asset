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
        const assetsArray = await getAssetsByGroup(group);
        setAssets(assetsArray || []); // Fallback to empty array if null
      } catch (error) {
        console.error("Error fetching assets:", error);
        setAssets([]); // Ensure assets is never null
      }
    };
    fetchAssets();
  }, [group]);

  return (
    <div style={{ padding: "1rem" }}>
      <DataTable
        title={`${group} Assets`}
        headers={["Name", "Quantity"]}
        fields={["name", "quantity"]}
        data={(assets || []).map((item) => ({
          ...item,
          onClick: () =>
            navigate(`/group/${group}/${item.name}`, { state: item }),
        }))}
        rowClickEnabled
        allow_download
        align="center"
      />
    </div>
  );
};

export default GroupAssetDetail;
