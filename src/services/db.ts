import { Sequelize } from "sequelize";
import config from "config";
export const db: Sequelize = new Sequelize(config.get("db.schema"), config.get("db.username"), config.get("db.password"), {
  host: config.get("db.host"),
  dialect: config.get("db.dialect"),
});
