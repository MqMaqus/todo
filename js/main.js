(function () {
  //DOM változók:
  //Date parts:
  const bodyDay = document.querySelector(".body__day");
  const bodyDate = document.querySelector(".body__date");
  const todoAddBtn = document.querySelector(".button__add");
  const todoInput = document.querySelector(".input__todo");
  const todoListPending = document.querySelector(".todo__list--pending");
  const todoNumber = document.querySelector(".todo__number");
  const todoPercentage = document.querySelector(".completed__percentage");

  //Mock data:
  let todos = [
    //Mock data:
    // { title: "Lunch", content: "Lunch with my friends" },
    // { title: "Lunch", content: "Lunch with my friends" },
    // { title: "Lunch", content: "Lunch with my friends" },
  ];

  //Adatbázis-műveletek: négy fő művelet: create, read, update, delete
  //Localstorage handler objektum
  const localDB = {
    //lesznek metódusai:
    //1. metódus - elmenti az adatokat a localstorage-ba. A metódus két értéket vár: az adat kulcsát és értékét. Ez egyszerre a create és update műveletet is elvégzi. A value-t JSON-nel stringgé kell alakítani. A JSON arra való, hogy az adatokat string formátumban letárolja. Ez könnyen küldhető és fogadható (a fogadó pedig a stringből visszaalakítja olyan adatszerkezetté, amivel már műveleteket lehet elvégezni). A JSON-stringből visszaalakítani a JSON.parse() függvénnyel lehet.
    setItem(key, value) {
      value = JSON.stringify(value);
      localStorage.setItem(key, value);
    },
    getItem(key) {
      const value = localStorage.getItem(key);
      //Ha üres a tömb (nincs todo item), akkor null a visszatérési érték, egyebekben pedig a letárolt JSON string.
      if (!value) {
        return null;
      }
      return JSON.parse(value);
    },
    removeItem(key) {
      localStorage.removeItem(key);
    },
  };

  //Konkrét adatok mentése -- JSON-ös metódusom
  //localDB.setItem("todos", todos);

  //Konkrét adatok visszaolvasása:
  //localDB.getItem("todos");

  //Konkrét adatok törlése:
  //localDB.removeItem("todos");

  //Initialize application:
  const init = () => {
    showDate();
    setEventListeners();
    loadExistingTodos();
    calculateTodos();
  };

  //Load existing todos.
  const loadExistingTodos = () => {
    const savedTodos = localDB.getItem("todos");

    if (savedTodos) {
      todos = savedTodos;
    }
    if (todos && Array.isArray(todos)) {
      todos.forEach((todo) => showTodo(todo));
    }
  };

  //Dátumbeállító függvény
  const showDate = () => {
    const currentDate = new Date();
    //Dátum és a nap neve kell
    //Nap neve és kiíratása:
    //const dayName = currentDate.getDay();
    //Dátum kiíratása:
    const optionsDay = {
      weekday: "long",
    };
    const optionsDate = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    bodyDate.textContent = currentDate.toLocaleString("en-UK", optionsDate);
    bodyDay.textContent = currentDate.toLocaleString("en-UK", optionsDay);
  };

  //Set eventListeners
  const setEventListeners = () => {
    todoAddBtn.addEventListener("click", addNewTodo);
  };

  //Add new todo and save it in DB
  const addNewTodo = () => {
    const todoText = todoInput.value;
    if (todoText === "") {
      alert("Please type a todo.");
      return;
    }
    const todo = {
      text: todoText,
      done: false,
    };
    todos.push(todo);
    localDB.setItem("todos", todos);
    showTodo(todo);
    todoInput.value = "";
  };

  //Calculating pending and completed todos
  const calculateTodos = () => {
    let all = localDB.getItem("todos").length;
    let done = 0;
    todoNumber.textContent = all;
    //Check if todo is completed
    const checkIfCompleted = () => {
      localDB.getItem("todos").forEach((element) => {
        if (element.done == true) {
          done++;
        }
      });
    };
    checkIfCompleted();
    const completedTodosPercentage = Math.round((done / all) * 100);
    todoPercentage.textContent = completedTodosPercentage;
  };

  //Make new todo appear in list
  const showTodo = (todo) => {
    const todoItem = document.createElement("div");
    todoListPending.appendChild(todoItem);
    todoItem.innerHTML = `<input type="checkbox" class="check"><span>${todo.text}</span><button class="btn__delete">
    <i class="fa fa-trash-o" aria-hidden="true"></i>
  </button>`;
    todoItem.classList.add("todo", "todo--pending");
  };

  init();

  //Delete item from pending list and DB
  const deleteFromPending = (todo) => {
    const deleteButton = document.querySelectorAll(".btn__delete");
    deleteButton.forEach((element) => {
      element.addEventListener("click", (e) => {
        e.currentTarget.parentNode.remove();
      });
    });
  };
  deleteFromPending();

  //Change done status

  const checkboxes = document.querySelectorAll(".check");
  const changeDoneStatus = () => {
    for (const iterator of checkboxes) {
      iterator.addEventListener("change", (e) => {
        if (iterator.checked) {
          e.currentTarget.parentNode.classList.add("hidden");
        } else {
          e.currentTarget.parentNode.classList.remove("hidden");
        }
      });
    }

    // checkboxes.forEach((element) => {
    //   element.addEventListener("change", (e) => {
    //     if (element.checked) {
    //       console.log(localDB.getItem("todos")[0]);
    //     }
    //   });
    // });
    console.log(checkboxes);
    console.log(localDB.getItem("todos"));
  };
  changeDoneStatus();
})();
