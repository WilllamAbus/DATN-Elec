import {
  Footer,
  FooterCopyright,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";

export function UserFooter() {
  return (
    <Footer className="bg-white">
      <div className="w-full">
        <div className="grid w-full grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4">
          <div>
            <FooterTitle title="Giải pháp" />
            <FooterLinkGroup col>
              <FooterLink href="#">Marketing</FooterLink>
              <FooterLink href="#">Analitycs</FooterLink>
              <FooterLink href="#">Commerce</FooterLink>
              <FooterLink href="#">Insight</FooterLink>
            </FooterLinkGroup>
          </div>
          <div>
            <FooterTitle title="Mạng xã hội" />
            <FooterLinkGroup col>
              <FooterLink href="#">Discord Server</FooterLink>
              <FooterLink href="#">Twitter</FooterLink>
              <FooterLink href="#">Facebook</FooterLink>
              <FooterLink href="#">Youtube</FooterLink>
            </FooterLinkGroup>
          </div>
          <div>
            <FooterTitle title="Kiếm tiền" />
            <FooterLinkGroup col>
              <FooterLink href="#">Bán hàng</FooterLink>
              <FooterLink href="#">Affiliate</FooterLink>
            </FooterLinkGroup>
          </div>
          <div>
            <FooterTitle title="Hỗ trợ" />
            <FooterLinkGroup col>
              <FooterLink href="#">Giá</FooterLink>
              <FooterLink href="#">Dịch vụ khách hàng</FooterLink>
              <FooterLink href="#">Thanh toán</FooterLink>
            </FooterLinkGroup>
          </div>
        </div>
        <div className="w-full bg-[#f1f1f1] px-4 py-6 sm:flex sm:items-center sm:justify-between ">
          <FooterCopyright href="#"  by="E-Com" year={2024} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <FooterIcon href="#"  icon={BsFacebook} />
            <FooterIcon href="#"  icon={BsInstagram} />
            <FooterIcon href="#"  icon={BsTwitter} />
            <FooterIcon href="#"  icon={BsGithub} />
            <FooterIcon href="#"  icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
