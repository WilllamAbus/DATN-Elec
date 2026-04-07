import React from "react";

const Features: React.FC = () => {
  return (
    <section id="new-features" className="py-8 bg-white sm:py-10 lg:py-16">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl xl:text-5xl uppercase">
            Danh mục nổi bật
          </h2>
        </div>
        <div className="grid grid-cols-1 mt-10 text-center sm:mt-16 sm:grid-cols-2 sm:gap-x-12 gap-y-12 md:grid-cols-3 md:gap-0 xl:mt-24">
          {/* Feature 1 */}
          <div className="md:p-8 lg:p-14 flex flex-col justify-center items-center">
            <div className="w-14 h-14 rounded-full bg-purple-200 flex justify-center items-center">
              <img src="https://cdn.tgdd.vn/content/64x64-128x128.png" alt="" />
            </div>
            <h3 className="mt-12 text-xl font-bold text-gray-900">Điện thoại</h3>
            <p className="mt-5 text-base text-gray-600">Nét đẹp thời thượng, công nghệ dẫn đầu.</p>
          </div>
          {/* Feature 2 */}
          <div className="md:p-8 lg:p-14 md:border-l md:border-gray-200 flex flex-col justify-center items-center">
            <div className="w-14 h-14 rounded-full bg-teal-200 flex justify-center items-center">
              <img src="https://cdn.tgdd.vn/content/chuot-128x129.png" alt="" />
            </div>
            <h3 className="mt-12 text-xl font-bold text-gray-900">Chuột máy tính</h3>
            <p className="mt-5 text-base text-gray-600">
              Cảm giác cầm nắm tuyệt vời, điều khiển chính xác.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="md:p-8 lg:p-14 md:border-l md:border-gray-200 flex flex-col justify-center items-center">
            <div className="w-14 h-14 rounded-full bg-yellow-200 flex justify-center items-center">
              <img src="https://cdn.tgdd.vn/content/Laptop-129x129.png" alt="" />
            </div>
            <h3 className="mt-12 text-xl font-bold text-gray-900">Laptop</h3>
            <p className="mt-5 text-base text-gray-600">
            Laptop thông minh, thành công vượt bậc.
            </p>
          </div>
          {/* Feature 4 */}
          <div className="md:p-8 lg:p-14 md:border-t md:border-gray-200 flex flex-col justify-center items-center">
            <div className="w-14 h-14 rounded-full bg-red-200 flex justify-center items-center">
              <img
                src="https://cdnv2.tgdd.vn/mwg-static/common/Common/29/c5/29c569c2973e234425da7525f0de5c9a.png"
                alt=""
              />
            </div>
            <h3 className="mt-12 text-xl font-bold text-gray-900">Tablet</h3>
            <p className="mt-5 text-base text-gray-600">
            Tablet thông minh, cuộc sống tiện nghi.
            </p>
          </div>
          {/* Feature 5 */}
          <div className="md:p-8 lg:p-14 md:border-l md:border-gray-200 md:border-t flex flex-col justify-center items-center">
            <div className="w-14 h-14 rounded-full bg-green-200 flex justify-center items-center">
              <img src="https://cdn.tgdd.vn/content/64x64--2--128x128.png" alt="" />
            </div>
            <h3 className="mt-12 text-xl font-bold text-gray-900">Máy tính bộ</h3>
            <p className="mt-5 text-base text-gray-600">
            Đáp ứng nhu cầu công việc, nâng tầm giải trí.
            </p>
          </div>
          {/* Feature 6 */}
          <div className="md:p-8 lg:p-14 md:border-l md:border-gray-200 md:border-t flex flex-col justify-center items-center">
            <div className="w-14 h-14 rounded-full bg-orange-200 flex justify-center items-center">
              <img src="https://cdn.tgdd.vn/content/Tainghe-128x129.png" alt="" />
            </div>
            <h3 className="mt-12 text-xl font-bold text-gray-900">Tai nghe</h3>
            <p className="mt-5 text-base text-gray-600">
            Trải nghiệm âm nhạc chân thật, từng nốt từng âm.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
