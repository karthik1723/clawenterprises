// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:4000';

const register = (username, password) => {
  return axios.post(`${API_URL}/register`, { username, password });
};

const login = (username, password) => {
  return axios.post(`${API_URL}/login`, { username, password });
};

const addTodo = (description, status) => {
  const token = localStorage.getItem('token');
  return axios.post(`${API_URL}/todos`, { description, status }, {
    headers: { 'x-access-token': token }
  });
};

const getTodos = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/todos`, {
    headers: { 'x-access-token': token }
  });
};

const updateTodo = (id, description, status) => {
  const token = localStorage.getItem('token');
  return axios.put(`${API_URL}/todos/${id}`, { description, status }, {
    headers: { 'x-access-token': token }
  });
};

const deleteTodo = (id) => {
  const token = localStorage.getItem('token');
  return axios.delete(`${API_URL}/todos/${id}`, {
    headers: { 'x-access-token': token }
  });
};

export default {
  register,
  login,
  addTodo,
  getTodos,
  updateTodo,
  deleteTodo
};
