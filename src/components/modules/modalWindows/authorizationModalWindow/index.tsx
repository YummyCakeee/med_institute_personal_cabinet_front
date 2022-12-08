import ModalWindow, { ModalWindowProps } from "components/elements/modalWindow/ModalWindow"
import AuthorizationForm from "components/modules/forms/authorization"
import RecoveryForm from "components/modules/forms/recovery"
import React, { useState } from "react"
import utilStyles from "styles/utils.module.scss"
import cn from "classNames"

export interface AuthorizationModalWindowProps extends ModalWindowProps {
    onSuccess: () => void,
}

const AuthorizationModalWindow = ({
    onSuccess,
}: AuthorizationModalWindowProps) => {

    const [mode, setMode] = useState<"auth" | "recovery">("auth")

    return (
        <ModalWindow
            isShowing
            backgroundOverlap
            title={mode === "auth" ?
                "Вход в аккаунт" :
                "Восстановление пароля"
            }
        >
            {mode === "auth" ?
                <AuthorizationForm
                    onSuccess={onSuccess}
                />
                :
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
            {mode === "auth" ?
                <p className={utilStyles.modal_window_text}>
                    Забыли пароль? <span onClick={() => setMode("recovery")}>Восстановить</span>
                </p> :
                <p className={utilStyles.modal_window_text}>
                    <span onClick={() => setMode("auth")}>Вернуться</span> ко входу в аккаунт
                </p>
            }
        </ModalWindow>
    )
}

export default AuthorizationModalWindow