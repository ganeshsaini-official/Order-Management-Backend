import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';  

const Order = sequelize.define('Order', {
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Customers',
            key: 'id'
        }
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('placed', 'cancelled'),
        defaultValue: 'placed'
    }
}, {
    timestamps: true
});

export default Order;