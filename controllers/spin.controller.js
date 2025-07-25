const { Op, Sequelize } = require("sequelize");
const Voucher = require("../models/voucher.model");
const UserVoucher = require("../models/userVoucher.model");
const { sendNotification } = require("../utils/notify");

exports.spinWheel = async (req, res) => {
  try {
    const userId = req.user.userId;

    // ==== Format SQL datetime ====
    const pad = (n) => (n < 10 ? "0" + n : n);
    const toSqlDatetime = (date) =>
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
      )}`;

    const toSqlDayStart = (date) =>
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )} 00:00:00`;

    const formattedNow = toSqlDatetime(new Date());
    const todayStart = toSqlDayStart(new Date());

    // ==== Check if user already spun today ====
    const spunToday = await UserVoucher.findOne({
      where: Sequelize.literal(
        `[UserID] = ${userId} AND [AssignedAt] >= CAST('${todayStart}' AS DATETIME)`
      ),
    });

    if (spunToday) {
      return res.status(403).json({
        success: false,
        message: "You have already spun today. Please come back tomorrow.",
      });
    }

    // ==== 30% chance to win ====
    const chance = Math.random();
    if (chance > 0.3) {
      return res.status(200).json({
        success: true,
        message: "Not lucky this time. Try again tomorrow!",
        data: null,
      });
    }

    // ==== Find available voucher ====
    const voucher = await Voucher.findOne({
      where: Sequelize.literal(
        `[Quantity] > 0 AND [ExpiryDate] > CAST('${formattedNow}' AS DATETIME)`
      ),
    });

    if (!voucher) {
      return res.status(200).json({
        success: true,
        message: "All vouchers are claimed. Please try again later!",
        data: null,
      });
    }

    // ==== Assign voucher to user ====
    const userVoucher = await UserVoucher.create({
      user_id: userId,
      voucher_id: voucher.voucher_id,
      redeemed: false,
      assigned_at: Sequelize.literal(`CAST('${formattedNow}' AS DATETIME)`),
    });

    await voucher.update({ quantity: voucher.quantity - 1 });

    // ==== Send notification ====
    const msg = `🎁 Congratulations! You just won a voucher: ${
      voucher.code
    } – ${voucher.discount_percent}% off. Valid until: ${new Date(
      voucher.expiry_date
    ).toLocaleDateString("en-GB")}`;

    await sendNotification(userId, msg); 

    // ==== Response ====
    return res.status(200).json({
      success: true,
      message: "Congratulations! You won a voucher!",
      data: {
        voucher: voucher.toSafeObject?.() || voucher,
      },
    });
  } catch (error) {
    console.error("Spin error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
