"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// import {
//   breadcrumbItemClient,
//   ReusableBreadcrumbClient,
// } from "../../../../ultils/breadcrumb";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  // Squares2X2Icon,
} from "@heroicons/react/20/solid";

const sortOptions = [
  { name: "Most Popular", href: "#", current: true },
  { name: "Best Rating", href: "#", current: false },
  { name: "Newest", href: "#", current: false },
  { name: "Price: Low to High", href: "#", current: false },
  { name: "Price: High to Low", href: "#", current: false },
];
const subCategories = [
  { name: "Totes", href: "#" },
  { name: "Backpacks", href: "#" },
  { name: "Travel Bags", href: "#" },
  { name: "Hip Bags", href: "#" },
  { name: "Laptop Sleeves", href: "#" },
];
const filters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White", checked: false },
      { value: "beige", label: "Beige", checked: false },
      { value: "blue", label: "Blue", checked: true },
      { value: "brown", label: "Brown", checked: false },
      { value: "green", label: "Green", checked: false },
      { value: "purple", label: "Purple", checked: false },
    ],
  },
  {
    id: "category",
    name: "Category",
    options: [
      { value: "new-arrivals", label: "New Arrivals", checked: false },
      { value: "sale", label: "Sale", checked: false },
      { value: "travel", label: "Travel", checked: true },
      { value: "organization", label: "Organization", checked: false },
      { value: "accessories", label: "Accessories", checked: false },
    ],
  },
  {
    id: "size",
    name: "Size",
    options: [
      { value: "2l", label: "2L", checked: false },
      { value: "6l", label: "6L", checked: false },
      { value: "12l", label: "12L", checked: false },
      { value: "18l", label: "18L", checked: false },
      { value: "20l", label: "20L", checked: false },
      { value: "40l", label: "40L", checked: true },
    ],
  },
];

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}
const Sidebar: React.FC = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<string>("all");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const priceParam = pathParts[pathParts.length - 1];

    if (priceParam === "allList") {
      setSelectedPrice("all");
    } else {
      setSelectedPrice(priceParam);
    }
  }, [location.pathname]);

  const handleCheckPrice = (e: ChangeEvent<HTMLInputElement>) => {
    const price = e.target.value;
    if (price === "all") {
      navigate(`/allList`);
    } else {
      setSelectedPrice(price);
      navigate(`/filter/${price}`);
    }
  };
  const filterPrice = [
    { value: "all", name: "price", id: "price-all", title: "Tất cả sản phẩm" },
    {
      value: "price-0",
      name: "price",
      id: "price-0",
      title: "Dưới 500.000 VNĐ",
    },
    {
      value: "price-1",
      name: "price",
      id: "price-1",
      title: "500.000 VNĐ - 1.000.000 VNĐ",
    },
    {
      value: "price-2",
      name: "price",
      id: "price-2",
      title: "1.000.000 VNĐ - 3.000.000 VNĐ",
    },
    {
      value: "price-3",
      name: "price",
      id: "price-3",
      title: "3.000.000 VNĐ - 5.000.000 VNĐ",
    },
    {
      value: "price-4",
      name: "price",
      id: "price-4",
      title: "Trên 5.000.000 VNĐ",
    },
  ];
  return (
 <>
  
    {/* Mobile Filters */}
    <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>

              <form className="mt-4 border-t border-gray-200">
                <h3 className="sr-only">Categories</h3>
                <ul role="list" className="px-2 py-3 font-medium text-gray-900">
                  {subCategories.map((category) => (
                    <li key={category.name}>
                      <a href={category.href} className="block px-2 py-3">
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>

                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">{section.name}</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="h-5 w-5 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="h-5 w-5 [.group:not([data-open])_&]:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              defaultValue={option.value}
                              defaultChecked={option.checked}
                              id={`filter-mobile-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="ml-3 min-w-0 flex-1 text-gray-500"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
     </Dialog>
  
    {/* Filter Header */}
    <main className="block items-center">
    <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Bộ lọc tìm kiếm</h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sắp xếp
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <a
                          href={option.href}
                          className={classNames(
                            option.current ? "font-medium text-gray-900" : "text-gray-500",
                            "block px-4 py-2 text-sm data-[focus]:bg-gray-100"
                          )}
                        >
                          {option.name}
                        </a>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
     </div>
  
    {/* Hidden Screen Reader Only Products Heading */}
    <h2 id="products-heading" className="sr-only">Products</h2>
  
    {/* Main Grid Layout */}
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 items-center">
      {/* Desktop Filters */}
      <form className=" border-gray-200 py-6">
        <h3 className="sr-only">Categories</h3>
        <ul role="list" className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
          {subCategories.map((category) => (
            <li key={category.name}>
              <a href={category.href}>{category.name}</a>
            </li> 
          ))}
        </ul>
  
        {/* Filter Sections */}
        {filters.map((section) => (
          <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
            <h3 className="-my-3 flow-root">
              <DisclosureButton className="group flex w-full items-center justify-between bg-bgf3f4f6 py-3 text-sm text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900">{section.name}</span>
                <span className="ml-6 flex items-center">
                  <PlusIcon
                    aria-hidden="true"
                    className="h-5 w-5 group-data-[open]:hidden"
                  />
                  <MinusIcon
                    aria-hidden="true"
                    className="h-5 w-5 [.group:not([data-open])_&]:hidden"
                  />
                </span>
              </DisclosureButton>
            </h3>
            <DisclosurePanel className="pt-6">
              <div className="space-y-4">
                {section.options.map((option, optionIdx) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      defaultValue={option.value}
                      defaultChecked={option.checked}
                      id={`filter-${section.id}-${optionIdx}`}
                      name={`${section.id}[]`}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`filter-${section.id}-${optionIdx}`}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </DisclosurePanel>
          </Disclosure>
        ))}
  
        {/* Price Filter Section */}
        <div className="border-b border-gray-200 py-5">
          <h3 className="text-xl text-gray-800 mb-3 font-medium">Giá</h3>
          <div className="space-y-2">
            {filterPrice.map((price) => (
              <div className="flex items-center">
                <input
                  type="radio"
                  name={price.name}
                  value={price.value}
                  id={price.id}
                  checked={selectedPrice === price.value}
                  onChange={handleCheckPrice}
                />
                <label className="text-gray-600 ml-3 cursor-pointer" htmlFor="price-all">
                  {price.title}
                </label>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
    </main>
    
  </>
   
  
  );
};

export default Sidebar;
