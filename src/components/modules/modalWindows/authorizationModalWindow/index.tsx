import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import AuthorizationForm from "components/modules/forms/authorization"
import RegistrationForm from "components/modules/forms/registration"
import RecoveryForm from "components/modules/forms/recovery"
import React, { useState } from "react"
import utilStyles from "styles/utils.module.scss"
import cn from "classnames"

export interface AuthorizationModalWindowProps extends ModalWindowProps {
    onSuccess: () => void,
}

const AuthorizationModalWindow = ({
    onSuccess,
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
        >
            {mode === "auth" ?
                <AuthorizationForm
                    onSuccess={onSuccess}
                />
                :
                mode === "reg" ?
                    <RegistrationForm
                        onSuccess={onSuccess}
                    /> :
                    <>
                        <p className={cn(
                            utilStyles.modal_window_text,
                            utilStyles.modal_window_text_medium,
                        )}>Укажите Ваш логин ниже:</p>
                        <RecoveryForm />
                        <p className={cn(
                            utilStyles.modal_window_text,
                            utilStyles.modal_window_text_medium,
                        )}>
                            На почту, привязанную к нему,<br />
                            будет отправлено письмо<br />
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