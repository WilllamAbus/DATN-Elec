import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserHeader from "../../../components/User/header";
import UserNav from "../../../components/User/navbar";
import UserFooter from "../../../components/User/footer";
import UserCoppyright from "../../../components/User/copyright";
import "../../../assets/css/user.style.css";
import { useForm } from "react-hook-form";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { registerApi } from "../../../services/authentication/auth.services";

const Register: React.FC = () => {
  const { register, getValues, handleSubmit, formState } = useForm();

  const naviagate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const registerSubmit = async (value: any) => {
    const res = await registerApi({
      email: value?.email,
      password: value?.password,
      name: value?.name,
    });
    if (res) {
      alert("Registration successful");
    } else {
      alert("Registration failed");
    }
  };
  // const registerSubmit = async (value: any) => {
  //   console.log("value submit === ", value);
  //   try {
  //     console.log("start call api");
  //     const res = await axios.post("http://10.82.60.85:3001/user/register", {
  //       username: value?.username,
  //       email: value?.email,
  //       password: value?.password,
  //       full_name: value?.name,
  //     });

  //     //   console.log("response === ", res);
  //     console.log("end call api");
  //   } catch (err) {
  //     console.log("error === ", err);
  //   }
  // };

  return (
    <>
      <UserHeader />
      <UserNav />
      <div className="contain py-16">
        <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
          <h2 className="text-2xl uppercase font-medium mb-1">Đăng Ký</h2>
          <p className="text-gray-600 mb-6 text-sm">Welcome back </p>
          <form id="addLoginButton" action="" method="post" autoComplete="off">
            <div className="space-y-2">
              <div>
                <label htmlFor="name" className="text-gray-600 mb-2 block">
                  Tên
                </label>
                <input
                  type="text"
                  className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                  {...register("name", {
                    required: {
                      value: true,
                      message: "Tên không được bỏ trống",
                    },
                  })}
                />
                {formState?.errors?.name && (
                  <small className="text-red-600">
                    {formState?.errors?.name?.message?.toString() ?? null}
                  </small>
                )}

                <label htmlFor="email" className="text-gray-600 mb-2 block">
                  Email{" "}
                </label>

                <input
                  type="email"
                  className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                  placeholder="youremail.@domain.com"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Email không được bỏ trống",
                    },
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Email không đúng định dạng",
                    },
                  })}
                />
                {formState?.errors?.email && (
                  <small className="text-red-600">
                    {formState?.errors?.email?.message?.toString() ?? null}
                  </small>
                )}
              </div>
              <div>
                <label htmlFor="email" className="text-gray-600 mb-2 block">
                  Mật khẩu{" "}
                </label>

                <input
                  type="password"
                  className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                  placeholder="Nhập mật khẩu..."
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Mật khẩu không được bỏ trống",
                    },
                    minLength: {
                      value: 6,
                      message: "Mật khẩu ít nhất có 6 ký tự",
                    },
                  })}
                />
                {formState?.errors?.password && (
                  <small className="text-red-600">
                    {formState?.errors?.password?.message?.toString() ?? null}
                  </small>
                )}
              </div>
              <div>
                <label htmlFor="email" className="text-gray-600 mb-2 block">
                  Xác nhận mật khẩu{" "}
                </label>

                <input
                  type="password"
                  className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                  placeholder="Xác nhận mật khẩu..."
                  {...register("confirm", {
                    required: {
                      value: true,
                      message: "Xác nhận mật khẩu không được bỏ trống",
                    },
                    minLength: {
                      value: 6,
                      message: "Xác nhận mật khẩu ít nhất có 6 ký tự",
                    },
                    validate: (confirm) => {
                      const password = getValues()?.password;
                      if (confirm === password) {
                        return true;
                      }

                      return "Mật khẩu và xác nhận không trùng nhau";
                    },
                  })}
                />
                {formState?.errors?.confirm && (
                  <small className="text-red-600">
                    {formState?.errors?.confirm?.message?.toString() ?? null}
                  </small>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center">
                {/* <input type="checkbox" name="remember" id="remember"
                                    className="text-primary focus:ring-0 rounded-sm cursor-pointer" />
                                <label htmlFor="remember" className="text-gray-600 ml-3 cursor-pointer">Remember me</label> */}
              </div>
              <a href="#" className="text-primary">
                Quên mật khẩu
              </a>
            </div>
            <div className="mt-4">
              <Link to="/verifyOTP">
                <button
                  type="submit"
                  className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
                  // onClick={handleSubmit(registerSubmit)}
                >
                  ĐĂNG KÝ
                </button>
              </Link>
            </div>
          </form>

          <div className="mt-6 flex justify-center relative">
            <div className="text-gray-600 uppercase px-3 bg-white z-10 relative">
              Or
            </div>
            <div className="absolute left-0 top-3 w-full border-b-2 border-gray-200"></div>
          </div>
          <div className="mt-4 flex gap-4">
            <a
              href="/regisOTP"
              className="w-1/2 py-2 text-center text-white bg-blue-800 rounded uppercase font-roboto font-medium text-sm hover:bg-blue-700"
            >
              OTP
            </a>
            <a
              href="#"
              className="w-1/2 py-2 text-center text-white bg-red-600 rounded uppercase font-roboto font-medium text-sm hover:bg-red-500"
            >
              Google
            </a>
          </div>

          <p className="mt-4 text-center text-gray-600">
            Bạn chưa có tài khoản?{" "}
            <Link to="/register" className="text-primary">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
      <UserFooter />
      <UserCoppyright />
    </>
  );
};

export default Register;
