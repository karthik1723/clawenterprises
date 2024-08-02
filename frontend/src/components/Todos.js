// src/components/Todos.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Container,
  Title,
  Input,
  Button,
  TodoItem,
  TodoText,
  TodoButton,
  Form
} from '../StyledComponents';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  const fetchTodos = async () => {
    try {
      const response = await api.getTodos();
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      await api.addTodo(description, status);
      fetchTodos();
      setDescription('');
      setStatus('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handleUpdateTodo = async (id) => {
    const updatedDescription = prompt('Updated Description', description);
    const updatedStatus = prompt('Updated Status', status);
    if (updatedDescription && updatedStatus) {
      try {
        await api.updateTodo(id, updatedDescription, updatedStatus);
        fetchTodos();
      } catch (error) {
        console.error('Failed to update todo:', error);
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await api.deleteTodo(id);
      fetchTodos();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  return (
    <Container>
      <Title>Todos</Title>
      <Form onSubmit={handleAddTodo}>
        <Input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <Button type="submit">Add Todo</Button>
      </Form>
      {todos.map((todo) => (
        <TodoItem key={todo.id}>
          <TodoText>{todo.description}</TodoText>
          <TodoText>{todo.status}</TodoText>
          <TodoButton onClick={() => handleUpdateTodo(todo.id)}>Update</TodoButton>
          <TodoButton onClick={() => handleDeleteTodo(todo.id)}>Delete</TodoButton>
        </TodoItem>
      ))}
    </Container>
  );
};

export default Todos;
