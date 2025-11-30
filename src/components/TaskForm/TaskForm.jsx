import useTaskStore from "../../Store/taskStore.js";
import { useState } from "react";
import styles from "./TaskForm.module.css";

export default function TaskForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [category, setCategory] = useState("personal");
    const [dueDate, setDueDate] = useState("");

    const addTask = useTaskStore((state) => state.addTask);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert("Please enter a title");
            return;
        }
        addTask({
            title,
            description,
            priority,
            category,
            dueDate,
        });
        // reset form
        setTitle("");
        setDescription("");
        setPriority("medium");
        setCategory("personal");
        setDueDate("");
    };

    return (
        <form onSubmit={handleSubmit} className={styles.taskForm}>
            <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>Task Title *</label>
                <input
                    id="title"
                    type="text"
                    placeholder="Enter task title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.input}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>Description</label>
                <textarea
                    id="description"
                    placeholder="Add details about your task..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles.textarea}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="priority" className={styles.label}>Priority</label>
                <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={styles.select}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.label}>Category</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={styles.select}
                >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="study">Study</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="dueDate" className={styles.label}>Due Date</label>
                <input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={styles.inputDate}
                />
            </div>

            <button type="submit" className={styles.submitButton}>
                Add Task
            </button>
        </form>
    );
}
