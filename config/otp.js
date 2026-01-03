const redis = require("redis");
const twilio = require("twilio");
const {
  REDIS_URL,
  OTP_EXPIRES_IN,
  OTP_LENGTH,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE
} = require("./env");

/* =========================
   REDIS CLIENT
========================= */
const client = redis.createClient({
  url: REDIS_URL
});

client.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

(async () => {
  try {
    await client.connect();
    console.log("✅ Redis connected");
  } catch (err) {
    console.error("⚠️ Redis not connected, OTP will fail");
  }
})();

/* =========================
   TWILIO CLIENT
========================= */
const twilioClient = twilio(
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN
);

/* =========================
   OTP HELPERS
========================= */
const generateOTP = () => {
  let otp = "";
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

const saveOTP = async (phone, otp) => {
  await client.setEx(`otp:${phone}`, OTP_EXPIRES_IN, otp);
};

const verifyOTP = async (phone, otp) => {
  const savedOTP = await client.get(`otp:${phone}`);
  return savedOTP === otp;
};

const sendOTP = async (phone) => {
  const otp = generateOTP();

  await saveOTP(phone, otp);

  await twilioClient.messages.create({
    to: phone,
    from: TWILIO_PHONE, // ✅ FIXED
    body: `Your MedApp OTP is ${otp}`
  });

  return otp;
};

module.exports = {
  generateOTP,
  saveOTP,
  verifyOTP,
  sendOTP
};
