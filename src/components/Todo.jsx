import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [username, setUsername] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedTodos = JSON.parse(localStorage.getItem('todos'));

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedTodos) {
      setTodos(storedTodos);
    } else {
      fetchTodos();
    }
  }, []);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, [username, todos]);

  const fetchTodos = () => {
    axios.get('https://jsonplaceholder.typicode.com/todos')
      .then(response => {
        setTodos(response.data);
        localStorage.setItem('todos', JSON.stringify(response.data));
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
      });
  };

  const handleInputChange = (event) => {
    setNewTodo(event.target.value);
  };

  const addTodo = () => {
    const newTodoItem = {
      title: newTodo,
      completed: false,
    };
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
    localStorage.setItem('todos', JSON.stringify([...todos, newTodoItem]));

    axios.post('https://jsonplaceholder.typicode.com/todos', newTodoItem)
      .catch(error => {
        console.error('Error adding todo:', error);
      });
  };

  const deleteTodo = (id) => {
    axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .then(() => {
        const updatedTodos = todos.filter(todo => todo.id !== id);
        setTodos(updatedTodos);
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
      });
  };

  const deleteAllTodos = () => {
    const deletePromises = todos.map(todo => axios.delete(`https://jsonplaceholder.typicode.com/todos/${todo.id}`));
    Promise.all(deletePromises)
      .then(() => {
        setTodos([]);
        localStorage.setItem('todos', JSON.stringify([]));
      })
      .catch(error => {
        console.error('Error deleting all todos:', error);
      });
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    localStorage.setItem('username', event.target.value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>To-Do List</h2>
        <div>
          <label>
            Username:
            <input type="text" value={username} onChange={handleUsernameChange} />
          </label>
          <br />
          <label>
            Current Date:
            <input type="text" value={currentDate} readOnly />
          </label>
        </div>
      </div>
      <div className="todo-form">
        <input type="text" value={newTodo} onChange={handleInputChange} placeholder="Enter new todo..." />
        <button onClick={addTodo}>Add Todo</button>
        ㅤ
        <button onClick={deleteAllTodos}>Delete All Todos</button>
        <br />
        <label>
          Search:
          <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Search todos..." />
        </label>
      </div>
      <ul className="todo-list">
        {todos
          .filter(todo => todo.title.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(todo => (
            <li key={todo.id}>
              {todo.title}
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          ))}
      </ul>
    </div>
  );
}  

export default TodoList;
