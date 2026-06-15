import { useAppSelector } from '@store/index';
import { useNavigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';

export const IngredientModal = (): React.JSX.Element | null => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const ingredient = useAppSelector((s) =>
    s.ingredients.items.find((item) => item._id === id)
  );

  const handleClose = (): void => navigate(-1);

  if (!ingredient) return null;

  return (
    <Modal title="Детали ингредиента" onClose={handleClose}>
      <IngredientDetails ingredient={ingredient} />
    </Modal>
  );
};
