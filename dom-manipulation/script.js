const quotes = [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    category: "Motivation",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    category: "Success",
  },
];

const quoteArea = document.getElementById("quoteDisplay");
const showButton = document.getElementById("newQuote");

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteArea.innerHTML = `
  <p>${quote.text}</p>
  <small>category: ${quote.category}</small>`;
}

showButton.addEventListener("click", showRandomQuote);

function createAddQuoteForm() {
  const form = document.createElement("form");
  form.id = "addQuoteForm";

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Ente a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Add Quote";
  submitBtn.setAttribute("onclick", "addQuote()");

  form.appendChild(textInput);
  form.appendChild(categoryInput);
  form.appendChild(submitBtn);

  document.body.appendChild(form);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const newQuote = {
      text: textInput.value.trim(),
      category: categoryInput.value.trim(),
    };
    if (newQuote.text && newQuote.category) {
      quotes.push(newQuote);
      textInput.value = "";
      categoryInput.value = "";
      alert("Quote added!");
    }
  });
}

createAddQuoteForm();

function saveQuotesToLocalStorage() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotesFromLocalStorage() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    try {
      const parsedQuotes = JSON.parse(storedQuotes);
      if (Array.isArray(parsedQuotes)) {
        quotes.length = 0;
        quotes.push(...parsedQuotes);
      }
    } catch (e) {}
  }
}

document.getElementById("addQuoteForm").addEventListener("submit", function () {
  saveQuotesToLocalStorage();
});

loadQuotesFromLocalStorage();

function showRandomQuoteWithSession() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteArea.innerHTML = `
  <p>${quote.text}</p>
  <small>category: ${quote.category}</small>`;
  sessionStorage.setItem("lastViewedQuote", randomIndex);
}

showButton.removeEventListener("click", showRandomQuote);
showButton.addEventListener("click", showRandomQuoteWithSession);

const lastViewed = sessionStorage.getItem("lastViewedQuote");
if (lastViewed !== null && quotes[lastViewed]) {
  const quote = quotes[lastViewed];
  quoteArea.innerHTML = `
  <p>${quote.text}</p>
  <small>category: ${quote.category}</small>`;
}

const exportBtn = document.getElementById("exportQuotes");
exportBtn.addEventListener("click", function () {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
});

const importInput = document.getElementById("importFile");
exportBtn.insertAdjacentElement("afterend", importInput);

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

const categoryDropdown = document.getElementById("categoryFilter");
quoteArea.insertAdjacentElement("beforebegin", categoryDropdown);

function getUniqueCategories() {
  const categories = quotes.map((q) => q.category.trim()).filter(Boolean);
  return Array.from(new Set(categories));
}

function populateCategories(selectedCategory = null) {
  const uniqueCategories = getUniqueCategories();
  categoryDropdown.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (selectedCategory && selectedCategory === cat) {
      option.selected = true;
    }
    categoryDropdown.appendChild(option);
  });
}

function filterQuotes() {
  const selected = categoryDropdown.value;
  let filtered = quotes;
  if (selected !== "all") {
    filtered = quotes.filter((q) => q.category === selected);
  }
  if (filtered.length === 0) {
    quoteArea.innerHTML = "<p>No quotes found for this category.</p>";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];
  quoteArea.innerHTML = `
    <p>${quote.text}</p>
    <small>category: ${quote.category}</small>`;
  sessionStorage.setItem("lastViewedQuote", quotes.indexOf(quote));
}

categoryDropdown.addEventListener("change", function () {
  filterQuotes();
  localStorage.setItem("lastSelectedCategory", categoryDropdown.value);
});

function restoreLastSelectedCategory() {
  const lastCategory = localStorage.getItem("lastSelectedCategory");
  populateCategories(lastCategory);
  if (lastCategory && lastCategory !== "all") {
    categoryDropdown.value = lastCategory;
    filterQuotes();
  } else {
    populateCategories();
  }
}

function saveQuotes() {
  saveQuotesToLocalStorage();
  populateCategories(categoryDropdown.value);
}

const originalAddQuoteFormHandler =
  document.getElementById("addQuoteForm").onsubmit;
document.getElementById("addQuoteForm").addEventListener("submit", function () {
  populateCategories(categoryDropdown.value);
});

const originalImportHandler = importFromJsonFile;
importInput.addEventListener("change", function (event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      }
    } catch (e) {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
});

restoreLastSelectedCategory();

const MOCK_API_URL = "https://jsonplaceholder.typicode.com/posts";

function showNotification(message) {
  let notif = document.getElementById("quoteNotif");
  if (!notif) {
    notif = document.createElement("div");
    notif.id = "quoteNotif";
    notif.style.position = "fixed";
    notif.style.bottom = "20px";
    notif.style.right = "20px";
    notif.style.background = "#222";
    notif.style.color = "#fff";
    notif.style.padding = "10px 20px";
    notif.style.borderRadius = "5px";
    notif.style.zIndex = 1000;
    document.body.appendChild(notif);
  }
  notif.textContent = message;
  notif.style.display = "block";
  setTimeout(() => {
    notif.style.display = "none";
  }, 4000);
}

function findConflicts(localArr, serverArr) {
  const localSet = new Set(localArr.map((q) => q.text + "|" + q.category));
  const serverSet = new Set(serverArr.map((q) => q.text + "|" + q.category));
  return {
    onlyLocal: localArr.filter(
      (q) => !serverSet.has(q.text + "|" + q.category)
    ),
    onlyServer: serverArr.filter(
      (q) => !localSet.has(q.text + "|" + q.category)
    ),
    overlap: serverArr.filter((q) => localSet.has(q.text + "|" + q.category)),
  };
}

async function fetchQuotesFromServer() {
  try {
    const res = await fetch(MOCK_API_URL);
    const data = await res.json();
    const fetchedQuotes = data.slice(0, 5).map((item) => ({
      text: item.title,
      category: "Server",
    }));

    const { onlyLocal, onlyServer, overlap } = findConflicts(
      quotes,
      fetchedQuotes
    );

    let updated = false;
    if (onlyServer.length > 0) {
      onlyServer.forEach((q) => quotes.push(q));
      updated = true;
    }

    if (updated) {
      saveQuotes();
      showNotification(
        "Quotes updated from server. Server data takes precedence."
      );
      populateCategories(categoryDropdown.value);
    }
  } catch (e) {}
}

setInterval(fetchQuotesFromServer, 30000);

fetchQuotesFromServer();

async function syncQuotes(quote) {
  try {
    await fetch(MOCK_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1,
      }),
    });
  } catch (e) {}
}

document
  .getElementById("addQuoteForm")
  .addEventListener("submit", async function (e) {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();
    if (text && category) {
      await postQuoteToServerAsync({ text, category });
    }
  });

if (!document.getElementById("resolveConflictsBtn")) {
  const btn = document.createElement("button");
  btn.id = "resolveConflictsBtn";
  btn.textContent = "Resolve Quote Conflicts";
  btn.style.marginLeft = "10px";
  btn.onclick = async () => {
    const res = await fetch(MOCK_API_URL);
    const data = await res.json();
    const fetchedQuotes = data.slice(0, 5).map((item) => ({
      text: item.title,
      category: "Server",
    }));
    const { onlyLocal, onlyServer } = findConflicts(quotes, fetchedQuotes);
    showManualConflictResolution(onlyLocal, onlyServer);
  };
  document.body.appendChild(btn);
}
