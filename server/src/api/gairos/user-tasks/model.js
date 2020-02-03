import moment from "moment";

const model = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    "userTask",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID
      },
      taskId: {
        type: DataTypes.UUID
      },
      description: {
        type: DataTypes.STRING
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      eventColorId: {
        type: DataTypes.STRING,
        defaultValue: "1",
        allowNull: false
      }
    },
    {
      paranoid: true,
      indexes: [
        {
          unique: false,
          fields: ["userId", "taskId"]
        }
      ],
      defaultScope: {
        where: {
          deletedAt: null
        }
      }
    }
  );

  Model.associate = models => {
    models.userTask.hasOne(models.userTaskTag, {
      foreignKey: "userTaskId"
    });
    models.userTask.belongsTo(models.task, {
      foreignKey: "taskId"
    });
    models.userTask.hasMany(models.userTaskHistory, {
      foreignKey: "userTaskId",
      as: "taskHistory",
      onDelete: "CASCADE"
    });
  };

  /**
   * Format the task name (to be applied to the google event) if needed
   */
  Model.prototype.getEventName = function(startTime, endTime) {
    let task = this.task;
    // if this.task is not set, get it
    if (!task && !task.name) {
      task = this.getTask();

      // if no task was loaded, then there is no task associated
      if (!task) {
        return null;
      }

      // set ref on this instance
      this.task = task;
    }

    // append the total time spent
    const a = moment(startTime);
    const b = moment(endTime);
    return `${task.name} - ${b.diff(a, "minutes", true)} mins`;
  };

  Model.prototype.getEventDescription = function() {
    // TODO: maybe append all associated "TAGS" to this description?

    return this.description;
  };

  return Model;
};
export default model;
