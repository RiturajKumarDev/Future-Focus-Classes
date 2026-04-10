export const addItemToSever = async (task, date) => {
    const response = await fetch("http://localhost:3000/api/todo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ task, date }),
    });
    const item = await response.json();
    return mapServerItemToLocalItem(item);
}

export const getItemToServer = async () => {
    const response = await fetch("http://localhost:3000/api/todo/getTodoItems");
    const items = await response.json();
    return items.map(mapServerItemToLocalItem);
}

export const markItemCompletedOnServer = async (id) => {
    const response = await fetch(`http://localhost:3000/api/todo/${id}/completed`, {
        method: "PUT",
    });
    const item = await response.json();
    return mapServerItemToLocalItem(item);
}

export const deleteItemFromServer = async (id) => {
    await fetch(`http://localhost:3000/api/todo/${id}`, {
        method: "DELETE",
    });
    return id;
}


const mapServerItemToLocalItem = (serverItem) => {
    return {
        id: serverItem._id,
        name: serverItem.task,
        date: formateDate(serverItem.date),
        completed: serverItem.completed,
        createdAt: serverItem.createdAt,
        updatedAt: serverItem.updatedAt,
    };
}

const formateDate = (isoDate) => {
    const date = new Date(isoDate);
    const formatted =
        date.getDate().toString().padStart(2, "0") + "/" +
        (date.getMonth() + 1).toString().padStart(2, "0") + "/" +
        date.getFullYear();

    return formatted;
}