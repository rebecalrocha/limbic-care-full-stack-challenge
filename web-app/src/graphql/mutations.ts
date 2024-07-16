// graphql/mutations.ts
import { gql } from "@apollo/client";

export interface StartQuestionnaireResponse {
  startQuestionnaire: {
    userId: number;
    questionnaireResponseId: number;
  };
}

export interface SubmitAnswerResponse {
  submitAnswer: {
    questionId: number;
    value: number;
  };
}

export const START_QUESTIONNAIRE = gql`
  mutation StartQuestionnaire($name: String!, $questionnaireId: Int!) {
    startQuestionnaire(name: $name, questionnaireId: $questionnaireId) {
      userId
      questionnaireResponseId
    }
  }
`;

export const SUBMIT_ANSWER = gql`
  mutation SubmitAnswer(
    $questionnaireResponseId: Int!
    $questionId: Int!
    $value: Int!
  ) {
    submitAnswer(
      questionnaireResponseId: $questionnaireResponseId
      questionId: $questionId
      value: $value
    ) {
      questionId
      value
    }
  }
`;
