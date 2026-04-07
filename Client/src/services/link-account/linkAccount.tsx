const API_URL = import.meta.env.VITE_API_URL;

const linkAccount = (email: string, googleId: string) => {
  window.location.href = `${API_URL}/link-account?email=${(email)}&googleId=${(googleId)}`;
};


export default linkAccount;
