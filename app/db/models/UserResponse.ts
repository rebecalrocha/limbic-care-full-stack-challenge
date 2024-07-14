import { Model } from "objection";

class UserResponse extends Model {
  static get tableName() {
    return "user_responses";
  }

  id!: number;
  sessionId!: string;
  question!: number;
  answer!: string;
}

export default UserResponse;
