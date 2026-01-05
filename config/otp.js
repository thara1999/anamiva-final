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
   REDIS
========================= */
const client = redis.createClient({ url: REDIS_URL });

client.on("error", err => {
  console.error("Redis Error:", err.message);
});

(async () => {
  await client.connect();
  console.log("Redis connected");
})();

/* =========================
   TWILIO
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
  const saved = await client.get(`otp:${phone}`);
  if (saved === otp) {
    await client.del(`otp:${phone}`);
    return true;
  }
  return false;
};

const sendOTP = async phone => {
  const otp = generateOTP();
  await saveOTP(phone, otp);

  await twilioClient.messages.create({
    from: TWILIO_PHONE,
    to: phone,
    body: `Your MedApp OTP is ${otp}`
  });

  return otp;
};

module.exports = {
  sendOTP,
  verifyOTP
};
