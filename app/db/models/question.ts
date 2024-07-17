import { Model } from "objection";
import Option from "./option";
import Questionnaire from "./questionnaire";

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
      questionnaire: {
        relation: Model.BelongsToOneRelation,
        modelClass: Questionnaire,
        join: {
          from: "questions.questionnaireId",
          to: "questionnaires.id",
        },
      },
    };
  }

  id!: number;
  questionnaireId!: number;
  label!: string;
  name!: string;
  options?: Option[];
}

export default Question;
