import styles from './feed.module.css';

export const FeedPage = (): React.JSX.Element => (
  <div className={styles.container}>
    <h1 className="text text_type_main-large">Лента заказов</h1>
    <p className="text text_type_main-medium text_color_inactive mt-10">
      Страница находится в разработке
    </p>
  </div>
);
