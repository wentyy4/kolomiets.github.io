let todos = [];

const todoList = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');

const dbUrl = 'https://practika9-default-rtdb.europe-west1.firebasedatabase.app/todos.json';

function addTodo(todo) {
  fetch(dbUrl, {
    method: 'POST',
    body: JSON.stringify(todo),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    todo.id = data.name;
    todos.push(todo);
    render();
    updateCounter();
  })
  .catch((error) => {
    console.error('Error:', error);
    alert('Error adding TODO');
  });
}

function newTodo() {
  const title = prompt('Enter a new task:');
  if (title) {
    const newTask = { title, completed: false };
    addTodo(newTask);
  }
}

function loadTodos() {
  fetch(dbUrl)
    .then(response => response.json())
    .then(data => {
      todos = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      render();
      updateCounter();
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error loading TODOs');
    });
}

function deleteTodo(id) {
  fetch(`https://practika9-default-rtdb.europe-west1.firebasedatabase.app/todos/${id}.json`, {
    method: 'DELETE'
  })
  .then(() => {
    todos = todos.filter(todo => todo.id !== id);
    render();
    updateCounter();
  })
  .catch((error) => {
    console.error('Error:', error);
    alert('Error deleting TODO');
  });
}

function checkTodo(id) {
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    fetch(`https://practika9-default-rtdb.europe-west1.firebasedatabase.app/todos/${id}.json`, {
      method: 'PATCH',
      body: JSON.stringify({ completed: todo.completed }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      render();
      updateCounter();
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error updating TODO');
    });
  }
}

function renderTodo(todo) {
  return `
    <li class="list-group-item">
      <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${todo.completed ? 'checked' : ''} onChange="checkTodo('${todo.id}')"/>
      <label for="${todo.id}" class="${todo.completed ? 'text-success text-decoration-line-through' : ''}">${todo.title}</label>
      <button class="btn btn-danger btn-sm float-end" onClick="deleteTodo('${todo.id}')">delete</button>
    </li>
  `;
}

function render() {
  todoList.innerHTML = todos.map(todo => renderTodo(todo)).join('');
}

function updateCounter() {
  itemCountSpan.textContent = todos.length;
  uncheckedCountSpan.textContent = todos.filter(todo => !todo.completed).length;
}

window.addEventListener('load', () => {
  loadTodos();
});
