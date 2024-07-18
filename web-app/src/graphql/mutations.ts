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
  mutation SubmitAnswer($userId: Int!, $questionId: Int!, $value: Int!) {
    submitAnswer(userId: $userId, questionId: $questionId, value: $value) {
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

export const RESTART_QUESTIONNAIRE = gql`
  mutation RestartQuestionnaire($userId: Int!, $questionnaireId: Int!) {
    resetQuestionnaire(userId: $userId, questionnaireId: $questionnaireId) {
      userId
    }
  }
`;
