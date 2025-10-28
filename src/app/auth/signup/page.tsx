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

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      return setErrorMessage('Заполните все поля');
    }
    if (password !== confirmPassword) {
      return setErrorMessage('Пароли не совпадают');
    }
    setIsLoading(true);

    try {
      console.log('Sending signup request with:', { email, username, password });
      const userResponse: AuthUserReturn = await createUser({ email, password });
      console.log('Signup response:', userResponse);
      const tokens = await getTokens(email, password);
      console.log('Tokens response:', tokens);
      dispatch(
        setAuth({
          access: tokens.access,
          refresh: tokens.refresh,
          userId: userResponse._id, // Исправлено с id на _id
          username: userResponse.username,
        })
      );
      localStorage.setItem('userId', userResponse._id.toString()); // Исправлено с id на _id
      localStorage.setItem('username', userResponse.username);
      router.push('/music/main');
    } catch (error: unknown) {
      console.error('Signup error:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Ошибка регистрации');
      } else {
        setErrorMessage('Возникла неизвестная ошибка, попробуйте позже');
      }
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
        name="email"
        placeholder="Почта"
        value={email}
        onChange={onChangeEmail}
      />
      <input
        className={styles.modal__input}
        type="text"
        name="username"
        placeholder="Имя пользователя"
        value={username}
        onChange={onChangeUsername}
      />
      <input
        className={styles.modal__input}
        type="password"
        name="password"
        placeholder="Пароль"
        value={password}
        onChange={onChangePassword}
      />
      <input
        className={styles.modal__input}
        type="password"
        name="confirmPassword"
        placeholder="Повторите пароль"
        value={confirmPassword}
        onChange={onChangeConfirmPassword}
      />
      <div className={styles.errorContainer}>{errorMessage}</div>
      <button
        disabled={isLoading}
        onClick={onSubmit}
        className={styles.modal__btnSignupEnt}
      >
        Зарегистрироваться
      </button>
    </>
  );
}