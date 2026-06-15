import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { register } from '@store/auth/authActions';
import { useAppDispatch } from '@store/index';
import { Link } from 'react-router-dom';

import { useForm } from '@hooks/use-form';

import styles from '../auth.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { values, onChange } = useForm({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    void dispatch(register(values));
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium">Регистрация</h1>
        <Input
          type="text"
          name="name"
          placeholder="Имя"
          value={values.name}
          onChange={onChange}
        />
        <EmailInput
          name="email"
          placeholder="E-mail"
          value={values.email}
          onChange={onChange}
        />
        <PasswordInput name="password" value={values.password} onChange={onChange} />
        <Button htmlType="submit" type="primary" size="medium">
          Зарегистрироваться
        </Button>
      </form>
      <div className={`${styles.hints} mt-20`}>
        <p className="text text_type_main-default text_color_inactive">
          Уже зарегистрированы?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};
