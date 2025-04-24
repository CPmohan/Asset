import "compounds/tables/style.css";
import { useNavigate } from "react-router-dom";
import { useEffect,  } from "react";
import DataTable from "compounds/tables/data-table";

const assetData = [
  { name: "Computers", group: "Electronics", quantity: 50 },
  { name: "Printers", group: "Electronics", quantity: 10 },
  { name: "Buses", group: "Transport", quantity: 5 },
  { name: "Buildings", group: "Infrastructure", quantity: 2 },
  { name: "ROBOTS", group: "Laboratory", quantity: 2 },
];

function BasicExample({ resetGroupView, onResetComplete }) {
  const navigate = useNavigate();
  const groups = [...new Set(assetData.map((item) => item.group))];

  function handleClick() {
    navigate("/create-new-asset");
  }

  // Optional: Resetting selected group view if needed
  useEffect(() => {
    if (resetGroupView) {
      onResetComplete(); // Just clear the trigger now, since we navigate directly
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
          count: assetData.filter((item) => item.group.includes(group)).length,

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
