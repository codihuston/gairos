import { join } from "path";
import glob from "glob";
import { sequelize } from "../../db";

const models = {};
const modelPaths = glob.sync(join(__dirname, "**/model.js"));

// import sequelize models
for (const modelPath of modelPaths) {
  const model = sequelize.import(modelPath);
  models[model.name] = model;
}

// associate the sequelize models (as needeD)
for (const modelName of Object.keys(models)) {
  const model = models[modelName];
  if (typeof model.associate === "function") {
    model.associate(models);
  }
}

export { models };
