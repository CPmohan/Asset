import "compounds/tables/style.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DataTable from "compounds/tables/data-table";
import { getAssetsByGroup } from "src/api/api"; // adjust if needed

const groupList = ["Electronics", "Transport", "Infrastructure", "Laboratory"];

function BasicExample({ resetGroupView, onResetComplete }) {
  const navigate = useNavigate();
  const [assetData, setAssetData] = useState([]);

  const groups = [...new Set(assetData.map((item) => item.group))];

  function handleClick() {
    navigate("/create-new-asset");
  }

  useEffect(() => {
    const fetchData = async () => {
      let allAssets = [];

      for (const group of groupList) {
        const groupAssets = await getAssetsByGroup(group);
        allAssets = [...allAssets, ...groupAssets];
      }

      setAssetData(allAssets);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (resetGroupView) {
      onResetComplete();
    }
  }, [resetGroupView, onResetComplete]);

  return (
    <div style={{ padding: "1rem" }}>
      <DataTable
        title="ALL ASSET GROUPS"
        headers={["Group", "Total Assets"]}
        fields={["group", "count"]}
        data={groups.map((group) => ({
          group,
          count: assetData.filter((item) => item.group === group).length,
          onClick: () =>
            navigate(`/group/${group}`, {
              state: { assetData: assetData.filter((a) => a.group === group) },
            }),
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
