// Function to generate elegant OTP email HTML
export default function getDesignEmail({ otp, userName = "there", companyName = "Crystal Beauty Clear", validityMinutes = 10 }) {
  return `
  <div style="background-color:#FFF5F2; padding:30px; font-family: Arial, sans-serif;">
    <div style="
      max-width:500px;
      margin:auto;
      background-color:#ffffff;
      border-radius:12px;
      border:1px solid #C1856D;
      box-shadow:0 8px 20px rgba(0,0,0,0.08);
      overflow:hidden;
    ">
      
      <!-- Header -->
      <div style="
        background-color:#9A3F3F;
        padding:20px;
        text-align:center;
        color:#ffffff;
      ">
        <h2 style="margin:0;">${companyName}</h2>
        <p style="margin:5px 0 0; font-size:14px;">
          Secure Password Reset
        </p>
      </div>

      <!-- Body -->
      <div style="padding:30px; color:#212121;">
        <p style="font-size:16px;">Hi ${userName} 👋</p>

        <p style="font-size:15px; line-height:1.6;">
          We received a request to reset your password.  
          Please use the one-time passcode below to continue.
        </p>

        <!-- OTP Box -->
        <div style="margin:25px 0; text-align:center;">
          <span style="
            display:inline-block;
            padding:15px 30px;
            font-size:24px;
            font-weight:bold;
            letter-spacing:4px;
            color:#9A3F3F;
            background-color:#FFF5F2;
            border:2px dashed #FD4E63;
            border-radius:10px;
          ">
            ${otp}
          </span>
        </div>

        <p style="font-size:14px; color:#555;">
          ⏰ This code is valid for <strong>${validityMinutes} minutes</strong>.
        </p>

        <p style="font-size:14px; color:#555;">
          If you didn’t request a password reset, you can safely ignore this email.
        </p>

        <hr style="border:none; border-top:1px solid #C1856D; margin:25px 0;">

        <p style="font-size:13px; color:#777;">
          Thank you for choosing <strong>${companyName}</strong>.  
          We’re always here to help you shine ✨
        </p>
      </div>

      <!-- Footer -->
      <div style="
        background-color:#FFF5F2;
        padding:15px;
        text-align:center;
        font-size:12px;
        color:#777;
      ">
        © ${new Date().getFullYear()} ${companyName}. All rights reserved.
      </div>

    </div>
  </div>
  `;
}


