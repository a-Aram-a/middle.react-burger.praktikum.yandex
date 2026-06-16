import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useForm } from '@hooks/use-form';
import { resetPasswordApi } from '@utils/api';

import styles from '../auth.module.css';

export const ResetPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { values, onChange } = useForm({ password: '', token: '' });

  if (!localStorage.getItem('resetPasswordAllowed')) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    void resetPasswordApi(values)
      .then(() => {
        localStorage.removeItem('resetPasswordAllowed');
        void navigate('/login');
      })
      .catch(() => undefined);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>
        <PasswordInput
          name="password"
          placeholder="Введите новый пароль"
          value={values.password}
          onChange={onChange}
        />
        <Input
          type="text"
          name="token"
          placeholder="Введите код из письма"
          value={values.token}
          onChange={onChange}
        />
        <Button htmlType="submit" type="primary" size="medium">
          Сохранить
        </Button>
      </form>
      <div className={`${styles.hints} mt-20`}>
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};
