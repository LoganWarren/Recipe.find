const API_KEY = "c59894981a1b48a7a477c308b0ce24c6";

// Adds the event listener to the "submit-ingredients" button
document.getElementById("submit-ingredients").addEventListener("click", async () => {
  const ingredients = document.getElementById("ingredients").value;
  const recipes = await searchRecipes(ingredients);
  displayRecipes(recipes);
});

// Function to search for recipes based on ingredients
async function searchRecipes(ingredients) {
  // Fetch recipes using the Spoonacular API
  const response = await fetch(
    `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredients}&number=10`
  );
  const data = await response.json();
  console.log(data);
  return data;
}

// Function to display fetched recipes as interactive cards
async function displayRecipes(recipes) {
  const recipeResults = document.getElementById("recipe-results");
  recipeResults.innerHTML = "";

  // Loop through the recipes
  for (const recipe of recipes) {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");

    // Fetch recipe instructions using the Spoonacular API
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipe.id}/analyzedInstructions?apiKey=${API_KEY}`
    );
    const instructionsData = await response.json();
    const steps = instructionsData[0]?.steps
      .map((step) => `<li>${step.step}</li>`)
      .join("") || "<li>No instructions available.</li>";

    // Create the HTML structure for the recipe card
    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <div class="recipe-details">
        <h4>Instructions:</h4>
        <ol>${steps}</ol>
      </div>
    `;
    // Add event listener to toggle recipe details on click
    recipeCard.addEventListener("click", toggleRecipeDetails);
    recipeResults.appendChild(recipeCard);
  }
}

// Function to toggle recipe details in an overlay
function toggleRecipeDetails(event) {
  const clickedElement = event.target;
  const clickedRecipeCard = clickedElement.closest(".recipe-card");

  // Check if a recipe card was clicked
  if (clickedRecipeCard) {
    const overlay = document.getElementById("overlay");
    const overlayContent = overlay.querySelector(".overlay-content");

    // Extract recipe details, image, and title from the clicked card
    const recipeDetails = clickedRecipeCard.querySelector(".recipe-details");
    const recipeImage = clickedRecipeCard.querySelector("img").outerHTML;
    const recipeTitle = clickedRecipeCard.querySelector("h3").textContent;

    // Update the overlay content with the extracted information
    overlayContent.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem;">
        ${recipeImage}
        <h3>${recipeTitle}</h3>
      </div>
      ${recipeDetails.innerHTML}
    `;
    // Display the overlay
    overlay.style.display = "flex";
    // Add event listener to close the overlay when clicked outside the content area
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        overlay.style.display = "none";
      }
    });
  }
}