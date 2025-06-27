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

// Function to display a random quote
function showRandomQuote() {
  const container = document.getElementById("quoteDisplay");
  if (!container) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  container.innerHTML = `
        <blockquote>${quote.text}</blockquote>
        <p><em>Category: ${quote.category}</em></p>
    `;
}

const qouteButton = document.getElementById("newQoute");
qouteButton.addEventListener("click", showRandomQuote());
