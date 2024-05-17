let todos = [];

const todoList = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');

function newTodo() {
  const title = prompt('Enter a new task:');
  if (title) {
    const newTask = { id: todos.length + 1, title, completed: false };
    todos.push(newTask);
    saveTodos();
    render();
    updateCounter();
  }
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  render();
  updateCounter();
}

function checkTodo(id) {
  const index = todos.findIndex(todo => todo.id === id);
  if (index !== -1) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    render();
    updateCounter();
  }
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
  const savedTodos = localStorage.getItem('todos');
  todos = savedTodos ? JSON.parse(savedTodos) : [];
}

function renderTodo(todo) {
  return `
    <li class="list-group-item">
      <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${todo.completed ? 'checked' : ''} onChange="checkTodo(${todo.id})"/>
      <label for="${todo.id}" class="${todo.completed ? 'text-success text-decoration-line-through' : ''}">${todo.title}</label>
      <button class="btn btn-danger btn-sm float-end" onClick="deleteTodo(${todo.id})">delete</button>
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
  render();
  updateCounter();
});
