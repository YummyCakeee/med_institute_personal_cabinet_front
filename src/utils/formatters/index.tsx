export const convertSecondsToFullTime = (seconds: number) => {
    if (seconds === 0) return "00:00:00"
    const fullTimeHours = Math.floor(seconds / 3600).toString()
    const fullTimeMinutes = (Math.floor(seconds / 60) % 60).toString().padStart(2, "0")
    const fullTimeSeconds = (seconds % 60).toString().padStart(2, "0")
    return `${fullTimeHours}:${fullTimeMinutes}:${fullTimeSeconds}`
}

export const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
})

export const toISOStringWithTimeZone = (date: string) => {
    var tzoffset = (new Date(date)).getTimezoneOffset() * 60000
    return (new Date(new Date(date).getTime() - tzoffset)).toISOString().slice(0, -1)
}

export const numberFormatter = (value: string) => {
    console.log(value)
    const clearedValue = value.replace(/[^\d]/g, '')
    return clearedValue.length ? clearedValue : "0"
}