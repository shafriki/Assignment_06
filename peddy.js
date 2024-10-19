// dark mode to light mode
const pageMode = document.getElementsByTagName('html')[0];
pageMode.setAttribute('data-theme', 'light')

// navbar drop-down menu
const bar = document.getElementById('bar');
const dropdown = document.getElementById('dropdown');
bar.addEventListener('click', () => dropdown.classList.toggle('hidden'));

// active-category global variable
let activeCategory = null;

// show loading spinner 
const showSpinner = () => {
    document.getElementById('spinner').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('spinner').classList.add('hidden');
    }, 2000);
};

// load all pets from the given api
const loadAllPet = async () => {
    document.getElementById('spinner').classList.remove('hidden');

    try {
        const response = await fetch('https://openapi.programming-hero.com/api/peddy/pets');
        const data = await response.json();

        console.log("API Response:", data);
        const pets = data.pets;

        if (Array.isArray(pets)) {
            displayPets(pets); 
            setUpCategoryFilters(pets); 
            setUpSortByPrice(pets); 
        } else {
            console.error("Pets data is not an array or is undefined.");
            displayPets([]);
        }
    } catch (error) {
        console.error("Error fetching pets:", error);
    } finally {
        document.getElementById('spinner').classList.add('hidden');
    }
};

