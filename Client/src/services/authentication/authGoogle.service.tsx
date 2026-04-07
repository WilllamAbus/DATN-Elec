const API_URL = import.meta.env.VITE_API_URL;

const authGoogleService = {
  loginWithGoogle: () => {
    window.open(`${API_URL}/auth/google`, "_self");
  },
};

export default authGoogleService;
