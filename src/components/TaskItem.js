import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import copy from 'clipboard-copy';

function TaskItem({
  index,
  task,
  userInfo,
  setUserInfo,
  setActiveTask,
  setActiveTaskIndex
}) {
  if (task.id == userInfo.activeTaskId) {
    setActiveTaskIndex(index);
  }
  const currentTimestamp = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const customRenderer = {
    p: ({ children }) => (
      <>
        {children.map(child => {
          if (typeof child === 'string') {
            const parts = child.split('\n');
            return parts.map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {part}
              </React.Fragment>
            ));
          }
          return child;
        })}
      </>
    )
  };

  const cards = [
    {
      title: 'Card 1',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      title: 'Card 2',
      content:
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      title: 'Card 3',
      content:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      title: 'Card 4',
      content:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
      title: 'Card 5',
      content:
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
      title: 'Card 6',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    }
  ];

  return (
    <div
      className='w-full box cursor-pointer'
      onClick={() => {
        setActiveTask(task, index);
      }}
    >
      <div
        className={`message p-2 relative ${
          task.id == userInfo.activeTaskId ? '!bg-blue-950' : ''
        }`}
      >
        <img
          src={'avatar.png'}
          alt='Avatar'
          className='w-9 h-9 rounded-full absolute left-4 top-2'
        />
        <div className='pl-16 pt-0'>
          <span className='text-sm mb-1 inline-block name'>{'Task'}</span>{' '}
          <br />
          <p className='text-xs inline-block absolute top-3 right-4 timestamp'>
            <span className='message-direction'>
              {''}
              <i
                className={`fa-regular fa-arrow-down-left fa-lg ml-1 mr-3 mt-2`}
              ></i>
            </span>{' '}
            {currentTimestamp}
            <i
              className={`fa-star ${
                false ? 'fa-solid' : 'fa-regular'
              } ml-2 cursor-pointer`}
              onClick={() => {}}
            ></i>
            {true ? (
              <i className='fa-solid  w-5 h-5 ml-2'></i>
            ) : (
              <i
                className={`fa-light fa-copy w-5 h-5 ml-2 cursor-pointer`}
                onClick={() => {
                  // copyToClipboard(task.content);
                }}
              ></i>
            )}
          </p>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            children={task.content}
            components={customRenderer}
          />
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
