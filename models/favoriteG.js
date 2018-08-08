module.exports = function(sequelize, DataTypes) {
    var favoriteG = sequelize.define("favoritsG", {
        userId:DataTypes.STRING,
        radioName:DataTypes.STRING,
        radioStream:DataTypes.TEXT,

    }, {
        timestamps: false
    });

    return favoriteG;
};
