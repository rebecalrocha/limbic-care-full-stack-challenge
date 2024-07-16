import { Model } from "objection";
import Question from "./question";

class Questionnaire extends Model {
  static get tableName() {
    return "questionnaires";
  }

  static get relationMappings() {
    return {
      questions: {
        relation: Model.HasManyRelation,
        modelClass: Question,
        join: {
          from: "questionnaires.id",
          to: "questions.questionnaireId",
        },
      },
    };
  }

  id!: number;
  name!: string;
  introMessage!: string;
  questions?: Question[];
}

export default Questionnaire;
