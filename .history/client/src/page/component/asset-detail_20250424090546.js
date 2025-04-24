import { useLocation, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { getAssetById } from 'api/asset';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AssetDetail = () => {
  const { state } = useLocation();
  const { groupName, assetName } = useParams();
  const [asset, setAsset] = useState(state);
  const [loading, setLoading] = useState(!state);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!state) {
      const fetchAssetData = async () => {
        try {
          setLoading(true);
          // First try to fetch from your existing API
          try {
            const response = await getAssetById(assetName);
            if (response.data) {
              setAsset(response.data);
              return;
            }
          } catch (apiError) {
            console.log("Primary API failed, falling back to direct DB query");
          }

          // Fallback to direct backend query
          const backendResponse = await axios.get(
            `http://localhost:8080/api/assets/with-files/${assetName}`
          );
          const backendData = backendResponse.data;

          if (backendData) {
            const formattedAsset = {
              name: backendData.name,
              group: groupName,
              quantity: backendData.quantity,
              files: backendData.files.map(file => ({
                file: { name: file.filename },
                type: file.filetype,
                url: http://localhost:8080/api/files/${file.filename},
                typeValue: file.typevalue
              }))
            };
            setAsset(formattedAsset);
          } else {
            throw new Error("Asset not found");
          }
        } catch (error) {
          console.error("Error fetching asset:", error);
          setError(error.message);
          // Fallback to example asset
          setAsset({
            name: assetName,
            group: groupName,
            quantity: "N/A",
            files: [
              {
                file: { name: "Sample_Document.pdf" },
                type: "application/pdf",
                url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
              },
            ],
          });
        } finally {
          setLoading(false);
        }
      };
      fetchAssetData();
    }
  }, [state, assetName, groupName]);

  if (loading) {
    return (
      <div style={{ padding: "1rem" }}>
        <div className="bg-white rounded-md p-6 w-full max-w-8xl min-h-[500px] flex items-center justify-center">
          <p>Loading asset details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "1rem" }}>
        <div className="bg-white rounded-md p-6 w-full max-w-8xl min-h-[500px] flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Example fallback asset with a sample uploaded PDF file
  const displayAsset = asset || {
    name: assetName,
    group: groupName,
    quantity: "N/A",
    files: [
      {
        file: { name: "Sample_Document.pdf" },
        type: "application/pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  };

  return (
    <div style={{ padding: "1rem" }}>
      <div className="bg-white rounded-md p-6 w-full max-w-8xl min-h-[500px] flex flex-col lg:flex-row gap-6">
        {/* Left: Asset Info */}
        <div className="lg:w-2/3 w-full -ml-4 -mt-2">
          <h2 className="mb-4 font-medium text-xl">Asset Details</h2>

          <div className="mb-4">
            <p className="mb-1 font-medium text-black">Name</p>
            <p className="text-gray-900">{displayAsset.name}</p>
          </div>

          <div className="mb-4">
            <p className="mb-1 font-medium text-black">Group</p>
            <p className="text-gray-900">{displayAsset.group}</p>
          </div>

          <div className="mb-4">
            <p className="mb-1 font-medium text-black">Quantity</p>
            <p className="text-gray-900">{displayAsset.quantity}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-md text-black mb-2">Uploaded Files</h3>
            <div className="border rounded-md bg-gray-50 p-3 min-h-[100px]">
              {displayAsset.files && displayAsset.files.length > 0 ? (
                <ul className="list-disc list-inside text-sm">
                  {displayAsset.files.map((f, index) => (
                    <li key={index} className="mb-1">
                      {f.url ? (
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                          download={f.file.name}
                        >
                          {f.file.name} ({f.type})
                          {f.typeValue &&  - ${f.typeValue}}
                        </a>
                      ) : (
                        <>
                          {f.file.name} ({f.type})
                          {f.typeValue &&  - ${f.typeValue}}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  No files uploaded yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: QR Code */}
        <div className="lg:w-1/3 w-full flex justify-start items-start ml-[-40px] mt-6">
          <div className="text-center">
            <h3 className="text-sm font-medium mb-2">QR Code:</h3>
            <QRCodeCanvas
              value={JSON.stringify({
                name: displayAsset.name,
                group: displayAsset.group,
                files: displayAsset.files?.map(f => f.file.name)
              })}
              size={window.innerWidth < 768 ? 150 : 180}
            />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
