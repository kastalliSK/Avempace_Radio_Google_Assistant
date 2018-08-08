// app/models/user.js
// load the things we need
module.exports = function(sequelize, DataTypes) {
    var radio = sequelize.define("radios", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            unique: true
        },
        name: DataTypes.STRING,
        countryId: DataTypes.INTEGER,
        genreId: DataTypes.INTEGER,
        stream: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        radio_type: DataTypes.STRING,
        image: DataTypes.TEXT,
        web_site: DataTypes.TEXT,
        description: DataTypes.TEXT
    }, {
        timestamps: true
    });

    return radio;
};