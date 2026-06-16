import { Outlet } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';

import styles from './layout.module.css';

export const Layout = (): React.JSX.Element => (
  <div className={styles.layout}>
    <AppHeader />
    <Outlet />
  </div>
);
