import { useState } from "react";
import useTaskStore from "../../Store/taskStore.js";
import styles from "./TaskItem.module.css";

export default function TaskItem({ task }) {
    // Safety check: if task is undefined/null, don't render anything
    if (!task) return null;

    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Estados para la edición (con valores por defecto seguros)
    const [editTitle, setEditTitle] = useState(task.title || "");
    const [editDescription, setEditDescription] = useState(task.description || "");
    const [editPriority, setEditPriority] = useState(task.priority || "medium");
    const [editCategory, setEditCategory] = useState(task.category || "personal");
    const [editDueDate, setEditDueDate] = useState(task.dueDate || "");

    const toggleTask = useTaskStore((state) => state.toggleTask);
    const deleteTask = useTaskStore((state) => state.deleteTask);
    const updateTask = useTaskStore((state) => state.updateTask);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#6b7280';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString || typeof dateString !== 'string') return null;
        try {
            // Crear la fecha usando las partes locales para evitar problemas de zona horaria
            const parts = dateString.split('-');
            if (parts.length !== 3) return dateString; // Fallback si el formato no es YYYY-MM-DD

            const [year, month, day] = parts;
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            console.error("Error formatting date:", e);
            return dateString;
        }
    };

    const handleSave = () => {
        updateTask(task.id, {
            title: editTitle,
            description: editDescription,
            priority: editPriority,
            category: editCategory,
            dueDate: editDueDate
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Revertir cambios
        setEditTitle(task.title || "");
        setEditDescription(task.description || "");
        setEditPriority(task.priority || "medium");
        setEditCategory(task.category || "personal");
        setEditDueDate(task.dueDate || "");
        setIsEditing(false);
    };

    const isTaskDueSoon = (dueDate) => {
        if (!dueDate) return false;
        const now = new Date();
        const due = new Date(dueDate);
        const hoursUntilDue = (due - now) / (1000 * 60 * 60);
        return hoursUntilDue > 0 && hoursUntilDue <= 24;
    };

    const isDueSoon = isTaskDueSoon(task.dueDate);

    if (isEditing) {
        return (
            <div className={styles.taskItemContainer}>
                <div className={styles.editForm}>
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className={styles.editInput}
                        placeholder="Task Title"
                    />
                    <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className={styles.editTextarea}
                        placeholder="Description"
                    />
                    <div className={styles.editRow}>
                        <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)} className={styles.editSelect}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className={styles.editSelect}>
                            <option value="personal">Personal</option>
                            <option value="work">Work</option>
                            <option value="study">Study</option>
                            <option value="other">Other</option>
                        </select>
                        <input
                            type="date"
                            value={editDueDate}
                            onChange={(e) => setEditDueDate(e.target.value)}
                            className={styles.editDate}
                        />
                    </div>
                    <div className={styles.editActions}>
                        <button onClick={handleSave} className={styles.saveBtn}>Save</button>
                        <button onClick={handleCancel} className={styles.cancelBtn}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.taskItemContainer} ${isDueSoon ? styles.urgent : ''}`}>
            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
            />

            <div className={styles.taskContent} onClick={() => setIsExpanded(!isExpanded)}>
                <h3>
                    {isDueSoon && <span className={styles.urgentIcon}>⚠️</span>}
                    {task.title}
                </h3>

                {isExpanded && (
                    <div className={styles.taskDetails}>
                        {task.description && (
                            <p className={styles.description}>
                                <strong>Description:</strong> {task.description}
                            </p>
                        )}

                        <div className={styles.metadata}>
                            <span
                                className={styles.priority}
                                style={{ backgroundColor: getPriorityColor(task.priority) }}
                            >
                                {task.priority}
                            </span>

                            <span className={styles.category}>
                                🏷️ {task.category}
                            </span>

                            {task.dueDate && (
                                <span className={styles.dueDate}>
                                    📅 {formatDate(task.dueDate)}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                <button onClick={() => setIsEditing(true)} className={styles.editBtn}>Edit</button>
                <button onClick={() => deleteTask(task.id)} className={styles.deleteBtn}>Delete</button>
            </div>
        </div>
    );
}