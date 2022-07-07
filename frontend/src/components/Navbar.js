import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { getMagic } from '../magic';

const Navbar = () => {
  const magic = getMagic();

  const handleLogout = async () => {
    await magic.user.logout();
    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/listings">
          Auction
        </Link>

        <ul className="navbar-nav d-flex justify-content-end">
          <li className="nav-item">
            <Link className="nav-link active" aria-current="page" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link active" to="#">
              Listings
            </Link>
          </li>
        </ul>
      </div>
      <div className="d-flex justify-content-end">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  );
};

export default Navbar;
