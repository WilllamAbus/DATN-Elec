
import { Breadcrumb } from "flowbite-react";
import { ReactNode } from "react";

interface ReusableBreadcrumbItemProps {
  href: string;
  children: ReactNode;
}

const ReusableBreadcrumbItem = ({ href, children }: ReusableBreadcrumbItemProps) => {
  return (
    <Breadcrumb.Item href={href}>
      {children}
    </Breadcrumb.Item>
  );
};

export default ReusableBreadcrumbItem;
