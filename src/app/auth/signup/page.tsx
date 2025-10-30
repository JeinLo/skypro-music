'use client';

import { createUser, getTokens } from '@/services/auth/authApi';
import styles from './signup.module.css';
import classNames from 'classnames';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/store';
import { setAuth } from '@/store/features/authSlice';
import { AuthUserProps, AuthUserReturn } from '@/services/auth/authApi';
import { toast } from 'react-toastify';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => setter(e.target.value);

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      return toast.error('Заполните все поля');
    }
    if (password !== confirmPassword) {
      return toast.error('Пароли не совпадают');
    }

    setIsLoading(true);
    try {
      const userResponse: AuthUserReturn = await createUser({ email, password });
      const tokens = await getTokens(email, password);

      dispatch(
        setAuth({
          access: tokens.access,
          refresh: tokens.refresh,
          userId: userResponse._id,
          username: userResponse.username,
        })
      );
      localStorage.setItem('userId', userResponse._id.toString());
      localStorage.setItem('username', userResponse.username);
      toast.success('Регистрация успешна!');
      router.push('/music/main');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ошибка регистрации';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Link href="/music/main">
        <div className={styles.modal__logo}>
          <img src="/img/logo_modal.png" alt="logo" />
        </div>
      </Link>
      <input
        className={classNames(styles.modal__input, styles.login)}
        type="text"
        placeholder="Почта"
        value={email}
        onChange={onChange(setEmail)}
        disabled={isLoading}
      />
      <input
        className={styles.modal__input}
        type="text"
        placeholder="Имя пользователя"
        value={username}
        onChange={onChange(setUsername)}
        disabled={isLoading}
      />
      <input
        className={styles.modal__input}
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={onChange(setPassword)}
        disabled={isLoading}
      />
      <input
        className={styles.modal__input}
        type="password"
        placeholder="Повторите пароль"
        value={confirmPassword}
        onChange={onChange(setConfirmPassword)}
        disabled={isLoading}
      />
      <button
        disabled={isLoading}
        onClick={onSubmit}
        className={styles.modal__btnSignupEnt}
      >
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
    </>
  );
}