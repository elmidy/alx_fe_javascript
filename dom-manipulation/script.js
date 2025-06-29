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

document.body.appendChild(exportBtn);
