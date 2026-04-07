// import React, { useEffect } from "react";
// import { Alert } from "@nextui-org/react";

// interface AlertComponentProps {
//   isVisible: boolean;
//   message: string;
//   onClose: () => void;
// }

// const AlertComponent: React.FC<AlertComponentProps> = ({ isVisible, message, onClose }) => {
//   useEffect(() => {
//     if (isVisible) {
//       const timer = setTimeout(() => {
//         onClose(); 
//       }, 2000); 

//       return () => clearTimeout(timer); 
//     }
//   }, [isVisible, onClose]);

//   return (
//     <div className="flex flex-col gap-4">
//       {isVisible && (
//         <Alert
//           color="error"
//           description={message}
//           isVisible={isVisible}
//           title="Thông báo"
//           variant="faded"
//           onClose={onClose}
//         />
//       )}
//     </div>
//   );
// };

// export default AlertComponent;
