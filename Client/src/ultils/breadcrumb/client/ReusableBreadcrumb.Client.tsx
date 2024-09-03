import { Breadcrumb } from "flowbite-react";
import ReusableBreadcrumbItemClient from "./ReusableBreadcrumbItem.Client";

interface BreadcrumbItem {
  href: string;
  label: string;
}

interface ReusableBreadcrumbProps {
  items: BreadcrumbItem[];
}

const ReusableBreadcrumbClient = ({ items }: ReusableBreadcrumbProps) => {
  return (
    <section className="max-w-full bg-gray-50 dark:bg-gray-900 p-1 sm:p-3 -mt-2 antialiased left-0">
      <Breadcrumb
        aria-label="Solid background breadcrumb example"
        className="bg-gray-50 px-5 py-3 dark:bg-gray-800"
      >
        {items.map((item, index) => (
          <ReusableBreadcrumbItemClient key={index} href={item.href}>
            {item.label}
          </ReusableBreadcrumbItemClient>
        ))}
      </Breadcrumb>
    </section>
  );
};

export default ReusableBreadcrumbClient;
