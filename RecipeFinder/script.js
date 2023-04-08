const API_KEY = "c59894981a1b48a7a477c308b0ce24c6";

document.getElementById("submit-ingredients").addEventListener("click", async () => {
  const ingredients = document.getElementById("ingredients").value;
  const recipes = await searchRecipes(ingredients);
  displayRecipes(recipes);
});

async function searchRecipes(ingredients) {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredients}&number=10`
  );

  const data = await response.json();
  console.log(data); // Add this line to log the data
  return data;
}

async function displayRecipes(recipes) {
  const recipeResults = document.getElementById("recipe-results");
  recipeResults.innerHTML = "";

  for (const recipe of recipes) {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");

    // Fetch recipe instructions
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipe.id}/analyzedInstructions?apiKey=${API_KEY}`
    );
    const instructionsData = await response.json();
    const steps = instructionsData[0]?.steps
      .map((step) => `<li>${step.step}</li>`)
      .join("") || "<li>No instructions available.</li>";

    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <div class="recipe-details">
        <h4>Instructions:</h4>
        <ol>${steps}</ol>
      </div>
    `;
    recipeCard.addEventListener("click", toggleRecipeDetails);
    recipeResults.appendChild(recipeCard);
  }
}


// ... existing script ...

function toggleRecipeDetails(event) {
  const clickedElement = event.target;
  const clickedRecipeCard = clickedElement.closest(".recipe-card");

  if (clickedRecipeCard) {
    const overlay = document.getElementById("overlay");
    const overlayContent = overlay.querySelector(".overlay-content");

    const recipeDetails = clickedRecipeCard.querySelector(".recipe-details");
    const recipeImage = clickedRecipeCard.querySelector("img").outerHTML;
    const recipeTitle = clickedRecipeCard.querySelector("h3").textContent;

    overlayContent.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem;">
        ${recipeImage}
        <h3>${recipeTitle}</h3>
      </div>
      ${recipeDetails.innerHTML}
    `;
    overlay.style.display = "flex";
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        overlay.style.display = "none";
      }
    });
  }
}
// ... existing script ...


