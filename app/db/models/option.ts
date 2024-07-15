import { Model } from "objection";
import Question from "./question";

class Option extends Model {
  static get tableName() {
    return "options";
  }

  static get relationMappings() {
    return {
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: "options.questionId",
          to: "questions.id",
        },
      },
    };
  }

  id!: number;
  questionId!: number;
  label!: string;
  value?: number;
}

export default Option;
