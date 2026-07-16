import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { feedWsConnect, feedWsDisconnect } from '@store/feed/feedActions';
import { useAppDispatch, useAppSelector } from '@store/index';
import { useEffect } from 'react';

import { OrderCard } from '@components/order-card/order-card';
import { chunkColumns } from '@utils/orders';

import styles from './feed.module.css';

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { orders, total, totalToday, hasLoaded, error } = useAppSelector((s) => s.feed);
  const ingredientsLoaded = useAppSelector((s) => s.ingredients.items.length > 0);

  useEffect(() => {
    dispatch(feedWsConnect());
    return (): void => {
      dispatch(feedWsDisconnect());
    };
  }, [dispatch]);

  if (!hasLoaded || !ingredientsLoaded) {
    return (
      <div className={styles.container}>
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Лента заказов
        </h1>
        <div className={styles.state}>
          {error ? (
            <p className="text text_type_main-default text_color_inactive">{error}</p>
          ) : (
            <Preloader />
          )}
        </div>
      </div>
    );
  }

  const doneColumns = chunkColumns(
    orders.filter((order) => order.status === 'done').map((order) => order.number)
  );
  const inProgressColumns = chunkColumns(
    orders.filter((order) => order.status !== 'done').map((order) => order.number)
  );

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Лента заказов
      </h1>
      <main className={styles.main}>
        <ul className={`${styles.list} custom-scroll`}>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} to={`/feed/${order._id}`} />
          ))}
        </ul>

        <div className={styles.stats}>
          <div className={styles.columns}>
            <div className={styles.column}>
              <h2 className="text text_type_main-medium mb-6">Готовы:</h2>
              <div className={styles.column_lists}>
                {doneColumns.map((column, index) => (
                  <ul key={index} className={styles.number_list}>
                    {column.map((number) => (
                      <li
                        key={number}
                        className={`${styles.number} ${styles.number_done} text text_type_digits-default`}
                      >
                        {String(number).padStart(6, '0')}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            <div className={styles.column}>
              <h2 className="text text_type_main-medium mb-6">В работе:</h2>
              <div className={styles.column_lists}>
                {inProgressColumns.map((column, index) => (
                  <ul key={index} className={styles.number_list}>
                    {column.map((number) => (
                      <li
                        key={number}
                        className={`${styles.number} text text_type_digits-default`}
                      >
                        {String(number).padStart(6, '0')}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>

          <h2 className="text text_type_main-medium mt-15">Выполнено за все время:</h2>
          <p className={`${styles.total} text text_type_digits-large`}>{total}</p>

          <h2 className="text text_type_main-medium mt-15">Выполнено за сегодня:</h2>
          <p className={`${styles.total} text text_type_digits-large`}>{totalToday}</p>
        </div>
      </main>
    </div>
  );
};
