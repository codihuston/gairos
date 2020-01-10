import Sequelize from "sequelize";
import { join } from "path";
import glob from "glob";

const models = {};
const modelPaths = glob.sync(join(__dirname, "**/model.js"));
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres"
  }
);

// import sequelize models
for (const modelPath of modelPaths) {
  const model = sequelize.import(modelPath);
  models[model.name] = model;
  console.log("Loaded model", model, models);
}

// associate the sequelize models (as needeD)
for (const modelName of Object.keys(models)) {
  const model = models[modelName];
  if (typeof model.associate === "function") {
    model.associate(models);
  }
}

export { sequelize, models };
