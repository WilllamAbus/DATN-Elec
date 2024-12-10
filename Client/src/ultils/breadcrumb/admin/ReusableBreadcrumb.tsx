import { Breadcrumb } from "flowbite-react";
import ReusableBreadcrumbItem from "./ReusableBreadcrumbItem";
import { useParams } from "react-router-dom";

interface BreadcrumbItem {
  href: string;
  label: string;
}

interface ReusableBreadcrumbProps {
  items: BreadcrumbItem[];
}

const ReusableBreadcrumb = ({ items }: ReusableBreadcrumbProps) => {
  const { id } = useParams<{ id: string }>(); 

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-3 -mt-2 antialiased">
      <Breadcrumb
        aria-label="Solid background breadcrumb example"
        className="flex px-5 py-1 mt- sm:p-5 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
      >
        {items.map((item, index) => (
          <ReusableBreadcrumbItem key={index} href={item.href.replace(":id", id || "")}>
            {item.label}
          </ReusableBreadcrumbItem>
        ))}
      </Breadcrumb>
    </section>
  );
};

export default ReusableBreadcrumb;
