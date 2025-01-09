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
    "/session-auction": "Phiên đấu giá",
  };

  // Route động và tiêu đề tương ứng
  const dynamicRoutes: { prefix: string; title: string }[] = [
    { prefix: "/product/", title: "Chi tiết sản phẩm" },
    { prefix: "/category/", title: "Danh mục sản phẩm" },
    { prefix: "/search/", title: "Tìm kiếm sản phẩm" },
    { prefix: "/filter/", title: "Lọc sản phẩm" },
    { prefix: "/detailProd/", title: "Chi tiết sản phẩm (ID)" },
    { prefix: "/product-auction/", title: "Chi tiết đấu giá" },
    { prefix: "/checkout/", title: "Thanh toán" },
    { prefix: "/complete/", title: "Hoàn tất thanh toán" },
  ];

  useEffect(() => {
    const path = location.pathname;

    // Kiểm tra route động trước
    for (const route of dynamicRoutes) {
      if (path.startsWith(route.prefix)) {
        document.title = route.title;
        return; // Thoát khi tìm thấy match
      }
    }

    // Nếu không phải route động, kiểm tra route tĩnh
    document.title = titles[path] || "Trang không tồn tại";
  }, [location]);

  return null;
};

export default Title;
