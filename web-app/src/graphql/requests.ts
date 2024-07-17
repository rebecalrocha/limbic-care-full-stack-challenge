import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  RESTART_QUESTIONNAIRE,
  START_QUESTIONNAIRE,
  SUBMIT_ANSWER,
  UPDATE_USER_INFO,
} from "./mutations";
import { GET_QUESTIONNAIRE } from "./queries";

type User = {
  phoneNumber?: String;
  dateOfBirth?: String;
  email?: String;
  consentToPush?: Boolean;
  consentToEmail?: Boolean;
  consentToCall?: Boolean;
};

export async function startQuestionnaire(
  client: ApolloClient<NormalizedCacheObject>,
  name: string,
  questionnaireName: string,
) {
  try {
    const { data } = await client.mutate({
      mutation: START_QUESTIONNAIRE,
      variables: { name, questionnaireName },
    });

    if (data && data.startQuestionnaire) {
      return data.startQuestionnaire.userId;
    }
  } catch (error) {
    console.error("Error starting questionnaire:", error);
  }
  return null;
}

export async function fetchQuestionnaire(
  client: ApolloClient<NormalizedCacheObject>,
  name: string,
) {
  try {
    const { data } = await client.query({
      query: GET_QUESTIONNAIRE,
      variables: { name },
    });

    return data.getQuestionnaire;
  } catch (error) {
    console.error("Error fetching questionnaire:", error);
    throw new Error("Failed to fetch questionnaire");
  }
}

export async function submitAnswer(
  client: ApolloClient<NormalizedCacheObject>,
  questionnaireResponseId: number,
  questionId: number,
  value: number,
) {
  try {
    const { data } = await client.mutate({
      mutation: SUBMIT_ANSWER,
      variables: { questionnaireResponseId, questionId, value },
    });

    if (data && data.submitAnswer) {
      return data.submitAnswer;
    }
  } catch (error) {
    console.error("Error submitting answer:", error);
  }
  return null;
}

export async function updateUserInfo(
  client: ApolloClient<NormalizedCacheObject>,
  userId: number,
  userInfo: User,
) {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_USER_INFO,
      variables: { userId, userInfo },
    });

    if (data && data.updateUserInfo) {
      return data.updateUserInfo.userId;
    }
  } catch (error) {
    console.error("Error updating user info:", error);
  }
  return null;
}

export async function restartQuestionnaire(
  client: ApolloClient<NormalizedCacheObject>,
  userId: number,
  questionnaireId: number,
) {
  try {
    const { data } = await client.mutate({
      mutation: RESTART_QUESTIONNAIRE,
      variables: { userId, questionnaireId },
    });

    if (data && data.resetQuestionnaire) {
      return data.resetQuestionnaire.userId;
    }
  } catch (error) {
    console.error("Error restarting questionnaire:", error);
  }
  return null;
}
