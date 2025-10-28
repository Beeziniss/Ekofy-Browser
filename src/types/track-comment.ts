export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  replyCount: number;
  commenterId: string;
  commenter?: {
    fullName: string;
    listener?: {
      avatarImage: string;
      displayName: string;
    };
    artist?: {
      avatarImage: string;
      stageName: string;
    };
  };
}

export interface Reply {
  id: string;
  content: string;
  createdAt: string;
  commenterId: string;
  commenter?: {
    fullName: string;
    listener?: {
      avatarImage: string;
      displayName: string;
    };
    artist?: {
      avatarImage: string;
      stageName: string;
    };
  };
  replyCount?: number;
}

export interface Thread {
  rootComment: Comment;
  replies: Reply[];
  totalReplies: number;
}
