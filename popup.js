document.getElementById("add-bookmark").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.bookmarks.create({
    title: tab.title,
    url: tab.url
  }, (bookmark) => {
    alert(`Bookmark added: ${bookmark.title}`);
    displayBookmarks();
  });
});

async function displayBookmarks() {
  const bookmarksList = document.getElementById("bookmarks-list");
  bookmarksList.innerHTML = "";

  const bookmarks = await getBookmarks();
  bookmarks.forEach((bookmark) => {
    const listItem = document.createElement("li");
    listItem.textContent = bookmark.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteBookmark(bookmark.id));

    listItem.appendChild(deleteBtn);
    bookmarksList.appendChild(listItem);
  });
}

async function getBookmarks() {
  return new Promise((resolve) => {
    chrome.bookmarks.getTree((bookmarks) => {
      const flatList = [];
      const flatten = (nodes) => {
        nodes.forEach((node) => {
          if (node.url) flatList.push(node);
          if (node.children) flatten(node.children);
        });
      };
      flatten(bookmarks);
      resolve(flatList);
    });
  });
}

function deleteBookmark(id) {
  chrome.bookmarks.remove(id, () => {
    alert("Bookmark deleted");
    displayBookmarks();
  });
}

displayBookmarks();
