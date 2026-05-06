// Petrol Calculator JavaScript file
// Get references to the HTML elements
const costInput = document.getElementById('cost');
const litersInput = document.getElementById('liters');
const calculateButton = document.getElementById('calculate');
const resultP = document.getElementById('result');

// Function to calculate the total cost
function calculateTotal() {
    // Parse the input values as floats
    const cost = parseFloat(costInput.value);
    const liters = parseFloat(litersInput.value);
    // Calculate the total cost
    const total = cost * liters;
    // Update the result paragraph with the formatted total
    resultP.textContent = `Total cost: £${total.toFixed(2)}`;
}

// Add event listener to the calculate button
calculateButton.addEventListener('click', calculateTotal);