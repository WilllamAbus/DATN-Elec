  import React, { useEffect, useState } from "react";
  import {  useParams } from "react-router-dom";

  import "../../../../assets/css/user.style.css";
  import "@fortawesome/fontawesome-free/css/all.min.css";
  import { Link } from "react-router-dom";
  import { loadPrice } from "../../../../services/product/crudProduct.service";
  import currencyFormatter from "currency-formatter";
  import Filter from "../../filter";


  function formatCurrency(value: number) {
    return currencyFormatter.format(value, { code: "VND", symbol: "" });
  }
  const search: React.FC = () => {
    const { price } = useParams<{ price: string }>();
    const [products, setProducts] = useState<any[]>([]);
    let key : string;
    switch (price) {
      case 'price-0':
          key = 'Dưới 500.000 VNĐ'; 
          break;
      case 'price-1':
          key = '500.000 VNĐ - 1.000.000 VNĐ'; 
          break;
      case 'price-2':
          key = '1.000.000 VNĐ - 3.000.000 VNĐ';
          break;
      case 'price-3':
          key = '3.000.000 VNĐ - 5.000.000 VNĐ';
          break;
      case 'price-4':
          key = 'Trên 5.000.000 VNĐ'; 
          break;
      default:
          key = 'Khoảng giá không hợp lệ';
          break;

  }
  const fetchProducts = async () => {
    if (price) {
      try {
        const result = await loadPrice(price);
        setProducts(result.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      console.log(`lỗi`);
    }
  };
    

    useEffect(() => {
      fetchProducts();
    
    }, [price]);
    return (
      <>
        {/* <!-- breadcrumb --> */}
        <div className="container py-4 flex items-center gap-3">
          <a href="/" className="text-primary text-base">
            <i className="fa-solid fa-house"></i>
          </a>
          <span className="text-sm text-gray-400">
            <i className="fa-solid fa-chevron-right"></i>
          </span>
          <p className="text-gray-600 font-medium">Shop</p>
        </div>
        {/* <!-- ./breadcrumb --> */}

        {/* <!-- shop wrapper --> */}
        <div className="container grid md:grid-cols-4 grid-cols-2 gap-6 pt-4 pb-16 items-start">
          {/* <!-- sidebar --> */}
          {/* <!-- drawer init and toggle --> */}
          <div className="text-center md:hidden">
            <button
              className="text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 block md:hidden"
              type="button"
              data-drawer-target="drawer-example"
              data-drawer-show="drawer-example"
              aria-controls="drawer-example"
            >
              {/* <ion-icon name="grid-outline"></ion-icon> */}
            </button>
          </div>

          {/* <!-- drawer component tabindex="-1"--> */}
          <div
            id="drawer-example"
            className="fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white w-80 dark:bg-gray-800"
            aria-labelledby="drawer-label"
          >
            <h5
              id="drawer-label"
              className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
            >
              <svg
                className="w-5 h-5 mr-2"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
              fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Info
            </h5>
            <button
              type="button"
              data-drawer-hide="drawer-example"
              aria-controls="drawer-example"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close menu</span>
            </button>
            <div className="divide-y divide-gray-200 space-y-5">
              <div>
                <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
                  Categories
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="cat-1"
                      id="cat-1"
                      className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                    />
                    <label className="text-gray-600 ml-3 cusror-pointer">
                      Bedroom
                    </label>
                    <div className="ml-auto text-gray-600 text-sm">(15)</div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="cat-2"
                      id="cat-2"
                      className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                    />
                    <label className="text-gray-600 ml-3 cusror-pointer">
                      Sofa
                    </label>
                    <div className="ml-auto text-gray-600 text-sm">(9)</div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="cat-3"
                      id="cat-3"
                      className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                    />
                    <label className="text-gray-600 ml-3 cusror-pointer">
                      Office
                    </label>
                    <div className="ml-auto text-gray-600 text-sm">(21)</div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="cat-4"
                      id="cat-4"
                      className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                    />
                    <label className="text-gray-600 ml-3 cusror-pointer">
                      Outdoor
                    </label>
                    <div className="ml-auto text-gray-600 text-sm">(10)</div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
                  Brands
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="brand-1"
                      id="brand-1"
                      className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                    />
                    <label className="text-gray-600 ml-3 cusror-pointer">
                      Cooking Color
                    </label>
                    <div className="ml-auto text-gray-600 text-sm">(15)</div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="brand-2"
                      id="brand-2"
                      className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                    />
                    <label className="text-gray-600 ml-3 cusror-pointer">
                      Magniflex
                    </label>
                    <div className="ml-auto text-gray-600 text-sm">(9)</div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="brand-3"
                      id="brand-3"
                      className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                    />
                    <label className="text-gray-600 ml-3 cusror-pointer">
                      Ashley
                    </label>
                    <div className="ml-auto text-gray-600 text-sm">(21)</div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="brand-4"
                      id="brand-4"
                      className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                    />
                    <label className="text-gray-600 ml-3 cusror-pointer">
                      M&D
                    </label>
                    <div className="ml-auto text-gray-600 text-sm">(10)</div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="brand-5"
                      id="brand-5"
                      className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                    />
                    <label className="text-gray-600 ml-3 cusror-pointer">
                      Olympic
                    </label>
                    <div className="ml-auto text-gray-600 text-sm">(10)</div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
                  Price
                </h3>
                <div className="mt-4 flex items-center">
                  <input
                    type="text"
                    name="min"
                    id="min"
                    className="w-full border-gray-300 focus:border-primary 
                      rounded focus:ring-0 px-3 py-1 text-gray-600 shadow-sm"
                    placeholder="min"
                  />
                  <span className="mx-3 text-gray-500">-</span>
                  <input
                    type="text"
                    name="max"
                    id="max"
                    className="w-full border-gray-300
                      focus:border-primary rounded focus:ring-0 px-3 py-1 text-gray-600 shadow-sm"
                    placeholder="max"
                  />
                </div>
              </div>

              {/* <div className="pt-4">
                <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
                  size
                </h3>
                <div className="flex items-center gap-2">
                  <div className="size-selector">
                    <input
                      type="radio"
                      name="size"
                      id="size-xs"
                      className="hidden"
                    />
                    <label className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">
                      XS
                    </label>
                  </div>
                  <div className="size-selector">
                    <input
                      type="radio"
                      name="size"
                      id="size-sm"
                      className="hidden"
                    />
                    <label className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">
                      S
                    </label>
                  </div>
                  <div className="size-selector">
                    <input
                      type="radio"
                      name="size"
                      id="size-m"
                      className="hidden"
                    />
                    <label className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">
                      M
                    </label>
                  </div>
                  <div className="size-selector">
                    <input
                      type="radio"
                      name="size"
                      id="size-l"
                      className="hidden"
                    />
                    <label className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">
                      L
                    </label>
                  </div>
                  <div className="size-selector">
                    <input
                      type="radio"
                      name="size"
                      id="size-xl"
                      className="hidden"
                    />
                    <label className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">
                      XL
                    </label>
                  </div>
                </div>
              </div> */}
              {/* 
              <div className="pt-4">
                <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
                  Color
                </h3>
                <div className="flex items-center gap-2">
                  <div className="color-selector">
                    <input
                      type="radio"
                      name="color"
                      id="red"
                      className="hidden"
                    />
                    <label className="border border-gray-200 rounded-sm h-6 w-6  cursor-pointer shadow-sm block"></label>
                  </div>
                  <div className="color-selector">
                    <input
                      type="radio"
                      name="color"
                      id="black"
                      className="hidden"
                    />
                    <label className="border border-gray-200 rounded-sm h-6 w-6  cursor-pointer shadow-sm block"></label>
                  </div>
                  <div className="color-selector">
                    <input
                      type="radio"
                      name="color"
                      id="white"
                      className="hidden"
                    />
                    <label className="border border-gray-200 rounded-sm h-6 w-6  cursor-pointer shadow-sm block"></label>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <a
                href="#"
                className="px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Learn more
              </a>
              <a
                href="#"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Get access{" "}
                <svg
                  className="w-4 h-4 ml-2"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>

          {/* <!-- ./sidebar --> */}
          <div className="col-span-1 bg-white px-4 pb-6 shadow rounded overflow-hiddenb hidden md:block">
            <div className="divide-y divide-gray-200 space-y-5">
              <div>
                <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
                  Danh mục
                </h3>
                <div className="space-y-2">
                  <form action="" method="post">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        value=""
                        className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                      />
                      <label className="text-gray-600 ml-3 cursor-pointer"></label>
                      {/* <!-- Hiển thị số lượng sản phẩm tương ứng với danh mục --> */}
                    </div>
                    {/* <!-- Thêm checkbox cho các danh mục sản phẩm khác tương tự ở đây --> */}
                    <button type="submit" className="btn btn-primary">
                      Filter
                    </button>
                  </form>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
                  Thương hiệu
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="brand-1"
                      id="brand-1"
                      className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                    />
                    <label className="text-gray-600 ml-3 cusror-pointer">
                      Cooking Color
                    </label>
                    <div className="ml-auto text-gray-600 text-sm">(15)</div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="brand-2"
                      id="brand-2"
                      className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                    />
                    <label className="text-gray-600 ml-3 cusror-pointer">
                      Magniflex
                    </label>
                    <div className="ml-auto text-gray-600 text-sm">(9)</div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="brand-3"
                      id="brand-3"
                      className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                    />
                    <label className="text-gray-600 ml-3 cusror-pointer">
                      Ashley
                    </label>
                    <div className="ml-auto text-gray-600 text-sm">(21)</div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="brand-4"
                      id="brand-4"
                      className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                    />
                    <label className="text-gray-600 ml-3 cusror-pointer">
                      M&D
                    </label>
                    <div className="ml-auto text-gray-600 text-sm">(10)</div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="brand-5"
                      id="brand-5"
                      className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                    />
                    <label className="text-gray-600 ml-3 cusror-pointer">
                      Olympic
                    </label>
                    <div className="ml-auto text-gray-600 text-sm">(10)</div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
              <Filter/>
            </div>

              {/* <div className="pt-4">
                <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
                  size
                </h3>
                <div className="flex items-center gap-2">
                  <div className="size-selector">
                    <input
                      type="radio"
                      name="size"
                      id="size-xs"
                      className="hidden"
                    />
                    <label className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">
                      XS
                    </label>
                  </div>
                  <div className="size-selector">
                    <input
                      type="radio"
                      name="size"
                      id="size-sm"
                      className="hidden"
                    />
                    <label
                      className="text-xs border border-gray-200
                                  rounded-sm h-6 w-6 flex items-center 
                                  justify-center cursor-pointer shadow-sm 
                                  text-gray-600"
                    >
                      S
                    </label>
                  </div>
                  <div className="size-selector">
                    <input
                      type="radio"
                      name="size"
                      id="size-m"
                      className="hidden"
                    />
                    <label className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">
                      M
                    </label>
                  </div>
                  <div className="size-selector">
                    <input
                      type="radio"
                      name="size"
                      id="size-l"
                      className="hidden"
                    />
                    <label className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">
                      L
                    </label>
                  </div>
                  <div className="size-selector">
                    <input
                      type="radio"
                      name="size"
                      id="size-xl"
                      className="hidden"
                    />
                    <label className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600">
                      XL
                    </label>
                  </div>
                </div>
              </div> */}

              {/* <div className="pt-4">
                <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
                Màu sắc
                </h3>
                <div className="flex items-center gap-2">
                  <div className="color-selector">
                    <input
                      type="radio"
                      name="color"
                      id="red"
                      className="hidden"
                    />
                    <label className="border border-gray-200 rounded-sm h-6 w-6  cursor-pointer shadow-sm block"></label>
                  </div>
                  <div className="color-selector">
                    <input
                      type="radio"
                      name="color"
                      id="black"
                      className="hidden"
                    />
                    <label className="border border-gray-200 rounded-sm h-6 w-6  cursor-pointer shadow-sm block"></label>
                  </div>
                  <div className="color-selector">
                    <input
                      type="radio"
                      name="color"
                      id="white"
                      className="hidden"
                    />
                    <label className="border border-gray-200 rounded-sm h-6 w-6  cursor-pointer shadow-sm block"></label>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          {/* <!-- products --> */}
          <div className="col-span-3">
            <div className="flex items-center mb-4">
              <select
                name="sort"
                id="sort"
                className="w-44 text-sm text-gray-600 py-3 px-4 border-gray-300 shadow-sm rounded focus:ring-primary focus:border-primary"
              >
                <option value="">Mặc định sắp xếp</option>
                <option value="price-low-to-high">Giá thấp to cao</option>
                <option value="price-high-to-low">Price cao to thấp</option>
              </select>

              <div className="flex gap-2 ml-auto">
                <div className="border border-primary w-10 h-9 flex items-center justify-center text-white bg-primary rounded cursor-pointer">
                  <i className="fa-solid fa-grip-vertical"></i>
                </div>
                <div className="border border-gray-300 w-10 h-9 flex items-center justify-center text-gray-600 rounded cursor-pointer">
                  <i className="fa-solid fa-list"></i>
                </div>
              </div>
            </div>


                      
            <h1 className="text-center text-3xl">Khoản giá: {key}</h1>

            {(price ?? "").length > 0 && (
              <div className="grid md:grid-cols-3 grid-cols-2 gap-6">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="h-56 w-full">
                <Link to={`/detailProd/${product._id}`}>
                  <img
                    src={product.image}
                    // alt={`product ${index + 1}`}
                    className="mx-auto h-full dark:hidden"
                  />
                </Link>
              </div>
              <div className="pt-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  {product.discount > 0 ? (
                    <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                      Up to {product.discount}% off
                    </span>
                  ) : (
                    <span className="me-2 rounded px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"></span>
                  )}
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      data-tooltip-target="tooltip-quick-look"
                      className="flex items-center space-x-2 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <p className="text-xs">({product.view})</p>
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth={2}
                          d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                        />
                        <path
                          stroke="currentColor"
                          strokeWidth={2}
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </button>

                    <div
                      id="tooltip-quick-look"
                      role="tooltip"
                      className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                      data-popper-placement="top"
                    >
                      <div className="tooltip-arrow" data-popper-arrow="" />
                    </div>
                    <button
                      type="button"
                      data-tooltip-target="tooltip-add-to-favorites"
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <span className="sr-only"> Add to Favorites </span>
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                        />
                      </svg>
                    </button>
                    <div
                      id="tooltip-add-to-favorites"
                      role="tooltip"
                      className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                      data-popper-placement="top"
                    >
                      Add to favorites
                      <div className="tooltip-arrow" data-popper-arrow="" />
                    </div>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                >
                  {product.name}
                </a>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 text-yellow-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                    </svg>
                    <svg
                      className="h-4 w-4 text-yellow-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                    </svg>
                    <svg
                      className="h-4 w-4 text-yellow-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                    </svg>
                    <svg
                      className="h-4 w-4 text-yellow-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                    </svg>
                    <svg
                      className="h-4 w-4 text-yellow-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    5.0
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {" "}
                    <div className="flex gap-1 text-sm text-yellow-400">
                      {Array.from({ length: product.rating }, (_, i) => (
                        <span key={i}>
                          <i className="fa-solid fa-star"></i>
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 items-center m-3">
                      {product.quantity > 0 ? `(Còn ${product.quantity} sản phẩm)` : " "}
                    </div>
                  </p>
                </div>
                <ul className="mt-2 flex items-center gap-4">
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Giao hàng
                    </p>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth={2}
                        d="M8 7V6c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1h-1M3 18v-7c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Giá tốt
                    </p>
                  </li>
                </ul>
                <div className="mt-4 flex items-center justify-between gap-6">
                  <p className="text-xs font-extrabold leading-tight text-gray-900 dark:text-white">
                    {product.discount > 1 ? (
                      <div>
                        <p className="text-lg text-rose-700">
                          {formatCurrency(
                            product.price * (1 - product.discount / 100)
                          )}
                          đ
                        </p>
                        <p className="text-xs line-through text-gray-400">
                          {formatCurrency(product.price)}đ
                        </p>
                      </div>
                    ) : (
                      <p className="text-lg">
                        {formatCurrency(product.price)}đ
                      </p>
                    )}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between gap-6">
                  {" "}
                  <button
                    type="button"
                    className="inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
                  >
                    <svg
                      className="-ms-2 me-2 h-5 w-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                      />
                    </svg>
                    Thêm vào giỏ hàng
                  </button>{" "}
                </div>
              </div>
            </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500">
                    Không có sản phẩm nào được tìm thấy
                  </div>
                )}
              </div>
            )}
          </div>
          {/* 
          <!-- ./products --> */}
        </div>
        {/* <!-- ./shop wrapper --> */}
      </>
    );
  };

  export default search;
