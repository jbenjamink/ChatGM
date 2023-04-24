import { LinkedList } from '../lib/LinkedList';
import { useEffect } from 'react';
import ButtonGroup from './ButtonGroup';
import { useState } from 'react';

export default function TaskBlock({
  passedTask,
  tasks,
  activateTask,
  editingTask,
  setEditingTask,
  api,
  estimateDisplay,
  setTasks,
  toggleInProgress,
  toggleCompletion,
  client,
  updateTaskMutation,
  isActive,
  deleteTaskMutation,
  pointMap,
  userInfo,
  showIcons,
  onlyShowOnHover,
  someTaskActive,
  index,
  textareaRef,
  submitTaskLock,
  c,
  router,
  activeTask,
  setActiveTask,
  swapLeft,
  swapRight,
  swap
}) {
  let retro = true;
  let modern = false;
  const [task, setTask] = useState(passedTask);

  if (task.id != passedTask.id) setTask(passedTask);

  // setInterval(() => {
  //   if (task.id != activeTask.id) setCounter(counter + 1);
  //   console.log(counter);
  // }, 1000);

  useEffect(() => {
    // Check if 'c' is not null before accessing its 'key' property
    if (c && router.asPath == '/tasks') {
      switch (c.key) {
        case 'r':
          break;
      }
    }
  }, [c]);

  useEffect(() => {
    if (!activeTask) return;
    setActiveTask({
      ...activeTask,
      isPaused: task.isPaused
    });
  }, [task.isPaused]);

  return (
    <div
      key={task.id}
      className={`relative aspect-w-1 aspect-h-1 shadow-gray-500 transition-height duration-1000 ease-in-out 
  ${
    false &&
    someTaskActive &&
    !isActive &&
    'transform transition duration-300 hidden'
  } 
  ${false && isActive && 'absolute top-3 left-3'}
  `}
      style={{ aspectRatio: '6 / 5' }}
    >
      <div
        className={`group bg-dark${retro && '-blue '} ${
          retro ? 'hover:bg-gray-600' : ''
        } ${
          modern ? 'hover-gray' : ''
        } border h-full border-gray-700 cursor-pointer hover:bg-gray-600 rounded-lg overflow-hidden relative ${
          task.id == userInfo.activeTaskId ? '!bg-blue-950' : ''
        } ${
          task.labels?.includes('completed')
            ? retro
              ? isActive
                ? '!bg-green-700'
                : '!bg-green-950'
              : 'bg-green'
            : ''
        } ${
          task.labels?.includes('in-progress') ? '!bg-orange-800' : ''
        } brightness-100`}
        onClick={() => activateTask(task, index)}
      >
        <div
          className={`group flex h-full flex-col justify-center gap-4 overflow-hidden ${
            editingTask?.id == task.id ? '' : 'p-3'
          }`}
        >
          {/* <div
            className={`blur-on-hover w-full h-full overflow-hidden flex flex-col justify-center`}
          > */}
          {editingTask?.id != task.id ? (
            <span
              className={`${
                retro ? '' : 'multi-line-truncate w-full inline-block'
              }`}
            >
              {task.content || '|' + task.name + '|'}
              <div
                className={`w-full flex items-center space-x-2 ${
                  modern ? 'circle-pattern-on-hover' : ''
                }`}
              >
                {editingTask?.id != task.id &&
                  Array(task.pointValue)
                    .fill()
                    .map((_, index) => {
                      // console.log(task.id, index);
                      return (
                        <span key={index}>
                          <i className='fa-light fa-star font-8 text-offwhite'></i>
                        </span>
                      );
                    })}
              </div>
            </span>
          ) : (
            <textarea
              value={editingTask?.content}
              placeholder={editingTask?.content}
              onChange={e => (
                e.stopPropagation(),
                setEditingTask({
                  ...editingTask,
                  content: e.target.value
                })
              )}
              onKeyDown={e => {
                e.stopPropagation();
                if (e.key === 'Escape') {
                  setEditingTask(null);
                }
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (submitTaskLock) {
                    return;
                  }
                  api
                    .updateTask(task.id, {
                      content: editingTask?.content
                    })
                    .then(updatedTask => {
                      setTasks(
                        tasks.map(t => (t.id != task.id ? t : editingTask))
                      );
                      client.tasks.updateWhere.mutate({
                        where: {
                          id: editingTask?.id
                        },
                        data: {
                          name: editingTask?.content
                        }
                      });
                      setEditingTask(null);
                      setSubmitTaskLock(false);
                    })
                    .catch(err => console.log(err));

                  // create an extension in our database
                }
              }}
              className='w-full h-full p-2 mr-2 bg-dark text-sm p-0 m-0 focus:ring-transparent !bg-inherit'
              style={{
                resize: 'none',
                overflow: 'auto'
              }}
              textarearef={textareaRef}
              autoFocus={true}
              onFocus={e => {
                const {
                  target,
                  target: {
                    value: { length }
                  }
                } = e;
                target.setSelectionRange(length, length);
              }}
            />
          )}
          {/* </div> */}
          <div
            className={`absolute top-0 left-0 ${
              task.id == editingTask?.id ? 'invisible' : ''
            }`}
          >
            <ButtonGroup
              classes={`z-20 hidden group-hover:block`}
              task={task}
              setTask={setTask}
              client={client}
              isActive={isActive}
              editingTask={editingTask}
            ></ButtonGroup>
            <div
              className={`text-gray p-1 text-sm w-full ${
                isActive && task.id != editingTask?.id
                  ? 'visible'
                  : task.id == editingTask?.id
                  ? 'visible'
                  : 'visible group-hover:visible'
              }`}
            >
              {task.timeEstimate
                ? estimateDisplay(
                    task.timeEstimate -
                      (isActive ? activeTask.timeSpent : task.timeSpent)
                  )
                : ''}
            </div>
          </div>
          <div
            className={`w-full flex items-center justify-between absolute top-3 left-0 ${
              !showIcons && 'hidden'
            } ${
              onlyShowOnHover && !isActive
                ? 'invisible group-hover:visible'
                : ''
            }`}
          >
            <i
              className={`invisible fa-solid fa-clock cursor-pointer ${
                retro ? 'text-gray' : 'text-gray-light'
              } w-5 h-5 mr-auto ml-3 transform transition duration-300 hover:scale-125 hover:font-bold`}
              onClick={e => {
                e.stopPropagation();
                task._editingTimeEstimate = !task._editingTimeEstimate;
              }}
            ></i>
            <span
              className={`flex items-center justify-center text-gray flex-row`}
            >
              <i
                className={`fa-solid fa-chevron-left cursor-pointer ${
                  retro ? 'text-gray' : 'text-gray-light'
                } w-5 h-5 ml-auto mr-8 absolute transform transition duration-300 hover:scale-125 hover:font-bold`}
                onClick={e => {
                  e.stopPropagation();
                  swap(tasks.indexMap[task.id], tasks.head);
                }}
              ></i>
              <i
                className={`fa-solid fa-arrow-left cursor-pointer ${
                  retro ? 'text-gray' : 'text-gray-light'
                } w-5 h-5 ml-auto mr-5 absolute transform transition duration-300 hover:scale-125 hover:font-bold`}
                onClick={e => {
                  e.stopPropagation();
                  swapLeft(tasks.indexMap[task.id]);
                }}
              ></i>
              <i
                className={`fa-solid fa-arrow-right cursor-pointer ${
                  retro ? 'text-gray' : 'text-gray-light'
                } w-5 h-5 mr-auto ml-5 absolute transform transition duration-300 hover:scale-125 hover:font-bold`}
                onClick={e => {
                  e.stopPropagation();
                  swapRight(tasks.indexMap[task.id]);

                  // client.tasks.postpone.mutate({
                  //   taskId: task.id,
                  //   projectName: activeProject.name
                  // });
                }}
              ></i>
              <i
                className={`fa-solid fa-chevron-right cursor-pointer ${
                  retro ? 'text-gray' : 'text-gray-light'
                } w-5 h-5 mr-auto ml-10 absolute transform transition duration-300 hover:scale-125 hover:font-bold`}
                onClick={e => {
                  e.stopPropagation();
                  swap(tasks.tail, tasks.indexMap[task.id]);
                }}
              ></i>
            </span>
            <i
              className={`fa-solid fa-edit cursor-pointer ${
                retro ? 'text-gray' : 'text-gray-light'
              } w-5 h-5 ml-auto mr-3 transform transition duration-300 hover:scale-125 hover:font-bold`}
              onClick={e => {
                e.stopPropagation();
                editingTask?.id != task.id
                  ? setEditingTask(task)
                  : setEditingTask(null);
              }}
            ></i>
          </div>
          <div
            className={`w-full flex items-center justify-between absolute top-1/2 left-0 ${
              !showIcons && 'hidden'
            } ${
              onlyShowOnHover && !isActive
                ? 'invisible group-hover:visible'
                : ''
            }`}
          >
            <span></span>
            <span className='flex items-center justify-center flex-col'>
              <i
                className={`fa-solid fa-plus cursor-pointer ${
                  retro ? 'text-gray' : 'text-gray-light'
                } w-5 h-5 ml-auto mr-3 transform transition duration-300 hover:scale-125 hover:font-bold`}
                onClick={e => {
                  e.stopPropagation();
                  task.pointValue += 1;
                  updateTaskMutation.mutate({
                    id: task.id,
                    pointValue: task.pointValue
                  });
                }}
              ></i>
              <i
                className={`fa-solid fa-minus cursor-pointer ${
                  retro ? 'text-gray' : 'text-gray-light'
                } w-5 h-5 mr-auto mr-3 transform transition duration-300 hover:scale-125 hover:font-bold`}
                onClick={e => {
                  e.stopPropagation();
                  task.pointValue -= 1;
                  updateTaskMutation.mutate({
                    id: task.id,
                    pointValue: task.pointValue
                  });
                }}
              ></i>
            </span>
            {/* <span></span> */}
          </div>
          <div
            className={`w-full flex items-center justify-between absolute bottom-1 left-0 ${
              !showIcons && 'hidden'
            } ${
              onlyShowOnHover && !isActive
                ? 'invisible group-hover:visible'
                : ''
            }`}
          >
            <i
              className={`fa-solid fa-close cursor-pointer ${
                retro ? 'text-gray' : 'text-gray-light'
              } w-5 h-5 mr-auto ml-3 transform transition duration-300 hover:scale-125 hover:font-bold`}
              onClick={e => (
                e.stopPropagation(),
                api
                  .closeTask(task.id)
                  .then(closed => {
                    if (
                      task.parentTaskId &&
                      task.parentTaskId == activeTask.id
                    ) {
                      activeTask.subtasks = activeTask.subtasks.filter(
                        t => t.id != task.id
                      );
                      setActiveTask(activeTask);
                    }
                    setTasks(
                      new LinkedList(
                        tasks
                          .toArray()
                          .map(t => (t.id == activeTask?.id ? activeTask : t))
                          .filter(t => t.id != task.id)
                      )
                    );
                    deleteTaskMutation.mutate(task.id);
                  })
                  .catch(err => console.log(err))
              )}
            ></i>
            <span className={`items-center text-gray w-5 h-5`}>
              <i
                className={`fa-solid fa-circle-half-stroke cursor-pointer ${
                  retro ? 'text-gray' : 'text-gray-light'
                } w-5 h-5 absolute transform transition duration-300 hover:scale-125 hover:font-bold`}
                onClick={e => toggleInProgress(task, e, setTask)}
              ></i>
            </span>
            <i
              className={`fa-solid ${
                task.labels?.includes('completed') ? 'fa-undo' : 'fa-check'
              } cursor-pointer text-gray w-5 h-5 ml-auto mr-3 transform transition duration-300 hover:scale-125 hover:font-bold`}
              onClick={e => toggleCompletion(task, e, setTask)}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
}
