import { useEffect, useState } from "react";
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
  const [isSticky, setIsSticky] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        setIsSticky(false);
      } else {
        setIsSticky(true);
      }
      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  return (
    <section className="w-full bg-gray-50 dark:bg-gray-900 p-0 sm:p-3 mt-3 antialiased">
      <div
        className={`sticky top-0 z-60 transition-transform duration-300 ${
          isSticky ? "" : "-translate-y-full"
        }`}
      >
        <Breadcrumb
          aria-label="Solid background breadcrumb example"
          className="bg-white px-6 py-1 dark:bg-gray-800"
        >
          {items.map((item, index) => (
            <ReusableBreadcrumbItemClient key={index} href={item.href}>
              {item.label}
            </ReusableBreadcrumbItemClient>
          ))}
        </Breadcrumb>
      </div>
    </section>
  );
};

export default ReusableBreadcrumbClient;
