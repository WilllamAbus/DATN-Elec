
// import {
//   Disclosure,
//   DisclosureButton,
//   DisclosurePanel,

// } from "@headlessui/react";
// import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";


// interface FilterSectionProps {
//   sectionName: string;
//   options: { value: string; label: string; checked: boolean }[];
//   onOptionChange?: (value: string | null) => void;
// }

// const FilterSection: React.FC<FilterSectionProps> = ({ sectionName, options, onOptionChange }) => {
//   const handleOptionClick = (value: string | null) => {
//     if (onOptionChange) {
//       onOptionChange(value);
//     }
//   };

//   return (
//     <Disclosure as="div" className="border-b border-gray-200 py-6">
//       <h3 className="-my-3 flow-root">
//         <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400 hover:text-gray-500">
//           <span className="font-medium text-gray-900">{sectionName}</span>
//           <span className="ml-6 flex items-center">
//             <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
//             <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
//           </span>
//         </DisclosureButton>
//       </h3>
//       <DisclosurePanel className="pt-6">
//         <div className="space-y-4">
//           <div onClick={() => handleOptionClick(null)} className="cursor-pointer px-2 text-blue-500">
//             <a>Không chọn thương hiệu</a>
//           </div>
//           {options.map((option, optionIdx) => (
//             <div key={option.value} className="flex items-center px-2">
//               <input
//                 defaultValue={option.value}
//                 defaultChecked={option.checked}
//                 id={`filter-${sectionName}-${optionIdx}`}
//                 name={`${sectionName}[]`}
//                 type="checkbox"
//                 className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                 onClick={() => handleOptionClick(option.value)}
//               />
//               <label htmlFor={`filter-${sectionName}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
//                 {option.label}
//               </label>
//             </div>
//           ))}
//         </div>
//       </DisclosurePanel>
//     </Disclosure>
//   );
// };

// export default FilterSection;
