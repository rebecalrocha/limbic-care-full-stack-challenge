import { Model } from "objection";
import QuestionnaireResponse from "./questionnaireResponse";
import Question from "./question";

class Response extends Model {
  static get tableName() {
    return "responses";
  }

  static get relationMappings() {
    return {
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: "responses.questionId",
          to: "questions.id",
        },
      },
    };
  }

  id!: number;
  questionId!: number;
  value!: number;
}

export default Response;
