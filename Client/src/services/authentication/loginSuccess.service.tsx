import axios from "axios";
import { loginFailed, loginStart, loginSuccess } from "../../redux/auth/authSlice";
import  {AppDispatch}  from "../../redux/store";


const API_URL = import.meta.env.VITE_API_URL;

export const apiLoginSuccess = async (id: string, token: string, dispatch: AppDispatch, navigate: (path: string) => void) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(`${API_URL}/auth/login-success`, { id, tokenLogin: token });
        dispatch(loginSuccess(res.data));
        
        // Trì hoãn việc chuyển hướng 3 giây
        setTimeout(() => {
            navigate("/");
        }, 3000);
    } catch (err: any) {
        console.error('Error in apiLoginSuccess:', err.response?.data || err.message);
        dispatch(loginFailed());
        navigate('/login-error');
    }
};
