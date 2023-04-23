import { useRef, useEffect, useState, useCallback } from 'react';
import AutoExpandTextarea from './AutoExpandTextarea';
import { subscribeToChannel } from '../lib/ably';
import pusher from '../lib/pusher';
import Pusher from 'pusher-js';
import { client } from '../trpc/client';
import { trpc } from '../utils/trpc';
import TaskItem from './TaskItem';
import TaskBlock from './TaskBlock';
import NewTask from './NewTask';
import ProjectListItem from './ProjectListItem';
import ProjectProgressBar from './ProjectProgressBar';
import { TodoistApi } from '@doist/todoist-api-typescript';
import { Card, Row } from 'flowbite-react';
import { useRouter } from 'next/router';
import moment from 'moment';
import { map } from '@trpc/server/observable';
import { LinkedList } from '../lib/LinkedList';

function Tasks({
  userInfo,
  setUserInfo,
  tasks,
  setTasks,
  activeProject,
  setActiveProject,
  projects,
  setProjects,
  c,
  settings
}) {
  const api = new TodoistApi(userInfo.todoistApiKey);
  const scrollContainer = useRef(null);
  const channelRef = useRef(null);
  const textareaRef = useRef(null);
  const noteareaRef = useRef(null);
  const [socketId, setSocketId] = useState(null);
  const [activeTask, setActiveTask] = useState();
  if (window) {
    window.activeTask = activeTask;
  }
  const [activeTaskIndex, setActiveTaskIndex] = useState();
  const [addingTask, setAddingTask] = useState(false);
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [taskHash, setTaskHash] = useState({});
  const [editingTask, setEditingTask] = useState();
  const [submitTaskLock, setSubmitTaskLock] = useState(false);
  const [headTask, setHeadTask] = useState(null);
  const [taskTimer, setTaskTimer] = useState(0);
  const setActiveTaskMutation = trpc.users.setActiveTask.useMutation();
  const setActiveProjectMutation = trpc.users.setActiveProject.useMutation();
  const deleteTaskMutation = trpc.tasks.delete.useMutation();
  const updateTaskMutation = trpc.tasks.update.useMutation();
  const updateSwappedMutation = trpc.tasks.updateSwapped.useMutation();
  const updateProjectMutation = trpc.projects.update.useMutation();
  const router = useRouter();

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const pointMap = [
    '',
    'shadow-xs',
    'shadow-sm',
    'shadow-md',
    'shadow-lg',
    'shadow-xl',
    'shadow-2xl',
    'shadow-inner',
    'shadow-none'
  ];

  useEffect(() => {
    setTaskTimer(0);
  }, [activeTask?.id]);

  const getActiveTask = () => activeTask;
  useEffect(() => {
    console.log('ACTIVE:', activeTask);
    let counterInterval = setInterval(() => {
      let activeTask = getActiveTask();
      if (!activeTask) return;
      if (activeTask.isPaused) return;
      activeTask.timeSpent += 1;
      setActiveTask({
        ...activeTask
      });
    }, 1000);

    let saveInterval = setInterval(() => {
      if (!activeTask) return;
      console.log('saving');
      updateTaskMutation.mutate({
        id: activeTask.id,
        timeSpent: activeTask.timeSpent
      });
    }, 10000);

    return () => (clearInterval(counterInterval), clearInterval(saveInterval));
  }, [
    activeTask?.id,
    activeTask?.subtasks,
    activeTask?.isPaused,
    activeTask?.notes
  ]);

  const estimateDisplay = seconds => {
    let duration = moment.duration(seconds, 'seconds');
    return moment
      .utc(duration.asMilliseconds())
      .format(duration.asHours() >= 1 ? 'H:mm:ss' : 'm:ss')
      .trim();
  };

  const swapLeft = (node = null) => {
    const node1 = node || tasks.indexMap[userInfo.activeTaskId];
    const node2 = node1.prev;
    if (!node2) return;

    const saveableValues = tasks.swap(node1, node2);
    console.log('saveableValues', saveableValues);
    updateSwappedMutation.mutate(saveableValues);

    setTasks(new LinkedList(tasks.toArray()));
  };

  const swapRight = (node = null) => {
    const node1 = node || tasks.indexMap[userInfo.activeTaskId];
    const node2 = node1.next;
    if (!node2) return;

    const saveableValues = tasks.swap(node2, node1);
    updateSwappedMutation.mutate(saveableValues);

    setTasks(new LinkedList(tasks.toArray()));
  };

  useEffect(() => {
    console.log('active task:', activeTask?.id, activeTask?.isPaused);
  }, [activeTask]);

  useEffect(() => {}, [userInfo.hideProjectHeader]);

  useEffect(() => {
    // Check if 'c' is not null before accessing its 'key' property
    if (c && router.asPath == '/tasks') {
      switch (c.key) {
        case 'ArrowUp':
          if (activeTaskIndex > 0) {
            setActiveTask(tasks[activeTaskIndex - 1], activeTaskIndex - 1);
          }
          break;
        case 'ArrowDown':
          if (activeTaskIndex < tasks.length - 1) {
            setActiveTask(tasks[activeTaskIndex + 1], activeTaskIndex + 1);
          }
          break;
        case 'ArrowLeft':
          if (c.e.shiftKey) {
            swapLeft();
          }
          break;
        case 'ArrowRight':
          if (c.e.shiftKey) {
            swapRight();
          }
          break;
        case 'N':
          setAddingTask(true);
          break;
        case 'Enter':
          // toggleCompletion(tasks.find(({ id }) => id == userInfo.activeTaskId));
          break;
        // case 'Escape':
        //   setAddingTask(false);
      }
    }
  }, [c]);

  // useEffect(() => {
  //   if (userInfo.activeProjectId == activeProject?.id) return;
  //   if (projects.length == 0 || !userInfo.activeProjectIdq) {
  //     if (!userInfo.activeProjectId) {
  //       api
  //         .getProjects()
  //         .then(projects => setProjects(projects))
  //         .catch(err => console.log(err));
  //     } else {
  //       api.getProject(userInfo.activeProjectId).then(project => {
  //         // setActiveProject(project);
  //       });
  //     }
  //   }
  // }, [userInfo.activeProjectId]);

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
    }
  }

  const resetOrdering = async () => {
    const tasks = await client.tasks.query.query({
      projectId: activeProject.id
    });
    console.log('tasks', tasks);
    let prevTaskId = null;
    tasks.map(task => {
      console.log('prevTaskId', prevTaskId);
      client.tasks.update.mutate({
        id: task.id,
        prevTaskId: prevTaskId
      });
      prevTaskId = task.id;
      console.log('prevTaskId', prevTaskId);
    });
  };
  if (window) {
    window.resetOrdering = resetOrdering;
  }

  useEffect(() => {
    forceUpdate();
  }, [tasks.tail]);

  useEffect(() => {
    if (!activeProject) {
      return;
    }
    if (userInfo.activeProjectId != activeProject.id) {
      setUserInfo({
        ...userInfo,
        activeProjectId: activeProject.id
      });
      setActiveProjectMutation.mutate(activeProject.id);
    }
    api
      .getTasks({
        projectId: activeProject.id,
        priority: 1
      })
      .then(async tasks => {
        window.tasks = tasks.map(t => t.content);
        const sorted = await client.tasks.queryRawSorted.query({
          projectId: activeProject.id
        });

        const indexed = tasks.reduce((obj, task) => {
          obj[task.id] = task;
          return obj;
        }, {});
        window.indexed = indexed;
        sorted.forEach(task => {
          indexed[task.id] = {
            ...indexed[task.id],
            ...task
          };
        });

        if (userInfo.activeTaskId && indexed[userInfo.activeTaskId]) {
          const subtasks = await client.tasks.queryRawSorted.query({
            projectId: activeProject.id,
            parentTaskId: userInfo.activeTaskId
          });
          indexed[userInfo.activeTaskId].subtasks = subtasks.map(
            (task, index) => {
              return {
                labels: [],
                ...indexed[task.id],
                ...task
              };
            }
          );
          setActiveTask(indexed[userInfo.activeTaskId]);
        }

        let merged = sorted.map(
          task => (
            (indexed[task.id] = {
              labels: [],
              ...indexed[task.id],
              ...task
            }),
            {
              ...indexed[task.id]
            }
          )
        );
        console.log('merged', merged);
        let list = new LinkedList(merged);
        setTasks(list);
        setHeadTask(merged[0]);
        setTaskHash(indexed);
      })
      .catch(err => console.log(err));
  }, [activeProject?.id]);

  useEffect(() => {
    const saveInterval = setTimeout(() => {
      if (activeTask?.notes) {
        updateTaskMutation.mutate({
          id: activeTask.id,
          notes: activeTask.notes
        });
      }
    }, 1000);
    return () => clearInterval(saveInterval);
  }, [activeTask?.notes]);

  const activateTask = async (task, index) => {
    const activeTaskId = task.id == userInfo.activeTaskId ? null : task.id;
    if (activeTask) {
      const subtasks = await client.tasks.queryRawSorted.query({
        projectId: activeProject.id,
        parentTaskId: activeTaskId
      });
      task.subtasks = subtasks.map(task => ({
        labels: [],
        ...taskHash[task.id],
        ...task
      }));
    }
    setUserInfo({
      ...userInfo,
      activeTaskId: activeTaskId,
      activeTaskSetAt: new Date()
    });
    setActiveTaskIndex(index);
    setActiveTask(activeTaskId ? task : null);
    const updatedUser = await setActiveTaskMutation.mutateAsync(activeTaskId);
  };

  const toggleCompletion = (task, e, setTask = null) => (
    e && e.stopPropagation(),
    task && task.id == activeTask?.id && activateTask(task),
    task &&
      api
        .updateTask(task.id, {
          labels: task.labels.includes('completed')
            ? task.labels.filter(label => label != 'completed')
            : [...task.labels, 'completed'].filter(
                label => label != 'in-progress'
              )
        })
        .then(updatedTask => {
          if (activeTask && task.parentId == activeTask.id) {
            alert('its a subtask');
          }
          setTasks(
            tasks.map(t =>
              t.id != task.id
                ? t
                : {
                    ...task,
                    ...updatedTask
                  }
            )
          );
          if (setTask) {
            setTask({
              ...task,
              ...updatedTask
            });
          }
        })
        .catch(err => console.log(err))
  );

  const toggleInProgress = (task, e, setTask = null) => (
    e && e.stopPropagation(),
    task &&
      api
        .updateTask(task.id, {
          labels: task.labels.includes('in-progress')
            ? task.labels.filter(label => label != 'in-progress')
            : [...task.labels, 'in-progress'].filter(
                label => label != 'completed'
              )
        })
        .then(updatedTask => {
          setTasks(tasks.map(t => (t.id != task.id ? t : updatedTask)));
          if (setTask) {
            setTask(updatedTask);
          }
        })
        .catch(err => console.log(err))
  );

  let onlyShowOnHover = true;
  let someTaskActive = !!userInfo.activeTaskId;

  const tasksPerRowClass = () => {
    switch (settings.tasksPerRow) {
      case 1:
        return 'lg:grid-cols-1';
      case 2:
        return 'lg:grid-cols-2';
      case 3:
        return 'lg:grid-cols-3';
      case 4:
        return 'lg:grid-cols-4';
      case 5:
        return 'lg:grid-cols-5';
      case 6:
        return 'lg:grid-cols-6';
      case 7:
        return 'lg:grid-cols-7';
      case 8:
        return 'lg:grid-cols-8';
      case 9:
        return 'lg:grid-cols-9';
      case 10:
        return 'lg:grid-cols-10';
    }
  };
  return (
    <div className='mx-auto h-full p-4 pt-0'>
      <ProjectProgressBar tasks={tasks.toArray()} />
      <div className='overflow-y-auto' ref={scrollContainer}>
        {projects
          .filter(project => {
            return activeProject ? project.id == activeProject.id : true;
          })
          .map((project, index) => {
            return (
              <ProjectListItem
                key={project.id + index}
                index={index}
                project={project}
                setActiveProject={setActiveProject}
                userInfo={userInfo}
                setUserInfo={setUserInfo}
              />
            );
          })}
        {settings.taskLayout == 'grid' ? (
          <>
            {activeTask && (
              <div className='grid grid-cols-3 gap-2 pt-2'>
                <TaskBlock
                  key={'active-task'}
                  index={activeTask.id}
                  passedTask={activeTask}
                  tasks={tasks}
                  setTasks={setTasks}
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                  setActiveTask={setActiveTask}
                  setActiveTaskIndex={setActiveTaskIndex}
                  editingTask={editingTask}
                  setEditingTask={setEditingTask}
                  showIcons={true}
                  isActive={true}
                  someTaskActive={true}
                  pointMap={pointMap}
                  onlyShowOnHover={onlyShowOnHover}
                  toggleCompletion={toggleCompletion}
                  toggleInProgress={toggleInProgress}
                  activateTask={activateTask}
                  updateTaskMutation={updateTaskMutation}
                  deleteTaskMutation={deleteTaskMutation}
                  api={api}
                  textareaRef={textareaRef}
                  submitTaskLock={submitTaskLock}
                  client={client}
                  estimateDisplay={estimateDisplay}
                  c={c}
                  router={router}
                  activeTask={activeTask}
                  swapRight={swapRight}
                  swapLeft={swapLeft}
                />
                <div className='grid grid-cols-3 gap-2 auto-rows-min'>
                  {activeTask.subtasks?.map((task, index) => {
                    let showIcons = editingTask?.id != task.id;
                    let isActive = task.id == userInfo.activeTaskId;
                    return (
                      <TaskBlock
                        key={task.id + index}
                        index={index}
                        passedTask={task}
                        tasks={tasks}
                        setTasks={setTasks}
                        userInfo={userInfo}
                        setUserInfo={setUserInfo}
                        setActiveTask={setActiveTask}
                        setActiveTaskIndex={setActiveTaskIndex}
                        editingTask={editingTask}
                        setEditingTask={setEditingTask}
                        showIcons={showIcons}
                        isActive={isActive}
                        someTaskActive={someTaskActive}
                        pointMap={pointMap}
                        onlyShowOnHover={onlyShowOnHover}
                        toggleCompletion={toggleCompletion}
                        toggleInProgress={toggleInProgress}
                        activateTask={activateTask}
                        updateTaskMutation={updateTaskMutation}
                        deleteTaskMutation={deleteTaskMutation}
                        api={api}
                        textareaRef={textareaRef}
                        submitTaskLock={submitTaskLock}
                        client={client}
                        estimateDisplay={estimateDisplay}
                        c={c}
                        router={router}
                        activeTask={activeTask}
                        swapRight={swapRight}
                        swapLeft={swapLeft}
                      />
                    );
                  })}
                  <NewTask
                    addingTask={addingTask}
                    addingSubtask={addingSubtask}
                    setAddingTask={setAddingTask}
                    setAddingSubtask={setAddingSubtask}
                    userInfo={userInfo}
                    activeProject={activeProject}
                    tasks={tasks}
                    setTasks={setTasks}
                    parentTaskId={activeTask.id}
                    activeTask={activeTask}
                    setActiveTask={setActiveTask}
                  ></NewTask>{' '}
                </div>
                <div>
                  <textarea
                    value={activeTask.notes}
                    className='h-full w-full bg-transparent focus:outline-none focus:ring-0'
                    autoFocus
                    placeholder='Notes'
                    ref={noteareaRef}
                    onKeyDown={e => {
                      e.stopPropagation();
                      if (e.key == 'Escape') {
                        noteareaRef.current.blur();
                        return;
                      }
                    }}
                    onChange={e => {
                      setActiveTask({
                        ...activeTask,
                        notes: e.target.value
                      });
                    }}
                  />
                </div>
              </div>
            )}
            <div
              className={`grid ${
                userInfo.hideSidebar
                  ? 'lg:grid-cols- sm:grid-cols-4 xs:grid-cols-3 text-sm transform transition-all duration-300 ease-in-out'
                  : someTaskActive
                  ? 'grid-cols-4'
                  : 'grid-cols-4'
              } gap-4 pt-4 ${tasksPerRowClass()}`}
            >
              {tasks
                .toArray()
                .filter(task => {
                  return (
                    (activeProject?.showCompletedTasks &&
                      task.labels.includes('completed')) ||
                    (activeProject?.showIncompleteTasks &&
                      !task.labels.includes('completed'))
                  );
                })
                .map((task, index) => {
                  let showIcons = editingTask?.id != task.id;
                  let isActive = task.id == userInfo.activeTaskId;
                  if (isActive && !activeTask) setActiveTask(task);
                  return (
                    <TaskBlock
                      key={task.id + index}
                      index={index}
                      passedTask={task}
                      tasks={tasks}
                      setTasks={setTasks}
                      userInfo={userInfo}
                      setUserInfo={setUserInfo}
                      setActiveTask={setActiveTask}
                      setActiveTaskIndex={setActiveTaskIndex}
                      editingTask={editingTask}
                      setEditingTask={setEditingTask}
                      showIcons={showIcons}
                      isActive={isActive}
                      someTaskActive={someTaskActive}
                      pointMap={pointMap}
                      onlyShowOnHover={onlyShowOnHover}
                      toggleCompletion={toggleCompletion}
                      toggleInProgress={toggleInProgress}
                      activateTask={activateTask}
                      updateTaskMutation={updateTaskMutation}
                      deleteTaskMutation={deleteTaskMutation}
                      api={api}
                      textareaRef={textareaRef}
                      submitTaskLock={submitTaskLock}
                      client={client}
                      estimateDisplay={estimateDisplay}
                      c={c}
                      router={router}
                      activeTask={activeTask}
                      swapRight={swapRight}
                      swapLeft={swapLeft}
                    />
                  );
                })}
              {true && (
                <NewTask
                  addingTask={addingTask}
                  addingSubtask={addingSubtask}
                  setAddingTask={setAddingTask}
                  setAddingSubtask={setAddingSubtask}
                  userInfo={userInfo}
                  activeProject={activeProject}
                  tasks={tasks}
                  setTasks={setTasks}
                  activeTask={activeTask}
                  setActiveTask={setActiveTask}
                ></NewTask>
              )}
            </div>
          </>
        ) : (
          tasks.mapArray((task, index) => (
            <TaskItem
              key={task.id + index}
              index={index}
              task={task}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              setActiveTask={setActiveTask}
              setActiveTaskIndex={setActiveTaskIndex}
            />
          ))
        )}
        {/* <div ref={(element) => { messageEnd = element; }}></div> */}
      </div>
    </div>
  );
}

export default Tasks;
