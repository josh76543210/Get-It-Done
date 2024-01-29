import { useState } from "react";
import "./App.css";

export default function App() {
  const starterItems = [
    { id: "1", text: "Take out garbage", completed: false, editing: false },
    { id: "2", text: "Do homework", completed: false, editing: false },
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

  function handleItemClick(e) {
    // update completed property of clicked item
    setItems((items) =>
      items.map((item) =>
        item.id === e.target.parentNode.id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  }

  function handleClearDone() {
    // delete items that are completed
    setItems(items.filter((item) => !item.completed));
  }

  function handleEditItem(e) {
    // update editing property of clicked item
    setItems((items) =>
      items.map((item) =>
        item.id === e.target.dataset.identify
          ? { ...item, editing: true }
          : item
      )
    );
  }

  function handleCancelEdit(e) {
    // update editing property of clicked item
    setItems((items) =>
      items.map((item) =>
        item.id === e.target.dataset.identify
          ? { ...item, editing: false }
          : item
      )
    );
  }

  function handleOverwrite(e) {
    // get new text property
    const newText = e.target.parentNode.querySelector("input").value;
    // update editing and text property of clicked item
    setItems((items) =>
      items.map((item) =>
        item.id === e.target.dataset.identify
          ? { ...item, text: newText, editing: false }
          : item
      )
    );
  }

  function handleDeleteItem(e) {
    // delete this item
    setItems(items.filter((item) => item.id !== e.target.dataset.identify));
  }

  function handleCopyItem(e) {
    //generate random id
    const uuid = crypto.randomUUID();
    // get text property
    const copyText = e.target.parentNode.querySelector("p").innerText;
    console.log(copyText);
    // add new item
    setItems([
      ...items,
      { id: uuid, text: copyText, completed: false, editing: false },
    ]);
  }

  return (
    <div className="App">
      <h1>Get It Done!</h1>
      <ToDoList
        items={items}
        onClickItem={handleItemClick}
        onEditItem={handleEditItem}
        onCancelEdit={handleCancelEdit}
        onOverwrite={handleOverwrite}
        onDeleteItem={handleDeleteItem}
        onCopyItem={handleCopyItem}
      />
      <DoneList
        items={items}
        onClickItem={handleItemClick}
        onClearDone={handleClearDone}
      />
      <AddItemForm onAddNewItem={addNewItem} />
    </div>
  );
}

function ToDoList({
  items,
  onClickItem,
  onEditItem,
  onCancelEdit,
  onOverwrite,
  onDeleteItem,
  onCopyItem,
}) {
  return (
    <div className="todo-list-container">
      <ul>
        {items
          .filter((item) => !item.completed)
          .map((item) =>
            item.editing ? (
              <li key={item.id} id={item.id}>
                <input type="text" />
                <button onClick={onOverwrite} data-identify={item.id}>
                  Overwrite
                </button>
                <button onClick={onCancelEdit} data-identify={item.id}>
                  Cancel
                </button>
              </li>
            ) : (
              <li key={item.id} id={item.id}>
                <p onClick={onClickItem}>{item.text}</p>
                <button onClick={onEditItem} data-identify={item.id}>
                  Edit
                </button>
                <button onClick={onCopyItem} data-identify={item.id}>
                  Copy
                </button>
                <button onClick={onDeleteItem} data-identify={item.id}>
                  Delete
                </button>
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
            <li key={item.id} id={item.id}>
              <p onClick={onClickItem}>{item.text} </p>
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
