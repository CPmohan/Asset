import { useLocation, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const AssetDetail = () => {
  const { state } = useLocation();
  const { groupName, assetName } = useParams();

  // Example fallback asset with a sample uploaded PDF file
  const asset = state || {
    name: assetName,
    group: groupName,
    quantity: "N/A",
    files: [
      {
        file: { name: "Sample_Document.pdf" },
        type: "application/pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // sample online PDF
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
            <p className="text-gray-900">{asset.name}</p>
          </div>

          <div className="mb-4">
            <p className="mb-1 font-medium text-black">Group</p>
            <p className="text-gray-900">{asset.group}</p>
          </div>

          <div className="mb-4">
            <p className="mb-1 font-medium text-black">Quantity</p>
            <p className=" text-gray-900">{asset.quantity}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-md text-black mb-2">Uploaded Files</h3>
            <div className="border rounded-md bg-gray-50 p-3 min-h-[100px]">
              {asset.files && asset.files.length > 0 ? (
                <ul className="list-disc list-inside text-sm">
                  {asset.files.map((f, index) => (
                    <li key={index}>
                      {f.url ? (
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {f.file.name} ({f.type})
                        </a>
                      ) : (
                        <>
                          {f.file.name} ({f.type})
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
