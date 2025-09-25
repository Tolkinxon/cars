export const generateOtp = () => {
    const randomNumbers = Array.from({length: 6}, () => Math.ceil(Math.random() * 9)).join("");
    const otpTime = Date.now() + 180000;
    return {otp: randomNumbers, otpTime};
}