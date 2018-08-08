// app/models/userG.js
// load the things we need
module.exports = function(sequelize, DataTypes) {
    var userG = sequelize.define("usersG", {
        userId:DataTypes.STRING,

    }, {
        timestamps: false
    });

    return userG;
};
