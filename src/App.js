import "./App.css";

export default function App() {
  const starterItems = [
    { id: "1", text: "Take out garbage", completed: false, editing: false },
    { id: "2", text: "Do homework", completed: false, editing: false },
    { id: "3", text: "Bake a cake", completed: true, editing: false },
    { id: "3", text: "Walk the dog", completed: false, editing: false },
  ];

  return (
    <div className="App">
      <h1>Get It Done!</h1>
      <ToDoList items={starterItems} />
      <DoneList items={starterItems} />
      <AddItemForm />
    </div>
  );
}

function ToDoList({ items }) {
  return (
    <div className="todo-list-container">
      <ul>
        {items
          .filter((item) => !item.completed)
          .map((item) => (
            <li>{item.text}</li>
          ))}
      </ul>
    </div>
  );
}

function DoneList({ items }) {
  return (
    <div className="todo-list-container">
      <h2>Already done</h2>
      <ul>
        {items
          .filter((item) => item.completed)
          .map((item) => (
            <li>{item.text}</li>
          ))}
      </ul>
    </div>
  );
}

function AddItemForm() {
  return (
    <form action="#">
      <input type="text" name="todo-input" id="todo-input" />
      <button type="submit">Submit</button>
    </form>
  );
}
