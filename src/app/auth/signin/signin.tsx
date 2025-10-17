'use client'

import { authUser } from '@/services/auth/authApi';
import styles from './signin.module.css';
import classNames from 'classnames';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';
import { error } from 'console';

export default function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const onSubnit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setErrorMessage('');

        if (!email.trim() || !password.trim()) {
           return setErrorMessage('Заполните все поля');
        }
        setIsLoading(true);

        authUser({email, password})
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            if (error instanceof AxiosError) {
                    if (error.response) {
      // Запрос был сделан, и сервер ответил кодом состояния, который
      // выходит за пределы 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      setErrorMessage(error.response.data.message);
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      // `error.request`- это экземпляр XMLHttpRequest в браузере и экземпляр
      // http.ClientRequest в node.js
      console.log(error.request);
      setErrorMessage('Отсутствует интернет, попробуйте позже');
    } else {
      // Произошло что-то при настройке запроса, вызвавшее ошибку
      setErrorMessage('Неизвестная ошибка, попробуйте позже');
    }
            }
        })
        .finally(() => {
            setIsLoading(false);
        });
    }
    return (
        <>
        <a href="/music/main">
            <div className={styles.modal__logo}>
                <img src="/img/logo_modal.png" alt="logo" />
            </div>
        </a>
        <input
            className={classNames(styles.modal__input, styles.login)}
            type="text"
            name="login"
            placeholder="Почта"
            onChange={onChangeEmail}
        />
        <input
            className={classNames(styles.modal__input)}
            type="password"
            name="password"
            placeholder="Пароль"
            onChange={onChangePassword}
        />
        <div className={styles.errorContainer}>{errorMessage}</div>
        <button disabled={isLoading} onClick={onSubnit} className={styles.modal__btnEnter}>Войти</button>
        <Link href={'/auth/signup'} className={styles.modal__btnSignup}>
            Зарегистрироваться
        </Link>
            </>
    );
}