import { Model } from "objection";
import QuestionnaireResponse from "./questionnaireResponse";

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get relationMappings() {
    return {
      questionnaireResponses: {
        relation: Model.HasManyRelation,
        modelClass: QuestionnaireResponse,
        join: {
          from: "users.id",
          to: "questionnaire_responses.userId",
        },
      },
    };
  }

  id!: number;
  name!: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  email?: string;
  consentToPush?: boolean;
  consentToEmail?: boolean;
  consentToCall?: boolean;
}

export default User;
