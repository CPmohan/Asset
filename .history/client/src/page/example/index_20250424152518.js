import "compounds/tables/style.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DataTable from "compounds/tables/data-table";

function BasicExample({ resetGroupView, onResetComplete }) {
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/group-counts")
      .then((res) => res.json())
      .then((data) => setGroupData(data))
      .catch((err) => console.error("Error fetching group data:", err));
  }, []);

  useEffect(() => {
    if (resetGroupView) {
      onResetComplete();
    }
  }, [resetGroupView, onResetComplete]);

  function handleClick() {
    navigate("/create-new-asset");
  }

  return (
    <div style={{ padding: "1rem" }}>
      <DataTable
        title="ALL ASSET GROUPS"
        headers={["Group", "Total Assets"]}
        fields={["group", "count"]}
        data={groupData.map((item) => ({
          ...item,
          onClick: () =>
            navigate(`/group/${item.group}`, {
              state: { groupName: item.group },
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
