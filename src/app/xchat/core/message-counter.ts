export class MessageCounter {
  static formatUnreadMessagesTotal(totalUnreadMessages) {
    if (totalUnreadMessages > 0) {
      if (totalUnreadMessages > 99)
        return "99+";
      else
        return String(totalUnreadMessages);
    }
    // Empty fallback.
    return "";
  }

  /**
   * Returns a formatted string containing the total unread messages of a chat window.
   * @param window The window instance to count the unread total messages.
   * @param currentUserId The current chat instance user id. In this context it would be the sender.
   */
  static unreadMessagesTotal(window, currentUserId) {
    let totalUnreadMessages = 0;
    if (window) {
      totalUnreadMessages = window.messages.filter(x => x.fromId != currentUserId && !x.dateSeen).length;
    }
    return MessageCounter.formatUnreadMessagesTotal(totalUnreadMessages);
  }
}
