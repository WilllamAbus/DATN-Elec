import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserHeader from '../../../components/User/header';
import UserNav from '../../../components/User/navbar';
import UserFooter from '../../../components/User/footer';
import UserCoppyright from '../../../components/User/copyright';
import '../../../assets/css/user.style.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

const LoginSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Đợi 3 giây và sau đó chuyển hướng đến trang chủ
        setTimeout(() => {
            navigate('/');
        }, 3000);
    }, [navigate]);  

    return (
        <>
            <UserHeader />
            <UserNav />

            <link
                href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap"
                rel="stylesheet"
            />
            <link
                href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
                rel="stylesheet"
            />
            <div className="container mx-auto px-4">
                <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden my-20">
                    <div className="flex justify-center items-center mt-8">
                        <div className="rounded-full bg-gray-200 h-40 w-40 flex items-center justify-center">
                            <i className="text-6xl text-green-500">✓</i>
                        </div>
                    </div>
                    <div className="text-center px-6 py-4">
                        <h1 className="font-bold text-3xl text-gray-900">Success</h1>
                        <p className="text-gray-700 mt-2">
                            Bạn đã đăng nhập thành công tài khoản google
                        </p>
                    </div>
                </div>
            </div>
            <UserFooter />
            <UserCoppyright />
        </>
    );
}

export default LoginSuccess;
