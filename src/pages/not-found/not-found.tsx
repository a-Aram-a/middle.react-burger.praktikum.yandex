import { Link } from 'react-router-dom';

import styles from './not-found.module.css';

export const NotFoundPage = (): React.JSX.Element => (
  <div className={styles.container}>
    <h1 className="text text_type_digits-large">404</h1>
    <p className="text text_type_main-medium mt-4">Такая страница не найдена</p>
    <Link to="/" className={`${styles.link} text text_type_main-default mt-8`}>
      Вернуться на главную
    </Link>
  </div>
);
