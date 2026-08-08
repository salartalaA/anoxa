export interface OpenChat {
  currentUserId: string;
  otherUserId: string;
}

export interface NewMessage {
  conversationId: string;
  createdAt: Date;
  receiverId: string;
  senderId: string;
  text: string;
}
