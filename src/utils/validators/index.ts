export const notEmptyValidator = (value: string) => {
    if (!value || value.length === 0) return "Поле не может быть пустым"
}

export const minLengthValueValidator = (value: string, length: number) => {
    if (value && value.length < length) {
        return `Длина должна быть больше ${length - 1}`
    }
}

export const maxLengthValueValidator = (value: string, length: number) => {
    if (value && value.length > length) {
        return `Длина должна быть меньше ${length + 1}`
    }
}

export const composeValidators = (value: string, ...validators: ((value: string) => string | undefined)[]) => {
    for (let i = 0; i < validators.length; i++) {
        const error = validators[i](value)
        if (error !== undefined)
            return error
    }
}