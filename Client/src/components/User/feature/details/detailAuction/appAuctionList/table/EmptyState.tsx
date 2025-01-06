import React from 'react';
import { EmptyNormalIcon } from '../../../../../../../common/Icons/emptyNormal'; 

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center py-8">
      <EmptyNormalIcon width="64" height="41" />
      <p className="text-gray-600 text-lg mt-4">Không tìm thấy bảng ghi nào</p>
    </div>
  );
};

export default EmptyState;
