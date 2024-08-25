import { Carousel } from "flowbite-react";

export function UserBanner() {
  return (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 px-4 bg-bgf3f4f6">
      <Carousel slide={false}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/banner%2Fbn-7.svg?alt=media&token=53fdddd8-1c89-4811-b91d-697b720e1eae"
          alt="..."
        />
        <img
          src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/banner%2Fbn-12.svg?alt=media&token=0f00b69c-a05c-45ba-ba13-697498631a49"
          alt="..."
        /> 
        <img
          src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/banner%2Fbn-11.svg?alt=media&token=168572bc-5e4d-46a7-a96c-bb1302c5a1d3"
          alt="..."
        />
        <img src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/banner%2Fbn-11.svg?alt=media&token=168572bc-5e4d-46a7-a96c-bb1302c5a1d3" alt="..." />
        <img src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/banner%2Fbn-10.svg?alt=media&token=7aa11d7b-2e51-420e-b207-d5e4549964e5" alt="..." />
      </Carousel>
    </div>
  );
}
