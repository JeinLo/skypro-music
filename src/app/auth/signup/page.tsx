'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './signup.module.css';
import classNames from 'classnames';
import { useState } from 'react';
import { createUser, getTokens } from '@/services/auth/authApi';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/store';
import { setAuth } from '@/store/features/authSlice';

export default function SignUpPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [dataField, setDataField] = useState({
    email: '',
    username: '',
    password: '',
    newpassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onChangeDataField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataField({ ...dataField, [name]: value });
  };

  const onSubmitUserData = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (
      !dataField.email.trim() ||
      !dataField.username.trim() ||
      !dataField.password.trim() ||
      !dataField.newpassword.trim()
    ) {
      setErrorMessage('Заполните все поля');
      return;
    }

    if (dataField.password !== dataField.newpassword) {
      setErrorMessage('Пароли не совпадают. Повторите ввод');
      return;
    }

    const { newpassword, ...dataToSend } = dataField;

    setIsLoading(true);
    try {
      const userResponse = await createUser(dataToSend);
      const tokens = await getTokens(dataToSend);
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
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorResponseData = error.response.data;
          if (errorResponseData.errors) {
            const errors = errorResponseData.errors;
            if (errors.email) {
              setErrorMessage(errors.email.join(' '));
            } else if (errors.username) {
              setErrorMessage(errors.username.join(' '));
            } else if (errors.password) {
              setErrorMessage(errors.password.join(' '));
            } else {
              setErrorMessage(errorResponseData.message || 'Ошибка регистрации');
            }
          } else {
            setErrorMessage(errorResponseData.message || 'Ошибка регистрации');
          }
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
        value={dataField.email}
        placeholder="Почта"
        autoComplete="email"
        onChange={onChangeDataField}
        disabled={isLoading}
      />
      <input
        className={classNames(styles.modal__input, styles.login)}
        type="text"
        name="username"
        value={dataField.username}
        placeholder="Имя пользователя"
        autoComplete="username"
        onChange={onChangeDataField}
        disabled={isLoading}
      />
      <input
        className={styles.modal__input}
        type="password"
        name="password"
        value={dataField.password}
        placeholder="Пароль"
        autoComplete="new-password"
        onChange={onChangeDataField}
        disabled={isLoading}
      />
      <input
        className={styles.modal__input}
        type="password"
        name="newpassword"
        value={dataField.newpassword}
        placeholder="Повторите пароль"
        autoComplete="new-password"
        onChange={onChangeDataField}
        disabled={isLoading}
      />
      <div className={styles.errorContainer}>{errorMessage}</div>
      <button
        className={classNames(styles.modal__btnSignupEnt, {
          [styles.loading__btn]: isLoading,
        })}
        onClick={onSubmitUserData}
        disabled={isLoading}
      >
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
    </>
  );
}