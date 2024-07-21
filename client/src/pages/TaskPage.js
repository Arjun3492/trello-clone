import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import { PlusCircleIcon, LogoutIcon } from '@heroicons/react/solid';
import axiosInstance from '../axios';
import { useAuth } from '../provider/authProvider';

const TaskPage = () => {
  const [loggedInUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [sortedTasks, setSortedTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editTask, setEditTask] = useState('');
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    column: 'To Do',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await axiosInstance.get('/tasks', {
        headers: {
          'x-auth-token': user.token
        }
      });
      setTasks(res.data);
      setSortedTasks(res.data);
    };

    fetchTasks();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(e.target.value.toLowerCase()));
    setSortedTasks(filteredTasks);
  };

  const handleSort = (e) => {
    const sortKey = e.target.value;
    const sorted = [...tasks].sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
    setSortedTasks(sorted);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(sortedTasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    removed.column = result.destination.droppableId;
    reorderedTasks.splice(result.destination.index, 0, removed);

    setSortedTasks(reorderedTasks);

    try {
      await axiosInstance.put(`/tasks/${removed._id}`, removed, {
        headers: {
          'x-auth-token': user.token
        }
      });
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const handleCreateTask = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post('/tasks', {
        title: taskForm.title,
        description: taskForm.description,
        column: taskForm.column,
        dueDate: taskForm.dueDate,
      },
        {
          headers: {
            'x-auth-token': user.token
          }
        });

      if (res.status !== 200) {
        alert(res.data.msg);
      } else {
        setTasks([...tasks, res.data]);
        setSortedTasks([...tasks, res.data]);
      }
    } catch (err) {
      if (err.response.data.errors) {
        alert(err.response.data.errors.map(error => error.msg).join('\n'));
      }
      console.error(err.response.data);
    } finally {
      closeModal();
      setLoading(false);
    }
  };

  const handleEditTask = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.put(`/tasks/${editTask}`, {
        title: taskForm.title,
        description: taskForm.description,
        column: taskForm.column,
        dueDate: taskForm.dueDate,
      }, {
        headers: {
          'x-auth-token': user.token
        }
      });

      if (res.status !== 200) {
        alert(res.data.msg);
      } else {
        const updatedTasks = tasks.map(task => task._id === editTask ? res.data : task);
        setTasks(updatedTasks);
        setSortedTasks(updatedTasks);
      }
    } catch (err) {
      if (err.response.data.errors) {
        alert(err.response.data.errors.map(error => error.msg).join('\n'));
      }
      console.error(err.response.data);
    } finally {
      closeModal();
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await axiosInstance.delete(`/tasks/${id}`, {
        headers: {
          'x-auth-token': user.token
        }
      });
      if (res.status !== 200) {
        alert(res.data.msg);
        return;
      }
      const updatedTasks = tasks.filter(task => task._id !== id);
      setTasks(updatedTasks);
      setSortedTasks(updatedTasks);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const handleOpenEditTaskModal = async (task) => {
    setTaskForm({
      title: task.title,
      description: task.description,
      column: task.column,
      dueDate: task.dueDate,
    });
    setEditTask(task._id);
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleOpenCreateTaskModal = () => {
    setTaskForm({
      title: '',
      description: '',
      column: 'To Do',
      dueDate: '',
    });
    setIsEditing(false);
    setIsOpen(true);
  }

  const closeModal = () => setIsOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <div className="flex items-center space-x-4">
          <img
            className="w-10 h-10 rounded-full"
            src={process.env.REACT_APP_SERVER_URL + `/${loggedInUser.avatar}`}
            alt="Profile Avatar"
          />
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded flex items-center">
            <LogoutIcon className="h-5 w-5 mr-2" /> Logout
          </button>
        </div>

      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button onClick={handleOpenCreateTaskModal} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center mr-4">
            <PlusCircleIcon className="h-5 w-5 mr-2" /> Add Task
          </button>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
            className="p-2 border rounded w-64"
          />
        </div>
        <select onChange={handleSort} className="p-2 border rounded">
          <option value="title">Sort by Title</option>
          <option value="createdAt">Sort by Recent</option>
        </select>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {['To Do', 'In Progress', 'Done'].map(column => (
            <Droppable droppableId={column} key={column}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-blue-100 p-4 rounded shadow-md"
                >
                  <h2 className="text-xl font-bold mb-4">{column}</h2>
                  {sortedTasks.filter(task => task.column === column).map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-blue-300 p-4 rounded mb-4"
                        >
                          <h3 className="font-bold">{task.title}</h3>
                          <p>{task.description}</p>
                          <p>Due date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                          <p className="text-xs mt-2">Created at: {new Date(task.createdAt).toLocaleString()}</p>
                          <div className="flex justify-end mt-2">
                            <button className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                              onClick={() => handleDeleteTask(task._id)}>Delete</button>
                            <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                              onClick={() => handleOpenEditTaskModal(task)}>Edit</button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext >

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Create New Task
                  </DialogTitle>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="title"
                      placeholder="Title"
                      value={taskForm.title}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mb-4"
                    />
                    <textarea
                      name="description"
                      placeholder="Description"
                      value={taskForm.description}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mb-4"
                    />
                    <select
                      name="column"
                      value={taskForm.column}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mb-4"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                    <input
                      type="date"
                      name="dueDate"
                      value={taskForm.dueDate}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mb-4"
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        isEditing ? handleEditTask() : handleCreateTask()
                      }}
                      disabled={loading}
                    >
                      {loading ? "Loading..." : isEditing ? "Edit Task" : "Create Task"}
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 ml-4"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div >
  );
};

export default TaskPage;
