import React, { useState, useEffect } from "react";
import "flowbite";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "../../ultils/dropdown/client/nav/dropdown.LogoUser.nav";
import UserMenuDropdown from "../../ultils/dropdown/client/nav/toggleDropdown";
import { listCateNavItemThunk } from "../../redux/clientcate/client/Thunk/";
import logoNav from "../../assets/images/logoHeader/logo.svg";
import { useAppDispatch, type RootState } from "../../redux/rootReducer";
import cateDropdownItems from "./listCateNav/path/hookspathnav";
import { searchProduct } from "../../services/product_v2/client/homeAllProduct";
import { Drawer, Sidebar } from "flowbite-react";
import { useSelector } from "react-redux";
import { Tooltip } from "@nextui-org/react";
// import algoliasearch from "algoliasearch/lite";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  0: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  0: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

// const searchClient = algoliasearch("HCQHU7GEB1", "415bf6e3084b190a88deebe9791858c7");
// const index = searchClient.initIndex('products'); // Make sure this matches your Algolia index name
const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const [keyword, setKeyword] = useState<string>("");
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    dispatch(listCateNavItemThunk());
  }, [dispatch]);

  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const dropdownItems = cateDropdownItems();

  
  // Lấy từ khóa từ URL và cập nhật input
  useEffect(() => {
    const currentPath = location.pathname;
    const match = currentPath.match(/\/search\/(.+)/); // Kiểm tra URL có chứa từ khóa
    if (match && match[1]) {
      setKeyword(decodeURIComponent(match[1])); // Giải mã từ khóa và set vào state
    }
  }, [location.pathname]); // Mỗi khi URL thay đổi, cập nhật từ khóa

  // Xử lý nhập liệu tìm kiếm
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
  };

  // Tìm kiếm khi nhấn Enter
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && keyword.trim().length > 1) {
      handleSubmit(event as unknown as React.FormEvent);
    }
  };

  // Xử lý gửi tìm kiếm
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKeyword = keyword.trim(); // Loại bỏ khoảng trắng thừa
    if (trimmedKeyword) {
      const encodedKeyword = encodeURIComponent(trimmedKeyword); // Mã hóa từ khóa
      navigate(`/search/${encodedKeyword}`); // Chuyển hướng đến trang tìm kiếm
    }
  };

  // Hàm tìm kiếm bằng giọng nói
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Trình duyệt không hỗ trợ tìm kiếm bằng giọng nói.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN"; // Đặt ngôn ngữ là tiếng Việt
    recognition.start();
    setIsListening(true); // Bật trạng thái lắng nghe

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const keyword = event.results[0][0].transcript.trim(); // Lấy kết quả nhận diện
      setKeyword(keyword);

      // Gọi tìm kiếm ngay sau khi nhận diện giọng nói
      if (keyword.length >= 2) {
        // Chỉ tìm kiếm khi từ khóa dài hơn 2 ký tự
        try {
          const result = await searchProduct(keyword);

          // Điều hướng đến trang tìm kiếm dù có kết quả hay không
          navigate(`/search/${encodeURIComponent(keyword)}`);

          if (result?.data?.length > 0) {
            // Nếu có kết quả, bạn có thể cập nhật kết quả tìm kiếm vào một nơi khác (ví dụ, trong trang tìm kiếm)
            // Ví dụ: Cập nhật sản phẩm tìm thấy vào một state khác (nếu cần)
          } else {
            // Nếu không có kết quả, bạn không cần phải làm gì ở đây, chỉ điều hướng thôi
          }
        } catch (error) {
          console.error("Lỗi khi tìm kiếm:", error);
          // Nếu có lỗi, có thể xử lý lại như xóa kết quả hoặc hiển thị thông báo lỗi nếu cần
        }
      } else {
        // Nếu từ khóa ngắn hơn 2 ký tự, không làm gì và giữ nguyên kết quả
      }

      setIsListening(false); // Tắt trạng thái lắng nghe
    };

    recognition.onerror = (event: Event) => {
      console.error("Lỗi nhận diện giọng nói:", event);
      setIsListening(false); // Tắt trạng thái lắng nghe nếu có lỗi
    };

    recognition.onend = () => {
      setIsListening(false); // Kết thúc lắng nghe
    };
  };



  const isLoggedIn = useSelector((state: RootState) => state.auth.login.isLoggedIn);

  return (
    <header>
      <nav className="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 py-2 px-4">
        <div className="flex justify-between items-center max-w-screen-2xl mx-auto">
          <div className="flex justify-start items-center">
            <a href="/" className="flex">
              <img src={logoNav} className="mr-3 h-8" />
              <span className="self-center hidden sm:flex text-2xl font-semibold whitespace-nowrap dark:text-white">
                E-Com
              </span>
            </a>
            <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1 ml-14">
              <ul className="flex flex-col mt-4 space-x-6 text-sm font-medium lg:flex-row xl:space-x-8 lg:mt-0">
                <span className="hidden sm:flex">
                  <Dropdown buttonText="Danh mục" items={dropdownItems} />
                </span>
                <li>
            {isLoggedIn ? (
              <Link
                to="/auction"
                className="block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
              >
                Đấu giá
              </Link>
            ) : (
              <Tooltip content="Đăng nhập để vào đấu giá" placement="bottom">
                <span className="block text-gray-500 cursor-not-allowed dark:text-gray-600">
                  Đấu giá
                </span>
              </Tooltip>
            )}
          </li>
              </ul>
            </div>
          </div>

          <form className="relative mt-1 lg:w-[32rem]" onSubmit={handleSubmit}>
            <label htmlFor="topbar-search" className="sr-only">
              Search
            </label>
            <div className="flex items-center">
              {/* Input tìm kiếm */}
              <div className="relative flex items-center flex-grow">
                <input
                  type="text"
                  id="topbar-search"
                  className="bg-gray-50 border sm:w-[100px] border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-2 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={keyword}
                  onChange={handleSearch}
                  onKeyDown={handleKeyDown}
                  placeholder="Tìm kiếm"
                />
                {/* Biểu tượng tìm kiếm */}
                <div className="absolute inset-y-0 right-2 flex items-center pl-3 pointer-events-none">
                  <button type="submit">
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Nút tìm kiếm bằng giọng nói */}
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`relative bg-transparent p-1 m-2 rounded-full border-2 ${
                  isListening
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-gray-300 text-gray-500"
                } flex items-center justify-center`}
              >
                <svg
                  className={`w-5 h-5 ${isListening ? "animate-pulse" : ""}`}
                  fill="currentColor"
                  viewBox="0 0 16 18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#444"
                    d="M8 10v0c-1.7 0-3-1.3-3-3v-4c0-1.6 1.3-3 3-3v0c1.6 0 3 1.3 3 3v4c0 1.6-1.4 3-3 3z"
                  ></path>
                  <path
                    fill="#444"
                    d="M12 5v2.5c0 1.9-1.8 3.5-3.8 3.5h-0.4c-2 0-3.8-1.6-3.8-3.5v-2.5c-0.6 0-1 0.4-1 1v1.5c0 2.2 1.8 4.1 4 4.4v2.1c-3 0-2.5 2-2.5 2h7c0 0 0.5-2-2.5-2v-2.1c2.2-0.4 4-2.2 4-4.4v-1.5c0-0.6-0.4-1-1-1z"
                  ></path>
                </svg>
              </button>
            </div>
          </form>

          <div className="flex justify-between items-center lg:order-2">
            <UserMenuDropdown />
            <button
              onClick={() => setIsOpen(true)}
              type="button"
              id="toggleMobileMenuButton"
              data-collapse-toggle="toggleMobileMenu"
              className="items-center p-2 text-gray-500 rounded-lg md:ml-2 lg:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="#000000"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <Drawer open={isOpen} onClose={handleClose}>
            <Drawer.Header title="MENU" titleIcon={() => <></>} />
            <Drawer.Items>
              <Sidebar
                aria-label="Sidebar with multi-level dropdown example"
                className="[&>div]:bg-transparent [&>div]:text-gray-900 [&>div]:dark:text-gray-200 [&>div]:text-sm [&>div]:space-y-1"
              >
                <Link
                  to="/"
                  className="flex items-center mb-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white rounded-md p-2"
                >
                  Trang chủ
                </Link>

                <Dropdown buttonText="Danh mục" items={dropdownItems} />

                {isLoggedIn ? (
                  <Link
                    to="/auction"
                    className="flex items-center mb-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white rounded-md p-2"
                  >
                    Đấu giá
                  </Link>
                ) : (
                  <Tooltip content="Đăng nhập để vào đấu giá" placement="bottom">
                    <div className="flex items-center mb-2 text-gray-500 rounded-md p-2 cursor-not-allowed">
                      Đấu giá
                    </div>
                  </Tooltip>
                )}

                <Link
                  to="/profile"
                  className="flex items-center mb-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white rounded-md p-2"
                >
                  Tài khoản của tôi
                </Link>
                <Link
                  to="/login"
                  className="flex items-center mb-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white rounded-md p-2"
                >
                  Đăng nhập
                </Link>

                <Link
                  to="/register"
                  className="flex items-center mb-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white rounded-md p-2"
                >
                  Đăng ký
                </Link>

                <Link
                  to="/checkout"
                  className="flex items-center mb-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white rounded-md p-2"
                >
                  Giỏ hàng
                </Link>
              </Sidebar>
            </Drawer.Items>
          </Drawer>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
