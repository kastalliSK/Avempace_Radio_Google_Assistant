// app/models/user.js
// load the things we need
module.exports = function(sequelize, DataTypes) {
    var country = sequelize.define("countries", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            unique: true
        },
        name: {type: DataTypes.STRING, allowNull: false,unique: true}
    }, {
        timestamps: true
    });

    return country;
};