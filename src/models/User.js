const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const User = sequelize.define('user', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
    },

    country: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "No especify"
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    image: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fes%2Fvectors%2Ffoto-de-perfil-en-blanco-973460%2F&psig=AOvVaw0YI95w9hp0aPJC5mHVKMyK&ust=1684874954342000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCPDxy7vmif8CFQAAAAAdAAAAABAE"
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
});

User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
}

module.exports = User;