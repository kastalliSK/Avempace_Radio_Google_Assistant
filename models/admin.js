module.exports = function(sequelize, DataTypes) {
    var admin = sequelize.define("admins", {
        admin_name: DataTypes.STRING,
        admin_password: DataTypes.STRING,
        user_position: DataTypes.STRING,
        last_login: DataTypes.DATE,
        last_connection: DataTypes.DATE,
        role: {
            type: DataTypes.STRING,
            defaultValue: 'admin'
        }


    }, { timestamps: false });

    return admin;
};