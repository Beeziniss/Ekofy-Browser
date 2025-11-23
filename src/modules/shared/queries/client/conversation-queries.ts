import { graphql } from "@/gql";

export const ConversationQuery = graphql(`
  query Conversations($where: ConversationFilterInput) {
    conversations(where: $where, order: { lastMessage: { sentAt: DESC } }) {
      items {
        id
        userIds
        ownerProfileConversation {
          avatar
          nickname
        }
        otherProfileConversation {
          avatar
          nickname
        }
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
  query Messages($where: MessageFilterInput) {
    messages(where: $where, last: 10) {
      edges {
        cursor
        node {
          id
          conversationId
          senderId
          receiverId
          isRead
          text
          sentAt
          deletedForIds
          senderProfileMessages {
            avatar
            nickname
          }
        }
      }
      totalCount
    }
  }
`);
