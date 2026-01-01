const redis = require('redis');
const { REDIS_URL, OTP_EXPIRES_IN, OTP_LENGTH, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE } = require('./env');
const client = redis.createClient({ url: REDIS_URL });
const twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Connect Redis
client.connect().then(() => console.log('Redis connected')).catch(console.error);

// Generate OTP
const generateOTP = () => {
  let otp = '';
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

// Save OTP to Redis
const saveOTP = async (phone, otp) => {
  await client.setEx(`otp:${phone}`, OTP_EXPIRES_IN, otp);
};

// Verify OTP
const verifyOTP = async (phone, otp) => {
  const savedOTP = await client.get(`otp:${phone}`);
  return savedOTP === otp;
};

// Send OTP via Twilio
const sendOTP = async (phone) => {
  const otp = generateOTP();
  await saveOTP(phone, otp);
  await twilio.messages.create({
    from: TWILIO_PHONE,
    to: phone,
    body: `Your MedApp OTP is: ${otp}`,
  });
  return otp;
};

module.exports = { generateOTP, saveOTP, verifyOTP, sendOTP };
