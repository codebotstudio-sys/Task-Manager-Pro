import TaskForm from "./components/TaskForm/TaskForm";
import FilterBar from "./components/FilterBar/FilterBar";
import TaskList from "./components/TaskList/TaskList";
import styles from "./App.module.css";

function App() {

  return (
    <div className={styles.AppContainer}>
      <h1>Task Manager Pro</h1>
      <TaskForm />
      <FilterBar />
      <TaskList />
    </div>
  )
}

export default App
