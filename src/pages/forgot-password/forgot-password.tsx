import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';

import { useForm } from '@hooks/use-form';
import { forgotPasswordApi } from '@utils/api';

import styles from '../auth.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { values, onChange } = useForm({ email: '' });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    void forgotPasswordApi(values.email)
      .then(() => {
        localStorage.setItem('resetPasswordAllowed', 'true');
        void navigate('/reset-password');
      })
      .catch(() => undefined);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>
        <EmailInput
          name="email"
          placeholder="Укажите e-mail"
          value={values.email}
          onChange={onChange}
        />
        <Button htmlType="submit" type="primary" size="medium">
          Восстановить
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
