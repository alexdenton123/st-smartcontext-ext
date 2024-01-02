import { getContext, getApiUrl, doExtrasFetch } from "../../../extensions.js";
import { getCurrentChatId } from "../../../../script.js"; // Ensure correct path
import { addMessages, onPurgeClick } from '../Extension-ChromaDB/index.js';
import { registerSlashCommand } from "../../../slash-commands.js";

async function forceRefreshChatInDB() {
    const context = getContext();
    const chat = context.chat;
    const currentChatId = getCurrentChatId();

    if (!checkChatId(currentChatId)) {
        console.error("Invalid chat ID.");
        return;
    }

    // Purge the existing chat messages from ChromaDB
    await onPurgeClick();

    // Add the entire chat history back into ChromaDB
    if (chat.length > 0) {
        await addMessages(currentChatId, chat);
        console.log("Chat history has been refreshed in the database.");
    } else {
        console.log("No messages to add.");
    }
}

registerSlashCommand("forcerefreshchatindb", forceRefreshChatInDB, [], "Forces refresh of ChromaDB", true, true);
