const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.document = dom.window.document;


let posts = [];
let users = [];
let currentUserId;

// Load posts from API
function loadPosts() {
    document.getElementById("loader").style.display = "block";
    fetch("https://jsonplaceholder.typicode.com/posts")
        .then((response) => response.json())
        .then((data) => {
            posts = data;
            loadUsers();
        })
        .catch((error) => console.error(error));
}

// Load users from API
function loadUsers() {
    fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) => response.json())
        .then((data) => {
            users = data;
            renderPosts();
        })
        .catch((error) => console.error(error));
}

// Render posts on the page
function renderPosts() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("posts-list").innerHTML = "";
    for (let post of posts) {
        const user = users.find((u) => u.id === post.userId);
        const li = document.createElement("li");
        li.classList.add("post");
        if (post.isImportant) {
            li.classList.add("important");
        }
        li.innerHTML = `
      <div class="title">${post.title}</div>
      <div class="body">${post.body}</div>
      <div class="user">By: ${user.name} (${user.email})</div>
      <div class="actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
        <button class="important-btn">${post.isImportant ? "Unmark Important" : "Mark Important"}</button>
      </div>
    `;
        const editBtn = li.querySelector(".edit-btn");
        const deleteBtn = li.querySelector(".delete-btn");
        const importantBtn = li.querySelector(".important-btn");
        editBtn.addEventListener("click", () => showPostModal(post));
        deleteBtn.addEventListener("click", () => deletePost(post.id));
        importantBtn.addEventListener("click", () => toggleImportant(post.id));
        document.getElementById("posts-list").appendChild(li);
    }
}

// Show modal for adding/editing post
function showPostModal(post) {
    currentUserId = post ? post.userId : null;
    document.getElementById("modal-title").textContent = post ? "Edit Post" : "Add Post";
    document.getElementById("post-title").value = post ? post.title : "";
    document.getElementById("post-body").value = post ? post.body : "";
    document.getElementById("post-user").value = post ? post.userId : "";
    document.getElementById("submit-btn").textContent = post ? "Save Changes" : "Add Post";
    document.getElementById("modal").style.display = "block";
}

// Hide modal for adding/editing post
function hidePostModal() {
    document.getElementById("modal").style.display = "none";
    document.getElementById("post-form").reset();
}

// Add new post
function addPost(post) {
    document.getElementById("loader").style.display = "block";
    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(post),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            posts.push(data);
            renderPosts();
            hidePostModal();
        })
        .catch((error) => console.error(error))
        .finally(() => (document.getElementById("loader").style.display = "none"));
}

// Update existing post
function updatePost(post) {
    document.getElementById("loader").style.display = "block";
    fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}`, {
        method: "PUT",
        body: JSON.stringify(post),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            const index = posts.findIndex((p) => p.id === data.id);
            posts[index] = data;
            renderPosts();
            hidePostModal();
        })
        .catch((error) => console.error(error))
        .finally(() => (document.getElementById("loader").style.display = "none"));
}

// Delete post
function deletePost(postId) {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (confirmed) {
        document.getElementById("loader").style.display = "block";
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: "DELETE",
        })
            .then(() => {
                posts = posts.filter((p) => p.id !== postId);
                renderPosts();
            })
            .catch((error) => console.error(error))
            .finally(() => (document.getElementById("loader").style.display = "none"));
    }
}

// Toggle important flag for post
function toggleImportant(postId) {
    const index = posts.findIndex((p) => p.id === postId);
    posts[index].isImportant = !posts[index].isImportant;
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
}

// Handle form submission
document.querySelector("modle").addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("post-title").value.trim();
    const body = document.getElementById("post-body").value.trim();
    const userId = document.getElementById("post-user").value;
    if (!title || !body || !userId) {
        alert("Please fill in all fields.");
        return;
    }
    const post = {
        title,
        body,
        userId: parseInt(userId),
    };
    if (currentUserId) {
        post.id = currentUserId;
        updatePost(post);
    } else {
        addPost(post);
    }
});

// Handle cancel button click
 document.getElementById("cancel-btn").addEventListener("click", () => hidePostModal());

// Handle add post button click
document.getElementById("add-post-btn").addEventListener("click", () => showPostModal());

// Load posts on page load
loadPosts();

// Load theme from local storage
const theme = localStorage.getItem("theme");
if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    document.getElementById("theme-switch").checked = true;
}

// Handle theme switch
document.getElementById("theme-switch").addEventListener("change", () => {
    if (document.getElementById("theme-switch").checked) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
        localStorage.removeItem("theme");
    }
});
