import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { updateUser } from '@store/auth/authActions';
import { useAppDispatch, useAppSelector } from '@store/index';
import { useEffect, useRef, useState } from 'react';

import styles from './profile-form.module.css';

export const ProfileForm = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
  }, [user]);

  const isChanged =
    name !== (user?.name ?? '') || email !== (user?.email ?? '') || password !== '';

  const handleReset = (): void => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPassword('');
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    void dispatch(updateUser({ name, email, password }));
    setPassword('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        type="text"
        name="name"
        placeholder="Имя"
        icon="EditIcon"
        ref={nameRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onIconClick={() => nameRef.current?.focus()}
      />
      <Input
        type="email"
        name="email"
        placeholder="Логин"
        icon="EditIcon"
        ref={emailRef}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onIconClick={() => emailRef.current?.focus()}
      />
      <Input
        type="password"
        name="password"
        placeholder="Пароль"
        icon="EditIcon"
        ref={passwordRef}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onIconClick={() => passwordRef.current?.focus()}
      />
      {isChanged && (
        <div className={styles.actions}>
          <Button htmlType="button" type="secondary" size="medium" onClick={handleReset}>
            Отмена
          </Button>
          <Button htmlType="submit" type="primary" size="medium">
            Сохранить
          </Button>
        </div>
      )}
    </form>
  );
};
