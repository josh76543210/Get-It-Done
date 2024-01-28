import { useState } from "react";
import "./App.css";

export default function App() {
  const starterItems = [
    { id: "1", text: "Take out garbage", completed: false, editing: false },
    { id: "2", text: "Do homework", completed: false, editing: true },
    { id: "3", text: "Bake a cake", completed: true, editing: false },
    { id: "4", text: "Walk the dog", completed: false, editing: false },
  ];

  const [items, setItems] = useState(starterItems);

  function addNewItem(itemText) {
    //generate random id
    const uuid = crypto.randomUUID();

    setItems([
      ...items,
      { id: uuid, text: itemText, completed: false, editing: false },
    ]);
  }

  function HandleItemClick(e) {
    // updated completed property of clicked item
    setItems((items) =>
      items.map((item) =>
        item.id === e.target.id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  function HandleClearDone() {
    // delete items that are completed
    setItems(items.filter((item) => !item.completed));
  }

  return (
    <div className="App">
      <h1>Get It Done!</h1>
      <ToDoList items={items} onClickItem={HandleItemClick} />
      <DoneList
        items={items}
        onClickItem={HandleItemClick}
        onClearDone={HandleClearDone}
      />
      <AddItemForm onAddNewItem={addNewItem} />
    </div>
  );
}

function ToDoList({ items, onClickItem }) {
  return (
    <div className="todo-list-container">
      <ul>
        {items
          .filter((item) => !item.completed)
          .map((item) =>
            item.editing ? (
              <li>
                <input type="text" />
                <button data-identify={item.id}>Overwrite</button>
                <button data-identify={item.id}>Cancel</button>
              </li>
            ) : (
              <li onClick={onClickItem} key={item.id} id={item.id}>
                {item.text}
                <button data-identify={item.id}>Edit</button>
                <button data-identify={item.id}>Copy</button>
                <button data-identify={item.id}>Delete</button>
              </li>
            )
          )}
      </ul>
    </div>
  );
}

function DoneList({ items, onClickItem, onClearDone }) {
  return (
    <div className="done-list-container">
      <h2>Already done</h2>
      <ul>
        {items
          .filter((item) => item.completed)
          .map((item) => (
            <li onClick={onClickItem} key={item.id} id={item.id}>
              {item.text}
            </li>
          ))}
      </ul>
      <button onClick={onClearDone}>Clear already done</button>
    </div>
  );
}

function AddItemForm({ onAddNewItem }) {
  function handleFormSubmit(e) {
    e.preventDefault();
    const todoInput = document.querySelector("#todo-input");
    onAddNewItem(todoInput.value);
    todoInput.value = "";
  }

  return (
    <form action="#" onSubmit={handleFormSubmit}>
      <input type="text" name="todo-input" id="todo-input" />
      <button type="submit">Add item</button>
    </form>
  );
}
