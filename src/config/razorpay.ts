import Razorpay from "razorpay";

export const getRazorpayInstance = (): Razorpay => {
  const keyId = process.env.razorpay_key_id;
  const keySecret = process.env.razorpay_secret_id;
  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay key_id or key_secret is missing in environment variables."
    );
  }
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};
