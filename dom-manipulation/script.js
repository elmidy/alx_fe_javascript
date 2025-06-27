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
