import { Accordion, AccordionItem } from "@nextui-org/react";

export default function Specification() {
  return (
    <Accordion selectionMode="multiple">
      <AccordionItem key="1" aria-label="Accordion 1" title="Cấu hình & Bộ nhớ">
        <dl className="divide-y divide-gray-300">
          <div className="py-2">
            <dt className="font-bold">Hệ điều hành:</dt>
            <dd>iOS 17</dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Chip xử lý (CPU):</dt>
            <dd>Apple A14 Bionic</dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Tốc độ CPU:</dt>
            <dd>2 nhân 3.1 GHz & 4 nhân 1.8 GHz</dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Chip đồ họa (GPU):</dt>
            <dd>Apple GPU 4 nhân</dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">RAM:</dt>
            <dd>4 GB</dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Dung lượng lưu trữ:</dt>
            <dd>64 GB</dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Dung lượng còn lại (khả dụng):</dt>
            <dd>Khoảng 49 GB</dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Danh bạ:</dt>
            <dd>Không giới hạn</dd>
          </div>
        </dl>
      </AccordionItem>
      <AccordionItem key="2" aria-label="Accordion 2" title="Camera & màn hình">
        <dl className="divide-y divide-gray-300">
          <div className="py-2">
            <dt className="font-bold">Độ phân giải camera sau:</dt>
            <dd>2 camera 12 MP</dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Quay phim camera sau:</dt>
            <dd>
              HD 720p@30fps, FullHD 1080p@60fps, FullHD 1080p@30fps, 
              FullHD 1080p@240fps, FullHD 1080p@120fps, 4K 2160p@60fps, 
              4K 2160p@30fps, 4K 2160p@24fps
            </dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Đèn Flash camera sau:</dt>
            <dd>Đèn LED kép</dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Tính năng camera sau:</dt>
            <dd>
              Zoom quang học, Zoom kỹ thuật số, Xóa phông, 
              Tự động lấy nét (AF), Trôi nhanh thời gian (Time Lapse), 
              Toàn cảnh (Panorama), Smart HDR 3, Quay chậm (Slow Motion), 
              Nhận diện khuôn mặt, Góc siêu rộng (Ultrawide), 
              Góc rộng (Wide), Deep Fusion, Chống rung quang học (OIS), 
              Ban đêm (Night Mode)
            </dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Độ phân giải camera trước:</dt>
            <dd>12 MP</dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Tính năng camera trước:</dt>
            <dd>
              Xóa phông, Tự động lấy nét (AF), Smart HDR 3, 
              Retina Flash, Quay video HD, Quay video Full HD, 
              Quay video 4K, Quay chậm (Slow Motion), 
              Nhận diện khuôn mặt, Nhãn dán (AR Stickers), Deep Fusion
            </dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Công nghệ màn hình:</dt>
            <dd>OLED</dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Độ phân giải màn hình:</dt>
            <dd>Super Retina XDR (1170 x 2532 Pixels)</dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Màn hình rộng:</dt>
            <dd>6.1" - Tần số quét 60 Hz</dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Độ sáng tối đa:</dt>
            <dd>1200 nits</dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Mặt kính cảm ứng:</dt>
            <dd>Kính cường lực Ceramic Shield</dd>
          </div>
        </dl>
      </AccordionItem>
      <AccordionItem key="3" aria-label="Accordion 3" title="Pin & Sạc">
        <dl className="divide-y divide-gray-300">
          <div className="py-2">
            <dt className="font-bold">Dung lượng pin:</dt>
            <dd>2815 mAh</dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Loại pin:</dt>
            <dd>Li-Ion</dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Hỗ trợ sạc tối đa:</dt>
            <dd>20 W</dd>
          </div>
          <div className="py-2">
            <dt className="font-bold">Công nghệ pin:</dt>
            <dd>
              Tiết kiệm pin, Sạc pin nhanh, Sạc không dây MagSafe, 
              Sạc không dây
            </dd>
          </div>
        </dl>
      </AccordionItem>
    </Accordion>
  );
}
