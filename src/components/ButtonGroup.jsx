import React, { Component } from 'react';

export default function ButtonGroup({
  classes,
  task,
  setTask,
  client,
  isActive,
  editingTask
}) {
  return (
    <div className={`${classes}`} role='group'>
      <button
        type='button'
        className={`px-1 py-1 text-xs hover:bg-gray-400 ${
          task.timeEstimate == 300
            ? 'bg-gray-600 text-grey-600'
            : 'bg-gray-800 text-gray-500'
        }`}
        onClick={e => {
          e.stopPropagation();
          setTask({ ...task, timeEstimate: 300 });
          client.tasks.update.mutate({
            id: task.id,
            timeEstimate: 300
          });
        }}
      >
        :5
      </button>
      <button
        type='button'
        className={`px-1 py-1 text-xs border-l border-gray-600 hover:bg-gray-400 ${
          task.timeEstimate == 900
            ? 'bg-gray-600 text-grey-600'
            : 'bg-gray-800 text-gray-500'
        }`}
        onClick={e => {
          e.stopPropagation();
          setTask({ ...task, timeEstimate: 900 });
          client.tasks.update.mutate({
            id: task.id,
            timeEstimate: 900
          });
        }}
      >
        :15
      </button>
      <button
        type='button'
        className={`px-1 py-1 text-xs border-l border-gray-600 hover:bg-gray-400 ${
          task.timeEstimate == 3600
            ? 'bg-gray-600 text-grey-600'
            : 'bg-gray-800 text-gray-500'
        }`}
        onClick={e => {
          e.stopPropagation();
          setTask({ ...task, timeEstimate: 3600 });
          client.tasks.update.mutate({
            id: task.id,
            timeEstimate: 3600
          });
        }}
      >
        1:00
      </button>
      <button
        type='button'
        className={`px-1 py-1 text-xs border-l border-gray-600 hover:bg-gray-400 ${'bg-gray-800 text-gray-500'}`}
        onClick={e => {
          e.stopPropagation();
          setTask({ ...task, timeEstimate: task.timeEstimate + 300 });
          client.tasks.update.mutate({
            id: task.id,
            timeEstimate: task.timeEstimate + 300
          });
        }}
      >
        <i className='fa fa-plus'></i>
      </button>
      <button
        type='button'
        className={`px-2 py-1 text-xs border-l border-gray-600 hover:bg-gray-400 bg-gray-800 text-gray-500 ${
          isActive ? 'visible' : 'invisible'
        }`}
        onClick={e => {
          e.stopPropagation();
          setTask({
            ...task,
            isPaused: !task.isPaused
          });
        }}
      >
        <i className={`fa ${task.isPaused ? 'fa-play' : 'fa-pause'}`}></i>
      </button>

      <button
        type='button'
        className={`px-2 py-1 text-xs border-l border-gray-600 hover:bg-gray-400 bg-gray-800 text-gray-500 ${
          isActive ? 'visible' : 'invisible'
        }`}
      >
        <i className='fa-light fa-refresh'></i>
      </button>
      <button
        type='button'
        className={`px-2 py-1 text-xs border-l border-gray-600 hover:bg-gray-400 bg-gray-800 text-gray-500 ${
          isActive ? 'visible' : 'invisible'
        }`}
      >
        <i className='fa-light fa-clock'></i>
      </button>
    </div>
  );
}
