import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import AuthorizationForm from "components/modules/forms/authorization"
import RegistrationForm from "components/modules/forms/registration"
import React, { useState } from "react"
import utilStyles from "styles/utils.module.scss"
import cn from "classnames"
import styles from "./AuthorizationModalWindow.module.scss"
import ForgotPasswordForm from "components/modules/forms/forgotPassword"

export interface AuthorizationModalWindowProps extends ModalWindowProps {
    onRegistrationSuccess: () => void,
    onAuthorizationSuccess: () => void,
    onForgotPasswordSuccess: () => void,
    onRegistrationError: (error: any) => void,
    onAuthorizationError: (error: any) => void,
    onForgotPasswordError: (error: any) => void
}

const AuthorizationModalWindow = ({
    onRegistrationSuccess,
    onAuthorizationSuccess,
    onRegistrationError,
    onAuthorizationError,
    onForgotPasswordSuccess,
    onForgotPasswordError
}: AuthorizationModalWindowProps) => {

    const [mode, setMode] = useState<"auth" | "reg" | "recovery">("auth")

    return (
        <ModalWindow
            backgroundOverlap
            title={mode === "auth" ?
                "Вход в аккаунт" :
                mode === "reg" ?
                    "Регистрация" :
                    "Восстановление пароля"
            }
            className={styles.container}
            onOpenAnimation={false}
        >
            {mode === "auth" ?
                <AuthorizationForm
                    onSuccess={onAuthorizationSuccess}
                    onError={onAuthorizationError}
                />
                :
                mode === "reg" ?
                    <RegistrationForm
                        onSuccess={onRegistrationSuccess}
                        onError={onRegistrationError}
                    /> :
                    <>
                        <p className={cn(
                            utilStyles.modal_window_text,
                            utilStyles.modal_window_text_medium,
                        )}>Укажите Вашу почту от аккаунта:</p>
                        <ForgotPasswordForm 
                            onSuccess={onForgotPasswordSuccess}
                            onError={onForgotPasswordError}
                        />
                        <p className={cn(
                            utilStyles.modal_window_text,
                            utilStyles.modal_window_text_medium,
                        )}>
                            На неё будет отправлено письмо<br />
                            c дальнейшими инструкциями<br />
                            по восстановлению пароля
                        </p>
                    </>
            }
            {mode === "auth" &&
                <>
                    <p className={utilStyles.modal_window_text}>
                        Забыли пароль? <span onClick={() => setMode("recovery")}>Восстановить</span>
                    </p>
                    <p className={utilStyles.modal_window_text}>
                        <span onClick={() => setMode("reg")}>Зарегистрироваться</span>
                    </p>
                </>
            }
            {mode === "reg" &&
                <p className={utilStyles.modal_window_text}>
                    <span onClick={() => setMode("auth")}>Войти в существующий аккаунт</span>
                </p>
            }
            {mode === "recovery" &&
                <p className={utilStyles.modal_window_text}>
                    <span onClick={() => setMode("auth")}>Вернуться</span> ко входу в аккаунт
                </p>
            }
        </ModalWindow>
    )
}

export default AuthorizationModalWindow