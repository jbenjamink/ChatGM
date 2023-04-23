import { useRef, useState } from 'react';
import AutoExpandTextarea from './AutoExpandTextarea';
import { TodoistApi } from '@doist/todoist-api-typescript';
import { trpc } from '../utils/trpc';
import { client } from '@/trpc/client';
import { LinkedList } from '../lib/LinkedList';

export default function NewTask({
  addingTask,
  addingSubtask,
  setAddingTask,
  setAddingSubtask,
  userInfo,
  activeProject,
  tasks,
  setTasks,
  placeholder = '',
  parentTaskId = null,
  activeTask,
  setActiveTask
}) {
  const textareaRef = useRef(null);
  const [newTask, setNewTask] = useState({
    content: '',
    parentTaskId: parentTaskId
  });
  const [submitLocket, setSubmitLock] = useState(false);
  const createTaskMutation = trpc.tasks.create.useMutation();

  const api = new TodoistApi(userInfo.todoistApiKey);
  return (
    <div key='new-task' style={{ aspectRatio: '1 / 1' }}>
      <div
        className='bg-dark h-5/6 border border-gray cursor-pointer hover-gray rounded'
        onClick={() => {
          setAddingTask(true);
          setAddingSubtask(parentTaskId != null);
        }}
      >
        <div className='flex h-full flex-col justify-center gap-4'>
          {!addingTask || (addingSubtask && parentTaskId == null) ? (
            <i className='fas fa-plus text-3xl mx-auto'></i>
          ) : (
            <>
              <textarea
                value={newTask.content}
                placeholder={placeholder}
                onChange={e => (
                  e.stopPropagation(),
                  setNewTask({
                    ...newTask,
                    content: e.target.value
                  })
                )}
                onKeyDown={e => {
                  e.stopPropagation();
                  if (e.key === 'Escape') {
                    setAddingTask(false);
                  }
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (submitLocket) {
                      return;
                    }
                    setSubmitLock(true);
                    api
                      .addTask({
                        content: newTask.content,
                        project_id: activeProject.id
                      })
                      .then(async task => {
                        setNewTask({
                          content: ''
                        });
                        setAddingTask(false);
                        setSubmitLock(false);
                        const newTask = {
                          projectId: activeProject.id, // more performant
                          content: task.content,
                          id: task.id,
                          project: activeProject,
                          prevTaskId:
                            (parentTaskId == null && tasks.tail?.value.id) ||
                            null,
                          labels: [],
                          parentTaskId: parentTaskId
                        };
                        if (parentTaskId == null) {
                          setTasks(
                            new LinkedList([...tasks.toArray(), newTask])
                          );
                        } else {
                          setActiveTask({
                            ...activeTask,
                            subtasks: activeTask.subtasks
                              ? [...activeTask.subtasks, newTask]
                              : [newTask]
                          });
                        }
                        // create an extension in our database
                        const fetchedTask =
                          await createTaskMutation.mutateAsync(newTask);
                      })
                      .catch(err => {
                        console.log(err);
                        setSubmitLock(false);
                      });
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
