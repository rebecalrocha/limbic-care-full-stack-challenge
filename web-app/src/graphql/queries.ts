import { gql } from "@apollo/client";

export const GET_QUESTIONNAIRE = gql`
  query Questionnaire($name: String!) {
    getQuestionnaire(name: $name) {
      id
      name
      introMessage
      questions {
        id
        label
        options {
          label
          value
        }
      }
    }
  }
`;
