import { checkUserAuth } from '@store/auth/authActions';
import { useAppDispatch } from '@store/index';
import { fetchIngredients } from '@store/ingredients/ingredientsActions';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { IngredientModal } from '@components/ingredient-modal/ingredient-modal';
import { Layout } from '@components/layout/layout';
import { OrderModal } from '@components/order-modal/order-modal';
import { OnlyAuth, OnlyUnAuth } from '@components/protected-route/protected-route';
import { FeedPage } from '@pages/feed/feed';
import { ForgotPasswordPage } from '@pages/forgot-password/forgot-password';
import { HomePage } from '@pages/home/home';
import { IngredientPage } from '@pages/ingredient/ingredient';
import { LoginPage } from '@pages/login/login';
import { NotFoundPage } from '@pages/not-found/not-found';
import { OrderPage } from '@pages/order/order';
import { ProfileOrdersPage } from '@pages/profile-orders/profile-orders';
import { ProfilePage } from '@pages/profile/profile';
import { ProfileForm } from '@pages/profile/profile-form';
import { RegisterPage } from '@pages/register/register';
import { ResetPasswordPage } from '@pages/reset-password/reset-password';

import type { Location } from 'react-router-dom';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const state = location.state as { background?: Location } | null;
  const background = state?.background;

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<OnlyUnAuth component={<LoginPage />} />} />
          <Route path="register" element={<OnlyUnAuth component={<RegisterPage />} />} />
          <Route
            path="forgot-password"
            element={<OnlyUnAuth component={<ForgotPasswordPage />} />}
          />
          <Route
            path="reset-password"
            element={<OnlyUnAuth component={<ResetPasswordPage />} />}
          />
          <Route path="profile" element={<OnlyAuth component={<ProfilePage />} />}>
            <Route index element={<ProfileForm />} />
            <Route path="orders" element={<ProfileOrdersPage />} />
          </Route>
          <Route
            path="profile/orders/:id"
            element={<OnlyAuth component={<OrderPage />} />}
          />
          <Route path="feed" element={<FeedPage />} />
          <Route path="feed/:id" element={<OrderPage />} />
          <Route path="ingredients/:id" element={<IngredientPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {background && (
        <Routes>
          <Route path="/ingredients/:id" element={<IngredientModal />} />
          <Route path="/feed/:id" element={<OrderModal />} />
          <Route
            path="/profile/orders/:id"
            element={<OnlyAuth component={<OrderModal />} />}
          />
        </Routes>
      )}
    </>
  );
};
