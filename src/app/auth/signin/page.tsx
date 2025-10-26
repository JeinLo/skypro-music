'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './signin.module.css';
import classNames from 'classnames';
import { useState } from 'react';
import { loginUser, getTokens } from '@/services/auth/authApi';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/store';
import { setAuth } from '@/store/features/authSlice';

export default function Signin() {
  const [authField, setAuthField] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onChangeUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthField({ ...authField, [name]: value });
  };

  const onSubmitUserData = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!authField.email.trim() || !authField.password.trim()) {
      return setErrorMessage('Заполните все поля');
    }

    setIsLoading(true);
    try {
      console.log('Sending login request with:', authField);
      const userResponse = await loginUser(authField);
      console.log('Login response:', userResponse); 
      const tokens = await getTokens(authField);
      dispatch(
        setAuth({
          access: tokens.access,
          refresh: tokens.refresh,
          userId: userResponse.data.id,
          username: userResponse.data.username,
        })
      );
      localStorage.setItem('userId', userResponse.data.id.toString());
      localStorage.setItem('username', userResponse.data.username);
      router.push('/music/main');
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof AxiosError) {
        if (error.response) {
          setErrorMessage(error.response.data.message || 'Ошибка авторизации');
        } else if (error.request) {
          setErrorMessage('Похоже, что-то с интернет-подключением... Попробуйте позже');
        } else {
          setErrorMessage('Возникла неизвестная ошибка, попробуйте позже');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Link href="/music/main">
        <div className={styles.modal__logo}>
          <Image src="/img/logo_modal.png" alt="logo" width={140} height={21} />
        </div>
      </Link>
      <input
        className={classNames(styles.modal__input, styles.login)}
        type="text"
        name="email"
        placeholder="Почта"
        autoComplete="email"
        value={authField.email}
        onChange={onChangeUserData}
        disabled={isLoading}
      />
      <input
        className={styles.modal__input}
        type="password"
        name="password"
        placeholder="Пароль"
        autoComplete="current-password"
        value={authField.password}
        onChange={onChangeUserData}
        disabled={isLoading}
      />
      <div className={styles.errorContainer}>{errorMessage}</div>
      <button
        className={classNames(styles.modal__btnEnter, {
          [styles.loading__btn]: isLoading,
        })}
        disabled={isLoading}
        onClick={onSubmitUserData}
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
      <Link href="/auth/signup" className={styles.modal__btnSignup}>
        Зарегистрироваться
      </Link>
    </>
  );
}