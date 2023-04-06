import React from 'react';
import { useRouter } from 'next/router';

function ConversationLinkListItem({ conversation, isActive, selectConversation }) {
  const router = useRouter();

  function handleClick() {
    // router.push(`/chats/${conversation.id}`);
    selectConversation(conversation);
  }
  return (
    <a onClick={handleClick} href="#" className={isActive ? "active" : ""}>
      <li className="p-2 pl-4 whitespace-nowrap overflow-x-auto">
        <i className="far fa-message-middle mr-4 text-gray"></i>
        {conversation.name}
      </li>
    </a>
  );
}

export default ConversationLinkListItem;