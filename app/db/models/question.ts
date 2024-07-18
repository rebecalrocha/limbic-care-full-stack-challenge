import { Model } from "objection";
import Option from "./option";
import Response from "./response";
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
      responses: {
        relation: Model.HasManyRelation,
        modelClass: Response,
        join: {
          from: "questions.id",
          to: "responses.questionId",
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
  responses?: Response[];
}

export default Question;
