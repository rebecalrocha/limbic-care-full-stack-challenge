import { Model } from "objection";
import Option from "./option";

class Question extends Model {
  static get tableName() {
    return "questions";
  }

  static get relationMappings() {
    return {
      options: {
        relation: Model.HasManyRelation,
        modelClass: Option,
        join: {
          from: "questions.id",
          to: "options.questionId",
        },
      },
    };
  }

  id!: number;
  text!: string;
  order!: number;
  options?: Option[];
}

export default Question;
