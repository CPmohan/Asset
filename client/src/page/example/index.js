import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "compounds/tables/data-table";
import "compounds/tables/style.css";

function BasicExample({ resetGroupView, onResetComplete }) {
  const navigate = useNavigate();
  const [assetData, setAssetData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use the group-counts endpoint which already provides the data we need
    axios.get("http://localhost:8080/api/group-counts")
      .then((res) => {
        setAssetData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch group counts:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (resetGroupView) {
      onResetComplete();
    }
  }, [resetGroupView, onResetComplete]);

  if (loading) {
    return <div>Loading...</div>;
  }

  function handleClick() {
    navigate("/create-new-asset");
  }

  return (
    <div style={{ padding: "1rem" }}>
      <DataTable
        title="ALL ASSET GROUPS"
        headers={["Group", "Total Assets"]}
        fields={["group", "count"]}
        data={assetData.map((item) => ({
          group: item.group,
          count: item.count,
          onClick: () => navigate(`/group/${item.group}`)
        }))}
        rowClickEnabled={true}
        align="center"
        secButton={handleClick}
        secBtnLabel="Add New Asset"
      />
    </div>
  );
}

export default BasicExample;