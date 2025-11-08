const form = document.getElementById('todoForm');
const input = document.getElementById('todoInput');
const searchBox = document.getElementById('searchBox');
const list = document.getElementById('todoList');
const countEl = document.getElementById('count');
const filterBtns = document.querySelectorAll('[data-filter]');

let todos = JSON.parse(localStorage.getItem('todos_v1') || '[]');
let filter = 'all';
let searchText = "";

function save(){
  localStorage.setItem('todos_v1', JSON.stringify(todos));
}

function render(){
  list.innerHTML = '';

  const filtered = todos.filter(t =>
    (filter === 'all' ? true :
     filter === 'active' ? !t.done :
     t.done) &&
    t.text.toLowerCase().includes(searchText.toLowerCase())
  );

  filtered.forEach(todo => {
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    if(todo.done) li.classList.add('completed');

    // Left part (checkbox + label)
    const left = document.createElement('div');
    left.className = 'left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => {
      todo.done = checkbox.checked;
      save();
      render();
    });

    const label = document.createElement('label');
    label.textContent = todo.text;
    label.addEventListener('dblclick', () => editTodo(todo.id));

    left.append(checkbox, label);

    // Actions (right)
    const actions = document.createElement('div');
    actions.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editTodo(todo.id);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => {
      if(confirm('Delete this task?')){
        todos = todos.filter(t => t.id !== todo.id);
        save();
        render();
      }
    };

    actions.append(editBtn, delBtn);

    li.append(left, actions); // left part + right actions
    list.appendChild(li);
  });

  const remaining = todos.filter(t => !t.done).length;
  countEl.textContent = `${remaining} item${remaining !== 1 ? 's' : ''} left`;
}

function editTodo(id){
  const todo = todos.find(t => t.id === id);
  if(!todo) return;
  const text = prompt('Edit task', todo.text);
  if(text !== null && text.trim()){
    todo.text = text.trim();
    save();
    render();
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;

  todos.push({
    id: Date.now().toString(36),
    text,
    done:false
  });

  input.value = '';
  save();
  render();
});

filterBtns.forEach(btn =>
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    render();
  })
);

searchBox.addEventListener('input', () => {
  searchText = searchBox.value;
  render();
});

render();
