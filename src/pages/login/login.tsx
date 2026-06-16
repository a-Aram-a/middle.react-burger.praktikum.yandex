import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { login } from '@store/auth/authActions';
import { useAppDispatch } from '@store/index';
import { Link } from 'react-router-dom';

import { useForm } from '@hooks/use-form';

import styles from '../auth.module.css';

export const LoginPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { values, onChange } = useForm({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    void dispatch(login(values));
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium">Вход</h1>
        <EmailInput
          name="email"
          placeholder="E-mail"
          value={values.email}
          onChange={onChange}
        />
        <PasswordInput name="password" value={values.password} onChange={onChange} />
        <Button htmlType="submit" type="primary" size="medium">
          Войти
        </Button>
      </form>
      <div className={`${styles.hints} mt-20`}>
        <p className="text text_type_main-default text_color_inactive">
          Вы — новый пользователь?{' '}
          <Link to="/register" className={styles.link}>
            Зарегистрироваться
          </Link>
        </p>
        <p className="text text_type_main-default text_color_inactive">
          Забыли пароль?{' '}
          <Link to="/forgot-password" className={styles.link}>
            Восстановить пароль
          </Link>
        </p>
      </div>
    </div>
  );
};
