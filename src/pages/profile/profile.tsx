import { logout } from '@store/auth/authActions';
import { useAppDispatch } from '@store/index';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import styles from './profile.module.css';

const linkClass = ({ isActive }: { isActive: boolean }): string =>
  `${styles.menu_link} text text_type_main-medium ${isActive ? '' : 'text_color_inactive'}`;

const HINT_TEXT: Record<'form' | 'orders', string> = {
  form: 'В этом разделе вы можете изменить свои персональные данные',
  orders: 'В этом разделе вы можете просмотреть свою историю заказов',
};

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const hint =
    location.pathname === '/profile/orders' ? HINT_TEXT.orders : HINT_TEXT.form;

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
          {hint}
        </p>
      </nav>
      <Outlet />
    </div>
  );
};
