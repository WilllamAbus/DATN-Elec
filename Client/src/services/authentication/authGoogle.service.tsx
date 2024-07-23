

const API_URL = import.meta.env.VITE_API_URL;

const authGoogleService = {
  loginWithGoogle: () => {
    window.location.href = `${API_URL}/auth/google`;
  }
};

export default authGoogleService;
