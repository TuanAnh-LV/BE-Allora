const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const sequelize = require('./config/db');
const app = express();


app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Welcome to SalesApp API!');
});
sequelize.authenticate()
  .then(() => console.log(' Kết nối SQL Server thành công!'))
  .catch(err => console.error(' Không thể kết nối SQL Server:', err));


app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);
// const productRoutes = require('./routes/product.routes');
// app.use('/api/products', productRoutes);
// const orderRoutes = require('./routes/order.routes');   
// app.use('/api/orders', orderRoutes);
// const categoryRoutes = require('./routes/category.routes');
// app.use('/api/categories', categoryRoutes);
// const cartRoutes = require('./routes/cart.routes');
// app.use('/api/carts', cartRoutes);
// const reviewRoutes = require('./routes/review.routes');
// app.use('/api/reviews', reviewRoutes);
// const paymentRoutes = require('./routes/payment.routes');
// app.use('/api/payments', paymentRoutes);
// const notificationRoutes = require('./routes/notification.routes');
// app.use('/api/notifications', notificationRoutes);
// const chatRoutes = require('./routes/chat.routes');
// app.use('/api/chat', chatRoutes);
// const storeLocationRoutes = require('./routes/storelocation.routes');
// app.use('/api/storelocations', storeLocationRoutes);
// const roleRoutes = require('./routes/role.routes');
// app.use('/api/roles', roleRoutes);

module.exports = app;
