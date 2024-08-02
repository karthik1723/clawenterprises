import React, { useEffect, useState } from 'react';
import api from '../services/api';
import TodoItem from './TodoItem';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.getTodos();
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to fetch to-do items');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addTodo(description, 'pending');
      fetchTodos();
      setDescription('');
    } catch (error) {
      console.error('Failed to add to-do item');
    }
  };

  return (
    <div>
      <h2>To-Do List</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a new to-do"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} fetchTodos={fetchTodos} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
