import Knex from "knex";
import { Model } from "objection";

export default () => {
  const knexConfig = require("../../knexfile");
  const environment = process.env.NODE_ENV || "development";
  const configOptions = knexConfig[environment];
  const knex = Knex(configOptions);

  Model.knex(knex);

  return knex;
};
