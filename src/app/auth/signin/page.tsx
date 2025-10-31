'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './signin.module.css';
import classNames from 'classnames';
import { useState } from 'react';
import { loginUser, getTokens } from '@/services/auth/authApi';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/store';
import { setAuth } from '@/store/features/authSlice';
import { AuthUserProps, AuthUserReturn } from '@/services/auth/authApi';
import { toast } from 'react-toastify';

export default function Signin() {
  const [authField, setAuthField] = useState<AuthUserProps>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onChangeUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthField({ ...authField, [name]: value });
  };

  const onSubmitUserData = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!authField.email.trim() || !authField.password.trim()) {
      return toast.error('Заполните все поля');
    }

    setIsLoading(true);
    try {
      const userResponse: AuthUserReturn = await loginUser(authField);
      const tokens = await getTokens(authField.email, authField.password);
      
      dispatch(
        setAuth({
          access: tokens.access,
          refresh: tokens.refresh,
          userId: userResponse._id,
          username: userResponse.username,
        })
      );
      localStorage.setItem('userId', userResponse._id.toString());
      toast.success('Успешный вход!');
      router.push('/music/main');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ошибка авторизации';
      toast.error(message);
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