import { logout } from '@store/auth/authActions';
import { useAppDispatch } from '@store/index';
import { NavLink, Outlet } from 'react-router-dom';

import styles from './profile.module.css';

const linkClass = ({ isActive }: { isActive: boolean }): string =>
  `${styles.menu_link} text text_type_main-medium ${isActive ? '' : 'text_color_inactive'}`;

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const handleLogout = (): void => {
    void dispatch(logout());
  };

  return (
    <div className={styles.container}>
      <nav className={styles.menu}>
        <NavLink to="/profile" end className={linkClass}>
          Профиль
        </NavLink>
        <NavLink to="/profile/orders" className={linkClass}>
          История заказов
        </NavLink>
        <button
          type="button"
          className={`${styles.menu_link} text text_type_main-medium text_color_inactive`}
          onClick={handleLogout}
        >
          Выход
        </button>
        <p
          className={`${styles.hint} text text_type_main-default text_color_inactive mt-20`}
        >
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </nav>
      <Outlet />
    </div>
  );
};
