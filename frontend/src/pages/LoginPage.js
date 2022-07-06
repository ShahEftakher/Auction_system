/* eslint-disable */
import { useEffect, useState } from 'react';
import { getMagic } from '../magic';

const LoginPage = () => {
  const magic = getMagic();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = new FormData(e.target).get('email');
    console.log(email);
    if (email) {
      /* One-liner login 🤯 */
      await magic.auth.loginWithMagicLink({ email });
      /* Redirect to the home page */
      if (isLoggedIn) {
        window.location.href = '/listings';
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      const isLoggedIn = await magic.user.isLoggedIn();
      setIsLoggedIn(isLoggedIn);
      if (isLoggedIn) {
        window.location.href = '/listings';
      }
      console.log(isLoggedIn);
    };
    init();
  }, []);

  return (
    <div>
      <div className="container">
        <h1>Please sign up or login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            required="required"
            placeholder="Enter your email"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
