import { gql } from "@apollo/client";

export const GETLANGUAGES = gql`
  query GetLanguages {
    GetAllLanguages {
      id
      translations {
        id
        name
        languageCode
      }
    }
  }
`;

export const GETVOICESBYLANGUAGE = gql`
query GetVoice($languageId: String!) {
    GetVoicesByLanguage(languageId: $languageId) {
      id
      service {
        name
      }
      price {
        price
      }
      gender
      translations {
        name
        languageCode
        description
      }
      audio {
        url
      }
      picture {
        url
      }
      voiceType {
        name
      }
    }
  }
`;