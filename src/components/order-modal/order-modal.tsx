import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useNavigate, useParams } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { OrderInfo } from '@components/order-info/order-info';
import { useOrder } from '@hooks/use-order';

export const OrderModal = (): React.JSX.Element | null => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { order, status } = useOrder(id);

  const handleClose = (): void => {
    void navigate(-1);
  };

  if (status === 'loading' || status === 'idle') {
    return (
      <Modal onClose={handleClose}>
        <Preloader />
      </Modal>
    );
  }

  if (!order) return null;

  return (
    <Modal onClose={handleClose}>
      <OrderInfo order={order} />
    </Modal>
  );
};
