import React from "react";
import { Button } from "@nextui-org/react";
import { itemAuction } from "src/types/cart/carts";
interface CartSummaryProps {
  cartauction: {
    _id: string;
    itemAuction: itemAuction[];
  }[];
  totalAuctionPrice: number;
  itemQuantities: Record<string, number>;
  handleCheckoutAuction: () => void;
  userRole: string[];
  activeTab: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  cartauction,
  totalAuctionPrice,
  itemQuantities,
  handleCheckoutAuction,
  userRole,
}) => {
  return (
    <div>
      {cartauction[0]?.itemAuction.length > 0 && (
        <div className="p-4 rounded-md bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Tổng cộng</h2>
          <hr className="border-gray-300 mt-4 mb-8" />
          <h3 className="text-gray-800">Danh sách sản phẩm:</h3>
          {cartauction.map((cart) => (
            <div key={cart._id} className="flex justify-between mt-2">
              <span className="text-gray-800">
                {cart.itemAuction[0]?.auctionPricingRange?.product_randBib
                  ?.product_name || "Unknown Product"}{" "}
                x{" "}
                {itemQuantities[
                  cart.itemAuction[0]?.auctionPricingRange?.product_randBib?._id
                ] ||
                  cart.itemAuction[0]?.quantity ||
                  0}
              </span>
            </div>
          ))}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-800">Tạm tính:</p>
              <p className="font-bold text-gray-800">
                {totalAuctionPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-gray-800">Phí vận chuyển:</p>
              <p className="font-bold text-gray-800">Miễn phí giao hàng</p>
            </div>
          </div>

          <hr className="border-gray-300 mt-4 mb-8" />

          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-gray-800">Tổng cộng:</p>
            <p className="text-xl font-bold text-red-600">
              {totalAuctionPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>

          <div className="mt-8 space-y-2">
            <Button
              onClick={handleCheckoutAuction}
              className="w-full bg-blue-600 font-semibold text-white hover:bg-primary-dark focus:ring-primary-light"
              isDisabled={userRole.includes("admin")}
            >
              Thanh toán
            </Button>

            <Button className="w-full bg-blue-600 font-semibold text-white hover:bg-primary-dark focus:ring-primary-light">
              Tiếp tục mua sắm
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
