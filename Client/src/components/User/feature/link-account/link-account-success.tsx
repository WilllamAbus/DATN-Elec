import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
export default function Example() {

  const email = useSelector((state: RootState) => state.linkAccountUser.linkAccount.email);
 console.log(email);
 
  return (
    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
      <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
       Email:{'  '} {email}
       
      </div>
    </div>
    <div className="text-center">
      <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
      Bạn đã liên kết tài khoản thành công!
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
      Bây giờ, bạn có thể đăng nhập bằng tài khoản Google của mình
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a href="/login" className="text-sm font-semibold leading-6 text-gray-900">
          Đến trang đăng nhập <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </div>
  )
}
