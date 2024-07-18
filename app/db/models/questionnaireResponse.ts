import { Model } from "objection";
import User from "./user";
import Questionnaire from "./questionnaire";
import Response from "./response";

class QuestionnaireResponse extends Model {
  static get tableName() {
    return "questionnaire_responses";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "questionnaire_responses.userId",
          to: "users.id",
        },
      },
      questionnaire: {
        relation: Model.BelongsToOneRelation,
        modelClass: Questionnaire,
        join: {
          from: "questionnaire_responses.questionnaireId",
          to: "questionnaires.id",
        },
      },
    };
  }

  id!: number;
  userId!: number;
  questionnaireId!: number;
  totalValue!: number;
  createdAt!: string;
}

export default QuestionnaireResponse;
