const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.document = dom.window.document;

const postsList = document.getElementById("posts-list");
const loader = document.getElementById("loader");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const postForm = document.getElementById("post-form");
const postTitle = document.getElementById("post-title");
const postBody = document.getElementById("post-body");
const postUser = document.getElementById("post-user");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const addPostBtn = document.getElementById("add-post-btn");
const themeSwitch = document.getElementById("theme-switch");