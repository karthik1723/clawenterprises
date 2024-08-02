import React, { useState } from 'react';
import api from '../services/api';

const TodoItem = ({ todo, fetchTodos }) => {
  const [description, setDescription] = useState(todo.description);
  const [status, setStatus] = useState(todo.status);

  const handleUpdate = async () => {
    try {
      await api.updateTodo(todo.id, description, status);
      fetchTodos();
    } catch (error) {
      console.error('Failed to update to-do item');
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteTodo(todo.id);
      fetchTodos();
    } catch (error) {
      console.error('Failed to delete to-do item');
    }
  };

  return (
    <li>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
      <button onClick={handleUpdate}>Update</button>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
};

export default TodoItem;
