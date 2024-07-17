import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { START_QUESTIONNAIRE } from "./mutations";

export async function startQuestionnaire(
  client: ApolloClient<NormalizedCacheObject>,
  name: string,
  questionnaireName: string,
): Promise<string | null> {
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
