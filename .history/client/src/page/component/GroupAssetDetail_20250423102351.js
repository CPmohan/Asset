import {  useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DataTable from "compounds/tables/data-table";
import { getAssetsByGroup } from "services/assetService"; // Import the service

const GroupAssetDetail = () => {
  const { group } = useParams();
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await getAssetsByGroup(group); // Fetch assets from the backend
        setAssets(data);
      } catch (err) {
        setError('Failed to fetch assets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [group]);

  const groupAssets = assets.filter((item) => item.group === group);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <DataTable
        title={`${group} Assets`}
        headers={["Name", "Quantity"]}
        fields={["name", "quantity"]}
        data={groupAssets.map((item) => ({
          ...item,
          onClick: () =>
            navigate(`/group/${group}/${item.name}`, {
              state: item, // pass asset details via location state
            }),
        }))}
        rowClickEnabled={true}
        allow_download={true}
        align="center"
      />
    </div>
  );
};

export default GroupAssetDetail;
