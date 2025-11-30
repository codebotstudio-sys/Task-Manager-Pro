import { useEffect } from "react";
import useTaskStore from "../Store/taskStore";

export default function useNotifications() {
    const tasks = useTaskStore((state) => state.tasks);
    // Solicitar permiso para notificaciones
    const requestPermission = async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    };

    // Verificar si una tarea vence pronto < 24hs
    const isTaskDueSoon = (dueDate) => {
        if (!dueDate) return false;
        const now = new Date();
        const due = new Date(dueDate);
        const hoursUntilDue = (due - now) / (1000 * 60 * 60);

        return hoursUntilDue > 0 && hoursUntilDue <= 24;
    };

    const sendNotification = (task) => {
        if (Notification.permission === 'granted') {
            new Notification('⚠️ Tarea Próxima a Vencer', {
                body: `La tarea "${task.title}" vence pronto.`,
                icon: 'favicon.ico',
            });
        }
    };

    // Verificar tareas al montar y cada hora
    useEffect(() => {
        requestPermission();
        const checkTasks = () => {
            tasks.forEach(task => {
                if (!task.completed && isTaskDueSoon(task.dueDate)) {
                    sendNotification(task);
                }
            });
        }
        checkTasks();
        const interval = setInterval(checkTasks, 60 * 60 * 1000); // cada hora
        return () => clearInterval(interval);
    }, [tasks]);

}