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
  mutation StartQuestionnaire($name: String!, $questionnaireName: String!) {
    startQuestionnaire(name: $name, questionnaireName: $questionnaireName) {
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

export const UPDATE_USER_INFO = gql`
  mutation UpdateUserInfo($userId: Int!, $userInfo: User!) {
    updateUserInfo(userId: $userId, userInfo: $userInfo) {
      userId
    }
  }
`;
