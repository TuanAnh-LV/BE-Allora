const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model");

// Thêm sản phẩm vào wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    // Kiểm tra đã tồn tại chưa
    const existing = await Wishlist.findOne({
      where: { user_id: userId, product_id: productId },
      include: [{ model: Product, as: 'Product' }]
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Already in wishlist',
        data: formatWishlistItem(existing)
      });
    }

    // Tạo mới
    const createdItem = await Wishlist.create({
      user_id: userId,
      product_id: productId
    });

    // Truy vấn lại kèm Product
    const itemWithProduct = await Wishlist.findOne({
      where: { wishlist_id: createdItem.wishlist_id },
      include: [{ model: Product, as: 'Product' }]
    });

    return res.status(200).json({
      success: true,
      message: 'Added to wishlist',
      data: formatWishlistItem(itemWithProduct)
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách wishlist
exports.getWishlistByUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wishlist = await Wishlist.findAll({
      where: { user_id: userId },
      include: [{ model: Product, as: 'Product' }]
    });

    const result = wishlist.map(item => formatWishlistItem(item));

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa sản phẩm khỏi wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { productId } = req.params;

    const deleted = await Wishlist.destroy({
      where: { user_id: userId, product_id: productId }
    });

    res.status(200).json({
      success: true,
      message: deleted ? 'Removed from wishlist' : 'Item not found in wishlist'
    });
  } catch (error) {
    console.error('Remove wishlist error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getWishlistItemDetail = async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.productId;

    const item = await Wishlist.findOne({
      where: { user_id: userId, product_id: productId },
      include: [{ model: Product, as: 'Product' }]
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        wishlistId: item.wishlist_id,
        productId: item.product_id,
        createdAt: item.created_at,
        product: item.Product?.toSafeObject?.() || null
      }
    });

  } catch (error) {
    console.error('Get wishlist item detail error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Helper để định dạng dữ liệu trả về
function formatWishlistItem(item) {
  return {
    wishlistId: item.wishlist_id,
    productId: item.product_id,
    createdAt: item.created_at,
    product: item.Product ? {
      productId: item.Product.product_id,
      productName: item.Product.product_name,
      briefDescription: item.Product.brief_description,
      imageUrl: item.Product.image_url,
      price: item.Product.price
    } : null
  };
}
