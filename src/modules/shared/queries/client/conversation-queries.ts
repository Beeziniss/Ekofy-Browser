import { graphql } from "@/gql";

export const ConversationQuery = graphql(`
  query Conversations($where: ConversationFilterInput) {
    conversations(where: $where) {
      items {
        id
        userIds
        lastMessage {
          text
          senderId
          sentAt
          isReadBy
        }
      }
      totalCount
    }
  }
`);

export const ConversationMessagesQuery = graphql(`
  query Messages {
    messages {
      items {
        id
        conversationId
        senderId
        receiverId
        isRead
        text
        sentAt
      }
      totalCount
    }
  }
`);
