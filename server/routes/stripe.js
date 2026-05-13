const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const Reservation = require("../models/Reservation");
const { protect } = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/create-checkout-session",
  protect,
  express.json(),
  async (req, res) => {
    try {
      const {
        tourId,
        tourName,
        name,
        email,
        phone,
        country,
        region,
        dateFrom,
        dateTo,
        numberOfPeople,
        specialRequests,
        totalPrice,
      } = req.body;

      const userId = req.user.id;

      if (!tourId || !name || !email || !totalPrice) {
        return res
          .status(400)
          .json({
            error:
              "There are missing areas. (tourId, name, email or totalPrice)",
          });
      }

      const reservation = new Reservation({
        userId: userId,
        tourId,
        tourName,
        name,
        email,
        phone,
        country,
        region: region || "Region Not Specified.",
        dateFrom,
        dateTo,
        travelers: numberOfPeople,
        message: specialRequests,
        totalPrice,
        status: "pending",
        paymentStatus: "unpaid",
      });

      await reservation.save();

      try {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: "🎉 New Booking Request - Wanderlust",
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h2 style="color: #ff6b6b; margin-top: 0; border-bottom: 3px solid #ff6b6b; padding-bottom: 15px;">
                🎉 New Booking Request!
              </h2>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #333;">👤 Customer Details</h3>
                <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #ff6b6b;">${email}</a></p>
                <p style="margin: 8px 0;"><strong>Phone:</strong> ${
                  phone || "Not provided"
                }</p>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #333;">✈️ Booking Details</h3>
                <p style="margin: 8px 0;"><strong>Tour:</strong> ${tourName}</p>
                <p style="margin: 8px 0;"><strong>Destination:</strong> ${country}, ${region}</p>
                <p style="margin: 8px 0;"><strong>Travel Date:</strong> ${dateFrom} to ${dateTo}</p>
                <p style="margin: 8px 0;"><strong>Number of Travelers:</strong> ${numberOfPeople} ${
            numberOfPeople > 1 ? "people" : "person"
          }</p>
                <p style="margin: 8px 0; font-size: 20px;"><strong>Total Price:</strong> <span style="color: #ff6b6b; font-weight: bold;">$${totalPrice.toLocaleString()}</span></p>
              </div>
              
              ${
                specialRequests
                  ? `
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <h4 style="margin-top: 0; color: #856404;">📝 Special Requests:</h4>
                <p style="margin: 0; color: #856404;">${specialRequests}</p>
              </div>
              `
                  : ""
              }
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL}/admin" 
                  style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; 
                          font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                  View in Admin Panel →
                </a>
              </div>
              
              <p style="color: #6c757d; font-size: 12px; margin-top: 30px; text-align: center; border-top: 1px solid #dee2e6; padding-top: 20px;">
                This is an automated notification from Wanderlust booking system.<br>
                Reservation ID: ${reservation._id}
              </p>
            </div>
          </div>
        `,
        });
        console.log("Email sent to admin successfully");
      } catch (emailError) {
        console.error("Email send error:", emailError);
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${tourName} - Reservation`,
                description: `${numberOfPeople} Person | ${dateFrom}`,
              },
              unit_amount: Math.round(totalPrice * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/booking?canceled=true`,
        customer_email: email,
        metadata: {
          reservationId: reservation._id.toString(),
        },
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Checkout error:", error);
      res
        .status(500)
        .json({
          error: "The payment session could not be created.",
          details: error.message,
        });
    }
  }
);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const reservationId = session.metadata.reservationId;

      try {
        await Reservation.findByIdAndUpdate(reservationId, {
          paymentStatus: "paid",
          status: "confirmed",
          stripePaymentIntentId: session.payment_intent,
          paidAt: new Date(),
        });
        console.log(`Payment confirmed: ${reservationId}`);
      } catch (error) {
        console.error("Database update error:", error);
      }
    }

    res.json({ received: true });
  }
);

module.exports = router;
