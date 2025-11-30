import styles from "./SortControls.module.css"
import useTaskStore from "../../Store/taskStore"

export default function SortControls() {
    const sortBy = useTaskStore((state) => state.sortBy); // Obtenemos el valor
    const sortOrder = useTaskStore((state) => state.sortOrder); // Obtenemos el valor
    const setSortBy = useTaskStore((state) => state.setSortBy); // funcion para establecer el valor
    const toggleSortOrder = useTaskStore((state) => state.toggleSortOrder); // funcion para alternar valor

    return (
        <div className={styles.sortControls}>
            <label>Ordenar por:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="none">Sin ordenar</option>
                <option value="date">Fecha Vencimiento</option>
                <option value="priority">Prioridad</option>
                <option value="alphabetical">Alfabetico (A-Z)</option>
            </select>

            {sortBy !== "none" && (
                <button onClick={toggleSortOrder}>
                    {sortOrder === "asc" ? "↑ Ascendente" : "↓ Descendente"}
                </button>
            )}
        </div>
    );
}