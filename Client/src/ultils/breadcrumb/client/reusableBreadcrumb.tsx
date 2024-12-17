import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

interface BreadcrumbProps {
  paths: {
    label: string;
    link?: string; 
  }[];
}

const ReusableBreadcrumb: React.FC<BreadcrumbProps> = ({ paths }) => {
  return (
    <Breadcrumbs variant="solid" className="mt-3 flex flex-wrap gap-4">
      {paths.map((path, index) => (
        <BreadcrumbItem key={index}>
          {path.link ? (
            <a href={path.link} className="text-blue-600 hover:underline">
              {path.label}
            </a>
          ) : (
            <span className="text-gray-700">{path.label}</span>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default ReusableBreadcrumb;
