module.exports = (sequelize, DataTypes) => {
	const alias = 'Picture';
  
	const cols = {
		picture_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		picture_url: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		picture_description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	};

  // const config = {
  //   tableName: 'pictures',
  //   timestamps: false,
  // };

	const Picture = sequelize.define(alias, cols);

	return Picture;
};