import { useState, useEffect } from "react";
import "./reset.css";
import "./App.css";

// use local storage
function useStickyState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export default function App() {
  const starterItems = [
    { id: "1", text: "Take out garbage", completed: false, editing: false },
    { id: "2", text: "Do homework", completed: false, editing: false },
    { id: "3", text: "Bake a cake", completed: true, editing: false },
    { id: "4", text: "Walk the dog", completed: false, editing: false },
    { id: "5", text: "Go shopping", completed: true, editing: false },
    { id: "6", text: "Clean room", completed: true, editing: false },
  ];

  // const [items, setItems] = useState(starterItems);
  const [items, setItems] = useStickyState(starterItems, "items");

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
    const newText = e.target.parentNode.parentNode.querySelector("input").value;
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
    const copyText =
      e.target.parentNode.parentNode.querySelector("p").innerText;
    // find index of current item
    const curIndex = items.indexOf(
      ...items.filter((item) => item.id === e.target.parentNode.parentNode.id)
    );
    // add new item
    setItems([
      ...items.slice(0, curIndex + 1),
      { id: uuid, text: copyText, completed: false, editing: false },
      ...items.slice(curIndex + 1),
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
      <AddItemForm onAddNewItem={addNewItem} />
      <DoneList
        items={items}
        onClickItem={handleItemClick}
        onClearDone={handleClearDone}
      />
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
  return items.filter((item) => !item.completed).length === 0 ? (
    <p className="no-items-message">
      No items currently on your list. Add an item using the form below.
    </p>
  ) : (
    <div className="todo-list-container">
      <ul>
        {items
          .filter((item) => !item.completed)
          .map((item) =>
            item.editing ? (
              <li key={item.id} id={item.id}>
                <input type="text" defaultValue={item.text} autoFocus />
                <div className="edit-btns">
                  <button onClick={onOverwrite} data-identify={item.id}>
                    Overwrite
                  </button>
                  <button onClick={onCancelEdit} data-identify={item.id}>
                    Cancel
                  </button>
                </div>
              </li>
            ) : (
              <li key={item.id} id={item.id}>
                <p onClick={onClickItem} tabIndex="0">
                  {item.text}
                </p>
                <div className="btns">
                  <button onClick={onEditItem} data-identify={item.id}>
                    Edit
                  </button>
                  <button onClick={onCopyItem} data-identify={item.id}>
                    Copy
                  </button>
                  <button onClick={onDeleteItem} data-identify={item.id}>
                    Delete
                  </button>
                </div>
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
      <h2>Already done:</h2>
      <ul>
        {items
          .filter((item) => item.completed)
          .map((item) => (
            <li key={item.id} id={item.id}>
              <p onClick={onClickItem} tabIndex="0">
                {item.text}{" "}
              </p>
            </li>
          ))}
      </ul>
      {items.filter((item) => item.completed).length === 0 ? (
        <p>
          You currently have no finished items. Check off items on the above
          list by clicking on them and they will be added to this list.
        </p>
      ) : (
        <button onClick={onClearDone}>Clear already done</button>
      )}
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
    <form action="#" onSubmit={handleFormSubmit} className="add-item-form">
      <h2>New item:</h2>
      <input type="text" name="todo-input" id="todo-input" />
      <button type="submit">Add item</button>
    </form>
  );
}
