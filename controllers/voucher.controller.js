const { Sequelize } = require('sequelize');
const Voucher = require('../models/voucher.model');
const UserVoucher = require('../models/userVoucher.model');
// [GET] All vouchers
exports.getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.findAll();
    res.status(200).json(vouchers.map(v => v.toSafeObject()));
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCurrentUserVouchers = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userVouchers = await UserVoucher.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Voucher,
          as: 'Voucher'
        }
      ],
      order: [['assigned_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      vouchers: userVouchers.map(uv => uv.toSafeObject())
    });
  } catch (err) {
    console.error('Error fetching user vouchers:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// [GET] Voucher by ID
exports.getVoucherById = async (req, res) => {
  try {
    const id = req.params.id;
    const voucher = await Voucher.findByPk(id);
    if (!voucher) return res.status(404).json({ success: false, message: 'Voucher not found' });

    res.status(200).json(voucher.toSafeObject());
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createVoucher = async (req, res) => {
  try {
    const { code, discountPercent, expiryDate, quantity } = req.body;

    const pad = (n) => (n < 10 ? '0' + n : n);
    const toSqlDatetime = (date) =>
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

    const formattedDate = toSqlDatetime(new Date(expiryDate));
    const now = toSqlDatetime(new Date());

    const newVoucher = await Voucher.create({
      code,
      discount_percent: discountPercent,
      expiry_date: Sequelize.literal(`CAST('${formattedDate}' AS DATETIME)`),
      quantity,
      created_at: Sequelize.literal(`CAST('${now}' AS DATETIME)`)
    });

    res.status(201).json({
      success: true,
      message: 'Voucher created',
      data: newVoucher.toSafeObject()
    });
  } catch (err) {
    console.error('Voucher creation error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// [PUT] Update voucher – có thể cần ép ngày tương tự nếu lỗi tiếp diễn
exports.updateVoucher = async (req, res) => {
  try {
    const id = req.params.id;
    const { code, discountPercent, expiryDate, quantity } = req.body;

    const voucher = await Voucher.findByPk(id);
    if (!voucher) return res.status(404).json({ success: false, message: 'Voucher not found' });

    const pad = (n) => (n < 10 ? '0' + n : n);
    const toSqlDatetime = (date) =>
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    const formattedDate = toSqlDatetime(new Date(expiryDate));

    await voucher.update({
      code,
      discount_percent: discountPercent,
      expiry_date: Sequelize.literal(`CAST('${formattedDate}' AS DATETIME)`),
      quantity
    });

    res.status(200).json({
      success: true,
      message: 'Voucher updated',
      data: voucher.toSafeObject()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// [DELETE] Delete voucher
exports.deleteVoucher = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Voucher.destroy({ where: { voucher_id: id } });

    res.status(200).json({
      success: true,
      message: deleted ? 'Voucher deleted' : 'Voucher not found'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
