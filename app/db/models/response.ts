import { Model } from "objection";
import User from "./user";
import Question from "./question";

class Response extends Model {
  static get tableName() {
    return "responses";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "responses.userId",
          to: "users.id",
        },
      },
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
  userId!: number;
  questionId!: number;
  responseValue!: string;
  createdAt!: string;
}

export default Response;
