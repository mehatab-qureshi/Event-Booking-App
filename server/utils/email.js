const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        await resend.emails.send({
            from: 'Eventify <onboarding@resend.dev>',
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,
            html: `
                <h2>Hi ${userName}!</h2>
                <p>Your booking for <strong>${eventTitle}</strong> is confirmed.</p>
                <p>Thank you for choosing Eventify.</p>
            `
        });
        console.log('Email sent to', userEmail);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        const title = type === 'account_verification' 
            ? 'Verify your Eventify Account' 
            : 'Eventify Booking Verification';
        const msg = type === 'account_verification'
            ? 'Please use the following OTP to verify your new Eventify account.'
            : 'Please use the following OTP to verify and confirm your event booking.';

        await resend.emails.send({
            from: 'Eventify <onboarding@resend.dev>',
            to: userEmail,
            subject: title,
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${title}</h2>
                    <p style="color: #555; font-size: 16px;">${msg}</p>
                    <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 12px;">This code expires in 5 minutes.</p>
                </div>
            `
        });
        console.log(`OTP sent to ${userEmail}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };