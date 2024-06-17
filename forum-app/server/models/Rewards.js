module.exports = (sequelize, DataTypes) => {
    const Rewards = sequelize.define("Rewards", {
        reward_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        reward_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        reward_description: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        reward_points: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reward_expiry_date: {
            type: DataTypes.DATE,
            allowNull: false
        },

    }, {
        tableName: 'rewards'
    });

    return Rewards;
}