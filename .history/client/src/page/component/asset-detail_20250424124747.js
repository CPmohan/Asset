import { useLocation, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import axios from "axios";

const AssetDetail = () => {
  const { state } = useLocation();
  const { groupName, assetName } = useParams();
  const [asset, setAsset] = useState(null);

  useEffect(() => {
    if (state) {
      setAsset(state);
    } else {
      axios
        .get(`/api/assets/${groupName}/${assetName}`)
        .then((res) => {
          console.log("API Response:", res.data);
          setAsset(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch asset:", err);
        });
    }
  }, [state, groupName, assetName]);

  if (!asset) return <div className="p-4">Loading...</div>;

  
  return (
    <div style={{ padding: "1rem" }}>
      <div className="bg-white rounded-md p-6 w-full max-w-8xl min-h-[500px] flex flex-col lg:flex-row gap-6">
        {/* Left: Asset Info */}
        <div className="lg:w-2/3 w-full -ml-4 -mt-2">
          <h2 className="mb-4 font-medium text-xl">Asset Details</h2>

          <div className="mb-4">
            <p className="mb-1 font-medium text-black">Name</p>
            <p className="text-gray-900">{asset.name}</p>
          </div>

          <div className="mb-4">
            <p className="mb-1 font-medium text-black">Group</p>
            <p className="text-gray-900">
              {Array.isArray(asset.group) ? asset.group.join(", ") : asset.group}
            </p>
          </div>

          <div className="mb-4">
            <p className="mb-1 font-medium text-black">Quantity</p>
            <p className="text-gray-900">{asset.quantity}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-md text-black mb-2">Uploaded Files</h3>
            <div className="border rounded-md bg-gray-50 p-3 min-h-[100px]">
              {renderFiles()}
            </div>
          </div>
        </div>

        {/* Right: QR Code */}
        <div className="lg:w-1/3 w-full flex justify-start items-start ml-[-40px] mt-6">
          <div className="text-center">
            <h3 className="text-sm font-medium mb-2">QR Code:</h3>
            <QRCodeCanvas
              value={JSON.stringify(asset)}
              size={window.innerWidth < 768 ? 150 : 180}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
