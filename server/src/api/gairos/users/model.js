const model = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    googleId: {
      type: DataTypes.STRING,
      nullable: false
    },
    username: {
      type: DataTypes.STRING,
      nullable: false
    },
    displayNameLastFirst: {
      type: DataTypes.STRING,
      nullable: true
    },
    email: {
      type: DataTypes.STRING,
      nullable: false
    },
    isFirstSetupCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    calendarId: {
      type: DataTypes.STRING,
      defaultValue: null,
      nullable: true
    },
    calendarHexColorCode: {
      type: DataTypes.STRING,
      defaultValue: "#5B89C9",
      nullable: true
    }
  });

  User.associate = models => {
    models.user.hasMany(models.message, { onDelete: "CASCADE" });

    models.user.belongsToMany(models.task, {
      through: models.userTask,
      foreignKey: "userId",
      unique: false
    });
    models.user.belongsToMany(models.tag, {
      through: models.userTag,
      foreignKey: "userId"
    });
  };

  /**
   * Class Methods
   */

  User.findByLogin = async login => {
    let user = await User.findOne({
      where: { username: login }
    });
    if (!user) {
      // user = await User.findOne({
      //   where: { email: login }
      // });
    }
    return user;
  };

  User.validateGoogleProfile = profile => {
    if (
      !profile ||
      !profile.resourceName ||
      !profile.names ||
      !profile.emailAddresses
    ) {
      throw new Error(
        "Invalid Google Profile Data, please contact a developer with this code: uvacux"
      );
    }

    return true;
  };

  User.createFromGoogleProfile = async profile => {
    if (User.validateGoogleProfile(profile)) {
      const resourceName = profile.resourceName || null;
      const { names } = profile;
      const { emailAddresses } = profile;
      let displayName,
        displayNameLastFirst,
        emailAddress = null;

      // extract usernames from google profile
      if (names && names[0]) {
        let name = names[0] || {};
        displayName = name.displayName || null;
        displayNameLastFirst = name.displayNameLastFirst;
      }

      // extract first email from google profile
      if (emailAddresses && emailAddresses[0]) {
        let email = emailAddresses[0] || {};
        emailAddress = email.value;
      }

      // the values to save
      const defaults = {
        googleId: resourceName,
        email: emailAddress,
        username: displayName,
        displayNameLastFirst
      };

      // find or create the user
      const [user, wasCreated] = await User.findOrCreate({
        where: {
          googleId: resourceName
        },
        defaults
      });

      // update fields from google (if any have changed)
      await user.set(defaults).save();

      return user;
    }
  };

  User.findByGoogleId = async googleId => {
    let user = await User.findOne({
      where: {
        googleId
      }
    });
    return user;
  };
  return User;
};
export default model;
