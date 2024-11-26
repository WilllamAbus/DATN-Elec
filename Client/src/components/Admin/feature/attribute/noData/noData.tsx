import React from "react";

interface NoDataMessageProps {
  type?: string; 
  message: string;
}

const NoDataMessage: React.FC<NoDataMessageProps> = ({ type, message }) => {
  const images: { [key: string]: string } = {
    ram: "https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/no-product%2Frandom-access-memory.png?alt=media&token=04e59843-5569-4c53-8a30-2ce03bafb06f",
    screen: "https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/no-product%2Fbrowser.png?alt=media&token=73b4c763-8c97-461a-9e2b-a98606b97af0",
    post: "https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/no-product%2Fbrowser.png?alt=media&token=73b4c763-8c97-461a-9e2b-a98606b97af0",
    default:
      "https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/no-product%2Fdefault.png?alt=media&token=default",
  };


  const imageSrc = images[type || "default"];

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center text-gray-500">
      <img
        src={imageSrc}
        alt="No data"
        className="w-32 h-32 mb-4"
      />
      <p className="text-gray-400">{message}</p>
    </div>
  );
};

export default NoDataMessage;
