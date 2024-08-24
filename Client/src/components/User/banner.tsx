import { Carousel } from "flowbite-react";

export function UserBanner() {
  return (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
      <Carousel slide={false}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/banner%2Fbn-7.svg?alt=media&token=53fdddd8-1c89-4811-b91d-697b720e1eae"
          alt="..."
        />
        {/* <img
          src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/banner%2Fbn-5.svg?alt=media&token=a3a8448b-2674-4612-b73f-fcb9de8228df"
          alt="..."
        /> */}
        <img
          src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/banner%2Fbn-8.svg?alt=media&token=998e3093-1f01-40ab-9747-49a65cf36916"
          alt="..."
        />
        {/* <img src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/banner%2Fbn-6.svg?alt=media&token=1301c19d-9653-4d86-b461-00e3b726df9e" alt="..." /> */}
        <img src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/banner%2Fbn-10.svg?alt=media&token=7aa11d7b-2e51-420e-b207-d5e4549964e5" alt="..." />
      </Carousel>
    </div>
  );
}
