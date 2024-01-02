import { getContext, getApiUrl, doExtrasFetch } from "../../../extensions.js";
import { getCurrentChatId } from "../../../../script.js"; // Ensure correct path
import { addMessages, onPurgeClick } from '../Extension-ChromaDB/index.js';
import { registerSlashCommand } from "../../../slash-commands.js";

function checkChatId(chat_id) {
    if (!chat_id || chat_id.trim() === '') {
        toastr.error('Please select a character and try again.');
        return false;
    }
    return true;
}


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
function forceRefreshChatInDBUi() {
    $('#extensionsMenu').prepend(`
        <div id="chromadb-force-reload-menu-item" class="list-group-item flex-container flexGap5">
            <div id="chromadb-force-reload-menu-item" class="extensionsMenuExtensionButton fa-regular fa-square-check"/></div>
            Force ChromaDB Refresh
        </div>`);
    $('#chromadb-force-reload-menu-item').attr('title', 'Trigger ChromaDB Refresh').on('click', forceRefreshChatInDB);
}


jQuery(async () => {
        forceRefreshChatInDBUi();
        registerSlashCommand("forceRefreshChatInDB", forceRefreshChatInDB, [], "- Forces refresh of ChromaDB", true, true);
        console.log(`st-smartcontext-ext loaded`);
});
