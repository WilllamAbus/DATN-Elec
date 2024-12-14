import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

const TitleAdmin = () => {
  const location = useLocation();
  const { id, product_variant_id, screenId, ramId, imageId } = useParams();

  const titles: { [key: string]: string } = {
    "/admin": "Trang quản trị",
    "/admin/addCategories": "Thêm danh mục",
    "/admin/editCategories/:id": "Chỉnh sửa danh mục",
    "/admin/listCategories": "Danh sách danh mục",
    "/admin/addproduct": "Thêm sản phẩm",
    "/admin/add-post-product": "Thêm bài viết sản phẩm",
    "/admin/edit-post/:id": "Chỉnh sửa bài viết sản phẩm",
    "/admin/add-categories-post": "Thêm danh mục bài viết sản phẩm",
    "/admin/list-categories-post": "Danh sách danh mục bài viết sản phẩm",
    "/admin/list-post": "Danh sách bài viết sản phẩm",
    "/admin/add-product-auction": "Thêm sản phẩm đấu giá",
    "/admin/list-auction": "Danh sách sản phẩm đấu giá",
    "/admin/delete-list-auction": "Xóa danh sách sản phẩm đấu giá",
    "/admin/product/:productId/addvariant": "Thêm biến thể sản phẩm",
    "/admin/product/:variantId": "Chỉnh sửa biến thể sản phẩm",
    "/admin/product/:product_variant_id/add-image-variant": "Thêm ảnh biến thể sản phẩm",
    "/admin/edit-image-and-color/:imageId": "Chỉnh sửa ảnh và màu sắc biến thể",
    "/admin/listproduct": "Danh sách sản phẩm",
    "/admin/list-product-variant/:productId": "Danh sách biến thể sản phẩm",
    "/admin/list-image-and-color/:variantId": "Danh sách ảnh và màu sắc biến thể",
    "/admin/editproduct/:id": "Chỉnh sửa sản phẩm",
    "/admin/edit-product-auction/:id": "Chỉnh sửa sản phẩm đấu giá",
    "/admin/add-screen": "Thêm màn hình",
    "/admin/add-ram": "Thêm RAM",
    "/admin/edit-screen/:screenId": "Chỉnh sửa màn hình",
    "/admin/edit-ram/:ramId": "Chỉnh sửa ram",
    "/admin/list-screen": "Danh sách màn hình",
    "/admin/list-ram": "Danh sách RAM",
    "/admin/addBrands": "Thêm thương hiệu",
    "/admin/editBrands/:id": "Chỉnh sửa thương hiệu",
    "/admin/listBrands": "Danh sách thương hiệu",
    "/admin/listSuppliers": "Danh sách nhà cung cấp",
    "/admin/addSuppliers": "Thêm nhà cung cấp",
    "/admin/editSuppliers/:id": "Chỉnh sửa nhà cung cấp",
    "/admin/listInbound": "Danh sách nhập hàng",
    "/admin/addInbound": "Thêm nhập hàng",
    "/admin/listInventory": "Danh sách tồn kho",
    "/admin/addInventory": "Thêm tồn kho",
    "/admin/addInventoryV2": "Thêm tồn kho V2",
    "/admin/listInventoryV2": "Danh sách tồn kho V2",
    "/admin/editInbound/:id": "Chỉnh sửa nhập hàng",
    "/admin/editInboundV2/:id": "Chỉnh sửa nhập hàng V2",
    "/admin/listInboundV2": "Danh sách nhập hàng V2",
    "/admin/addInboundV2": "Thêm nhập hàng V2",
    "/admin/addBuyingFormat": "Thêm định dạng mua hàng",
    "/admin/editBuyingFormat": "Chỉnh sửa định dạng mua hàng",
    "/admin/listBuyingFormat": "Danh sách định dạng mua hàng",
    "/admin/listComments": "Danh sách bình luận",
    "/admin/listDetailComments/:id": "Chi tiết bình luận",
    "/admin/listCusSer": "Danh sách dịch vụ khách hàng",
    "/admin/addVouchers": "Thêm phiếu giảm giá",
    "/admin/editVouchers/:id": "Chỉnh sửa phiếu giảm giá",
    "/admin/listVouchers": "Danh sách phiếu giảm giá",
    "/admin/listOrders": "Danh sách đơn hàng",
    "/admin/listDetailOrder/:id": "Chi tiết đơn hàng",
    "/admin/addProdAuc": "Thêm sản phẩm đấu giá",
    "/admin/editProdAuc/:id": "Chỉnh sửa sản phẩm đấu giá",
    "/admin/listProdAuc": "Danh sách sản phẩm đấu giá",
    "/admin/addPriceRand": "Thêm giá Rand",
    "/admin/editPriceRand/:id": "Chỉnh sửa giá Rand",
    "/admin/listPriceRand": "Danh sách giá Rand",
    "/admin/recycleBin": "Thùng rác",
    "/admin/recycleBinCate": "Thùng rác danh mục",
    "/admin/recycleBinOrder": "Thùng rác đơn hàng",
    "/admin/recycleBinVoucher": "Thùng rác phiếu giảm giá",
    "/admin/recycleBinSupplier": "Thùng rác nhà cung cấp",
    "/admin/recycleBinBrand": "Thùng rác thương hiệu",
    "/admin/recycleBinComment": "Thùng rác bình luận",
    "/admin/recycleBinProducTime": "Thùng rác thời gian sản phẩm",
    "/admin/recycleBinPriceRand": "Thùng rác giá Rand",
    "/admin/listUser": "Danh sách người dùng",
    "/admin/listDelete": "Danh sách đã xóa",
    "/admin/editUser": "Chỉnh sửa người dùng",
    "/admin/listOrderAuction": "Danh sách đấu giá đơn hàng",
    "/admin/detailOrderAuction/:id": "Chi tiết đấu giá đơn hàng",
    "/admin/recBinOrderAuction": "Thùng rác đấu giá đơn hàng",
  };

  const adminDynamicRoutes: { prefix: string; title: string }[] = [
    { prefix: "/admin/list-product-variant/", title: "Danh sách biến thể sản phẩm" },
    { prefix: "/admin/product/:product_variant_id/add-image-variant", title: "Thêm ảnh biến thể sản phẩm" },
    { prefix: "/admin/list-image-and-color/:variantId", title: "Danh sách ảnh và màu sắc biến thể" },
    { prefix: "/admin/edit-image-and-color/:imageId", title: "Chỉnh sửa ảnh và màu sắc biến thể" },
    { prefix: "/admin/product/:productId/addvariant", title: "Thêm biến thể sản phẩm" },
    { prefix: "/admin/product/:variantId", title: "Chỉnh sửa biến thể sản phẩm" },
    { prefix: "/admin/editproduct/:id", title: "Chỉnh sửa sản phẩm" },
    { prefix: "/admin/editCategories/:id", title: "Chỉnh sửa danh mục" },
    { prefix: "/admin/edit-post/:id", title: "Chỉnh sửa bài viết sản phẩm" },
    { prefix: "/admin/edit-product-auction/:id", title: "Chỉnh sửa sản phẩm đấu giá" },
    { prefix: "/admin/editBrands/:id", title: "Chỉnh sửa thương hiệu" },
    { prefix: "/admin/editSuppliers/:id", title: "Chỉnh sửa nhà cung cấp" },
    { prefix: "/admin/editInbound/:id", title: "Chỉnh sửa nhập hàng" },
    { prefix: "/admin/editInboundV2/:id", title: "Chỉnh sửa nhập hàng V2" },
    { prefix: "/admin/editBuyingFormat", title: "Chỉnh sửa định dạng mua hàng" },
    { prefix: "/admin/editVouchers/:id", title: "Chỉnh sửa phiếu giảm giá" },
    { prefix: "/admin/editProdAuc/:id", title: "Chỉnh sửa sản phẩm đấu giá" },
    { prefix: "/admin/editPriceRand/:id", title: "Chỉnh sửa giá Rand" },
    { prefix: "/admin/editUser", title: "Chỉnh sửa người dùng" },
    { prefix: "/admin/listDetailOrder/:id", title: "Chi tiết đơn hàng" },
    { prefix: "/admin/listDetailComments/:id", title: "Chi tiết bình luận" },
    { prefix: "/admin/list-product-variant/:productId", title: "Danh sách biến thể sản phẩm cho sản phẩm" },
    { prefix: "/admin/product/:product_variant_id/add-image-variant/:imageId", title: "Thêm ảnh biến thể sản phẩm" },
    { prefix: "/admin/edit-image-and-color/:imageId", title: "Chỉnh sửa ảnh và màu sắc biến thể" },
    { prefix: "/admin/product/:productId/addvariant", title: "Thêm biến thể sản phẩm" },
    { prefix: "/admin/product/:variantId", title: "Chỉnh sửa biến thể sản phẩm" },
    { prefix: "/admin/editproduct/:id", title: "Chỉnh sửa sản phẩm" },
    { prefix: "/admin/editCategories/:id", title: "Chỉnh sửa danh mục" },
    { prefix: "/admin/edit-post/:id", title: "Chỉnh sửa bài viết sản phẩm" },
    { prefix: "/admin/edit-ram/:ramId", title: "Chỉnh sửa ram" },
    { prefix: "/admin/edit-screen/:screenId", title: "Chỉnh sửa màn hình" },
    { prefix: "/admin/edit-product-auction/:id", title: "Chỉnh sửa sản phẩm đấu giá" },
    { prefix: "/admin/editBrands/:id", title: "Chỉnh sửa thương hiệu" },
    { prefix: "/admin/editSuppliers/:id", title: "Chỉnh sửa nhà cung cấp" },
    { prefix: "/admin/editInbound/:id", title: "Chỉnh sửa nhập hàng" },
    { prefix: "/admin/editInboundV2/:id", title: "Chỉnh sửa nhập hàng V2" },
    { prefix: "/admin/editBuyingFormat", title: "Chỉnh sửa định dạng mua hàng" },
    { prefix: "/admin/editVouchers/:id", title: "Chỉnh sửa phiếu giảm giá" },
    { prefix: "/admin/editProdAuc/:id", title: "Chỉnh sửa sản phẩm đấu giá" },
    { prefix: "/admin/editPriceRand/:id", title: "Chỉnh sửa giá Rand" },
    { prefix: "/admin/editUser", title: "Chỉnh sửa người dùng" },
    { prefix: "/admin/listDetailOrder/:id", title: "Chi tiết đơn hàng" },
    { prefix: "/admin/listDetailComments/:id", title: "Chi tiết bình luận" },
  ];

  useEffect(() => {
    const path = location.pathname;


    for (const route of adminDynamicRoutes) {
      const regex = new RegExp(`^${route.prefix.replace(/:\w+/g, '([^/]+)')}`);
      const match = path.match(regex);
      if (match) {
        document.title = route.title; 
        return;
      }
    }

    if (id || product_variant_id || screenId || ramId || imageId) {
      const dynamicTitle = `${titles[path]} - ID: ${id || product_variant_id || screenId || ramId || imageId}`;
      document.title = dynamicTitle;
    } else {
      document.title = titles[path] || "Trang quản trị không tồn tại";
    }
  }, [location, id, product_variant_id, screenId, ramId, imageId]);

  return null;
};

export default TitleAdmin;
