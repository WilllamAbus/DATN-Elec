import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Title = () => {
  const location = useLocation();
  const titles: { [key: string]: string } = {
    "/": "Trang chủ",
    "/login": "Đăng nhập",
    "/login-error": "Lỗi đăng nhập",
    "/register": "Đăng ký",
    "/verifyEmail": "Xác minh Email",
    "/regisOTP": "Đăng ký OTP",
    "/verifyOTP": "Xác minh OTP",
    "/forgot": "Quên mật khẩu",
    "/reset-password": "Đặt lại mật khẩu",
    "/recivePass": "Nhận mật khẩu",
    "/reciveCode": "Nhận mã",
    "/allList": "Tất cả danh sách",
    "/listTing": "Danh sách của tôi",
    "/auction": "Đấu giá",
    "/cart": "Giỏ hàng",
    "/profile": "Hồ sơ cá nhân",
    "/listCart": "Quản lý giỏ hàng",
    "/watchList": "Danh sách yêu thích",
    "/viewBids": "Xem đấu giá",
    "/checkoutAuc": "Thanh toán đấu giá",
    "/confimAuc": "Xác nhận đấu giá",
    "/confimAucDefault": "Xác nhận đấu giá mặc định",
    "/contact": "Liên hệ",
    "/link-account": "Liên kết tài khoản",
    "/link-account-success": "Liên kết tài khoản thành công",
    "/search/:keyword": "Tìm kiếm sản phẩm",
    "/filter/:price": "Lọc sản phẩm",
    "/product/:slug": "Chi tiết sản phẩm",
    "/category/:slug": "Danh mục sản phẩm",
    "/detailProd/:id": "Chi tiết sản phẩm (ID)",
    "/detailAuc/:productId": "Chi tiết đấu giá",
    "/checkout/:id": "Thanh toán",
    "/complete/:id": "Hoàn tất thanh toán",
  };

  useEffect(() => {
    const path = location.pathname;

    // Xử lý các route động (dynamic routes)
    if (path.startsWith("/product/")) {
      document.title = "Chi tiết sản phẩm";
    } else if (path.startsWith("/category/")) {
      document.title = "Danh mục sản phẩm";
    } else if (path.startsWith("/search/")) {
      document.title = "Tìm kiếm sản phẩm";
    } else if (path.startsWith("/filter/")) {
      document.title = "Lọc sản phẩm";
    } else if (path.startsWith("/detailProd/")) {
      document.title = "Chi tiết sản phẩm (ID)";
    } else if (path.startsWith("/detailAuc/")) {
      document.title = "Chi tiết đấu giá";
    } else if (path.startsWith("/checkout/")) {
      document.title = "Thanh toán";
    } else if (path.startsWith("/complete/")) {
      document.title = "Hoàn tất thanh toán";
    } else {
      document.title = titles[path] || "Trang không tồn tại";
    }
  }, [location]);

  return null;
};

export default Title;
