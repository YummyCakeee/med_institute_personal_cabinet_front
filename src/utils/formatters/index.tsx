export const convertSecondsToFullTime = (seconds: number) => {
    if (seconds === 0) return "00:00:00"
    const fullTimeHours = Math.floor(seconds / 3600).toString()
    const fullTimeMinutes = (Math.floor(seconds / 60) % 60).toString().padStart(2, "0")
    const fullTimeSeconds = (seconds % 60).toString().padStart(2, "0")
    return `${fullTimeHours}:${fullTimeMinutes}:${fullTimeSeconds}`
}