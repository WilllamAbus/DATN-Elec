import { Badge, Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchCartList } from "../../redux/cart/cartThunk";
import { CheckWatchlistThunk } from "../../redux/product/wathList/wathlist";

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const carts = useSelector((state: RootState) => state.cart.carts);
  const wathlist = useSelector((state: RootState) => state.watchlist.items);

  const totalProducts = carts
    ? carts.reduce((productSet, cart) => {
        if (cart.items && Array.isArray(cart.items)) {
          cart.items.forEach((item) => productSet.add(item.product));
        }
        return productSet;
      }, new Set()).size
    : "";
  useEffect(() => {
    dispatch(CheckWatchlistThunk());
  }, [dispatch]);
  const totalWatchlistItems = wathlist
    ? wathlist.filter((item) => item.product).length
    : "";

  useEffect(() => {
    dispatch(fetchCartList());
  }, [dispatch]);

  const handleWatchlistView = () => {
    navigate("/profile", { state: { view: "watchlist" } });
  };
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsVisible(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isVisible) return null; // Không render Header nếu không cần
  return (
    <header className="sticky  top-0 z-40 flex-none w-full mx-auto bg-primary-500 border-b border-gray-200 dark:border-gray-600 dark:bg-gray-800">
      <nav className="bg-primary-400 dark:bg-gray-800 antialiased p-2">
        <div className="max-w-screen-2xl px-8 mx-auto 2xl:px-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <ul className="hidden lg:flex items-center justify-start gap-6 md:gap-8 sm:justify-center">
                <li>
                  <Link
                    to="contact"
                    className="flex text-sm font-medium text-white hover:text-gray-700 dark:text-white dark:hover:text-primary-500"
                  >
                    Liên hệ
                  </Link>
                </li>
                <li className="shrink-0">
                  <a
                    href="#"
                    title=""
                    className="flex text-sm font-medium text-white hover:text-gray-700 dark:text-white dark:hover:text-primary-500"
                  >
                    Tin công nghệ
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex items-center lg:space-x-2">
              <Badge
                color="danger"
                content={totalProducts}
                size="sm"
                shape="circle"
              >
                <Link to="/cart">
                  <Button
                    type="button"
                    className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-blue-500 dark:hover:bg-gray-700 text-sm font-medium leading-none text-white dark:text-white"
                  >
                    <i className="iconify mdi--cart w-5 h-5 "></i>
                    <span className="hidden sm:flex">Giỏ hàng</span>
                  </Button>
                </Link>
              </Badge>
              <Link to="/session-auction">
                <Button
                  type="button"
                  className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-blue-500 dark:hover:bg-gray-700 text-sm font-medium leading-none text-white dark:text-white"
                >

                  <span className="hidden sm:flex">Phiên đấu giá</span>
                </Button>
              </Link>
              <Badge
                color="danger"
                content={totalWatchlistItems}
                size="sm"
                shape="circle"
              >
                <Button
                  onClick={handleWatchlistView}
                  id="userDropdownButton1"
                  data-dropdown-toggle="userDropdown1"
                  type="button"
                  className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-blue-500 dark:hover:bg-gray-700 text-sm font-medium leading-none text-white dark:text-white"
                >
                  <i className="iconify mdi--favourite w-5 h-5 "></i>
                  Yêu thích
                </Button>
              </Badge>
              <div
                id="userDropdown1"
                className="hidden z-10 w-56 divide-y divide-gray-100 overflow-hidden overflow-y-auto rounded-lg bg-white antialiased shadow dark:divide-gray-600 dark:bg-gray-700"
              >
                <ul className="p-2 text-start text-sm font-medium text-gray-900 dark:text-white">
                  <li>
                    <a
                      href="#"
                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      My Account{" "}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      My Orders{" "}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      Settings{" "}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      Favourites{" "}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      Delivery Addresses{" "}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      Billing Data{" "}
                    </a>
                  </li>
                </ul>
                <div className="p-2 text-sm font-medium text-gray-900 dark:text-white">
                  <a
                    href="#"
                    title=""
                    className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {" "}
                    Sign Out{" "}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div
            id="ecommerce-navbar-menu-1"
            className="bg-gray-50 dark:bg-gray-700 dark:border-gray-600 border border-gray-200 rounded-lg py-3 hidden px-4 mt-4"
          >
            <ul className="text-gray-900 dark:text-white text-sm font-medium space-y-3">
              <li>
                <a
                  href="#"
                  className="hover:text-primary-700 dark:hover:text-primary-500"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-700 dark:hover:text-primary-500"
                >
                  Best Sellers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-700 dark:hover:text-primary-500"
                >
                  Gift Ideas
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-700 dark:hover:text-primary-500"
                >
                  Games
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-700 dark:hover:text-primary-500"
                >
                  Electronics
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
