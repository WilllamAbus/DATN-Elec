import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import { AppDispatch } from "../../../redux/store";
import { resetPasswordThunk } from "../../../redux/auth/authThunk";
import { useDispatch } from "react-redux";
import { Alert, Button, Label, TextInput } from "flowbite-react";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu không trùng khớp.");
      return;
    }
    if (token) {
      dispatch(resetPasswordThunk({ token, password }))
        .unwrap()
        .then((result) => setMessage(result))
        .catch((error) => setError(error.message));
    }
  };

  return (
    <>
      <div className="contain py-16">
        <div className="max-w-lg mx-auto shadow-lg px-8 py-10 rounded-lg overflow-hidden bg-white">
          <h2 className="text-2xl uppercase font-medium mb-4 text-center">
            Quên mật khẩu
          </h2>
          <p className="text-gray-600 mb-8 text-sm text-center">
            Vui lòng nhập mật khẩu mới của bạn
          </p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="password"
                  value="Mật khẩu mới"
                  className="text-gray-600"
                />
                <TextInput
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              <div>
                <Label
                  htmlFor="confirmPassword"
                  value="Xác nhận mật khẩu"
                  className="text-gray-600"
                />
                <TextInput
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
            </div>
            <div className="mt-8">
              <Button
                type="submit"
                className="w-full"
                gradientDuoTone="cyanToBlue"
              >
                XÁC NHẬN
              </Button>
              {message && (
                <Alert color="success" className="mt-4">
                  {message}
                </Alert>
              )}
              {error && (
                <Alert color="failure" className="mt-4">
                  {error}
                </Alert>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
