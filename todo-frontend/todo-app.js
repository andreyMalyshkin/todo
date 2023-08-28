var deal = [];
var idCounter = 0;

function saveDealToLocalStorage(storageKey) {
  localStorage.setItem(storageKey, JSON.stringify(deal));
}

(function() {
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    if (!input.textContent) {
      button.setAttribute('disable', 'disable');
    }

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(name) {
    let item = document.createElement('li');
    let id = idCounter++;

    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-item-center');
    item.textContent = name;
    item.setAttribute('data-id', id);
    item.classList.add('status');

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      id,
      title: name,
      status: false,
      item,
      doneButton,
      deleteButton,
    };
  }

  function dateBasePush(id, status) {
    let todoItem = deal.find(item => item.id === id);
    if (todoItem) {
      todoItem.status = status;
    }
  }

  function createTodoApp(container, title = 'Список дел', storageKey = 'myDeal') {
    let todoAppTitle = createAppTitle(title);
    let TodoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(TodoItemForm.form);
    container.append(todoList);

    window.addEventListener('load', function() {
      if (localStorage.getItem(storageKey)) {
        deal = JSON.parse(localStorage.getItem(storageKey));
        renderTodoList();
      }
    });

    TodoItemForm.form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!TodoItemForm.input.value) {
        return;
      }

      let todoItem = createTodoItem(TodoItemForm.input.value);

      deal.push({ id: todoItem.id, title: todoItem.title, status: todoItem.status });
      saveDealToLocalStorage(storageKey);

      todoItem.doneButton.addEventListener('click', function() {
        todoItem.item.classList.toggle('list-group-item-success');
        todoItem.status = !todoItem.status;
        dateBasePush(todoItem.id, todoItem.status);
        saveDealToLocalStorage(storageKey);
      });

      todoItem.deleteButton.addEventListener('click', function() {
        if (confirm('Вы уверены?')) {
          todoItem.item.remove();
          deal = deal.filter(item => item.id !== todoItem.id);
          saveDealToLocalStorage(storageKey);
        }
      });

      todoList.append(todoItem.item);
      TodoItemForm.input.value = '';
    });

    function renderTodoList() {
      todoList.innerHTML = '';

      deal.forEach(function(item) {
        let todoItem = createTodoItem(item.title);
        todoItem.id = item.id;
        todoItem.status = item.status;

        if (item.status) {
          todoItem.item.classList.add('list-group-item-success');
        }

        todoItem.doneButton.addEventListener('click', function() {
          todoItem.item.classList.toggle('list-group-item-success');
          todoItem.status = !todoItem.status;
          dateBasePush(todoItem.id, todoItem.status);
          saveDealToLocalStorage(storageKey);
        });

        todoItem.deleteButton.addEventListener('click', function() {
          if (confirm('Вы уверены?')) {
            todoItem.item.remove();
            deal = deal.filter(function(dealItem) {
              return dealItem.id !== todoItem.id;
            });
            saveDealToLocalStorage(storageKey);
          }
        });

        todoList.appendChild(todoItem.item);
      });
    }
  }

  window.createTodoApp = createTodoApp;
})();
