import TaskForm from "./components/TaskForm/TaskForm";
import FilterBar from "./components/FilterBar/FilterBar";
import TaskList from "./components/TaskList/TaskList";
import styles from "./App.module.css";
import SortControls from "./components/SortControls/SortControls";
import useNotifications from "./hooks/useNotifications";

function App() {
  useNotifications();

  return (
    <div className={styles.AppContainer}>
      <h1>Task Manager Pro</h1>
      <TaskForm />
      <FilterBar />
      <SortControls />
      <TaskList />
    </div>
  )
}

export default App
