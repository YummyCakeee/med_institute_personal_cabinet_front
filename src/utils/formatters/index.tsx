export const convertSecondsToFullTime = (seconds: number) => {
    if (seconds === 0) return "00:00:00"
    const fullTimeHours = Math.floor(seconds / 3600).toString()
    const fullTimeMinutes = (Math.floor(seconds / 60) % 60).toString().padStart(2, "0")
    const fullTimeSeconds = (seconds % 60).toString().padStart(2, "0")
    return `${fullTimeHours}:${fullTimeMinutes}:${fullTimeSeconds}`
}

export const toBase64 = (file: File) => new Promise<string | null | ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});