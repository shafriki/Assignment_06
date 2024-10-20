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


// handle like btn 
const handleLikeClick = (button, pet) => {
    const likedPetsGrid = document.getElementById('liked-pets-grid');
    
    const likedPetThumbnail = document.createElement('div');
    likedPetThumbnail.classList.add('border', 'border-gray-300', 'rounded-lg', 'p-2', 'shadow-lg');
        likedPetThumbnail.innerHTML = `
        <img src="${pet.image}" alt="${pet.pet_name}" class="w-full h-24 object-cover rounded-lg" />
    `;

    likedPetsGrid.appendChild(likedPetThumbnail);
};

// pets display show by category
const displayPets = (pets) => {
    const petGrid = document.getElementById('pet-grid');
    petGrid.innerHTML = '';

    if (pets.length === 0) {
        petGrid.innerHTML = `
            <div class="flex flex-col items-center justify-center">
                <img src="./images/error.webp" alt="error img"/>
                <p class="text-xl font-extrabold">No Information Avaliable.</p>
            </div>
        `;
        return;
    }
    
    
    pets.forEach((pet, index) => {
        const petCard = `
        <div class="pet-card border border-gray-300 rounded-lg p-4 shadow-lg">
        <img src="${pet.image}" alt="${pet.pet_name}" class="w-full h-48 object-cover rounded-t-lg" />
        <h3 class="text-lg font-semibold mt-2 text-gray-500">${pet.pet_name}</h3>
        <p><i class="fa-solid fa-person-breastfeeding mr-2 text-gray-500"></i>Breed: ${pet.breed || 'Not available'}</p>
        <p><i class="fa-solid fa-cake-candles mr-2 text-gray-500"></i>Birth: ${pet.date_of_birth || 'Not available'}</p>
        <p><i class="fa-solid fa-venus mr-2 text-gray-500"></i>Gender: ${pet.gender || 'Not available'}</p>
        <p><i class="fa-solid fa-hand-holding-dollar mr-2 text-gray-500"></i>Price: ${pet.price != null ? pet.price : 'Not available'}</p>
        <button class="like-btn btn text-[#0E7A81] border-gray-500 mt-2 mr-3"><i class="fa-regular fa-thumbs-up"></i></button>
        <button class="adopt-btn btn text-[#0E7A81] border-gray-500 mt-2 mr-3">Adopt</button>
        <button class="details-btn btn text-[#0E7A81] border-gray-500 mt-2">Details</button>
    </div>`;
        petGrid.innerHTML += petCard;
    });

    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach((button, index) => {
        button.addEventListener('click', () => handleLikeClick(button, pets[index]));
    });

    const adoptButtons = document.querySelectorAll('.adopt-btn');
    adoptButtons.forEach((button, index) =>{
        button.addEventListener('click', () => handleAdoptClick(button, pets[index]));
    });

    const detailsButtons = document.querySelectorAll('.details-btn');
    detailsButtons.forEach((button, index) => {
        button.addEventListener('click', () => showPetDetailsModal(pets[index]));
    });
};

// details btn modal open
const showPetDetailsModal = (pet) => {
    const modal = document.getElementById('petDetailsModal');
    document.getElementById('modalPetName').textContent = pet.pet_name || 'Not available';
    document.getElementById('modalPetImage').src = pet.image || '';
    document.getElementById('modalPetBreed').innerHTML = `<i class="fa-solid fa-person-breastfeeding mr-2 text-gray-500"></i>Breed: ${pet.breed || 'Not available'}`;
    document.getElementById('modalPetGender').innerHTML = `<i class="fa-solid fa-venus mr-2 text-gray-500"></i> Gender: ${pet.gender || 'Not available'}`;

    document.getElementById('modalPetVaccine').innerHTML = `<i class="fa-solid fa-virus"></i> Vaccinated Status: ${pet.vaccinated_status || 'Not available'}`;
    document.getElementById('modalPetBirth').innerHTML = `<i class="fa-solid fa-cake-candles mr-2 text-gray-500"></i> Birth: ${pet.date_of_birth || 'Not available'}`;
    
    document.getElementById('modalPetPrice').innerHTML = `<i class="fa-solid fa-hand-holding-dollar mr-2 text-gray-500"></i> Price: ${pet.price != undefined ? pet.price : 'Not available'}`;

    document.getElementById('modalPetDetails').innerHTML = `${pet.pet_details || 'Not available'}`;

    modal.classList.remove('hidden'); 
};

// details btn modal close
const closeModal = () => {
    document.getElementById('petDetailsModal').classList.add('hidden');
};

// cancel button colse
document.getElementById('cancelModal').addEventListener('click', closeModal);

// countdown adopt modal
const handleAdoptClick = (button, pet) => {
    const modal = document.getElementById('adoptModal');
    const countdownElement = document.getElementById('countdown');
    
    let countdown = 3;
    modal.classList.remove('hidden');

    countdownElement.textContent = countdown;
    const countdownInterval = setInterval(() => {
        countdown -= 1;
        countdownElement.textContent = countdown;

        if (countdown === 0) {
            clearInterval(countdownInterval);
            modal.classList.add('hidden'); 
            button.textContent = 'Adopted'; 
            button.disabled = true; 
        }
    }, 1000); 
};

// category buttons for dog, cat, rabbit, and birds
const setUpCategoryFilters = (pets) => {
    const categories = {
        dog: 'Dog',
        cat: 'Cat',
        rabbit: 'Rabbit',
        bird: 'Bird'
    };

    const buttons = Object.keys(categories).map(id => document.getElementById(id));

    for (const [id, category] of Object.entries(categories)) {
        document.getElementById(id).addEventListener('click', () => {
            if (document.getElementById(id).classList.contains('active')) {
                return; 
            }

            // active-category
            activeCategory = category;

            buttons.forEach(button => {
                button.classList.remove('active');
                button.classList.remove('bg-[#0E7A81]');
            });

            const clickedButton = document.getElementById(id);
            clickedButton.classList.add('active');
            clickedButton.classList.add('bg-[#0E7A81]'); 

            // show spinner
            showSpinner();

            const filteredPets = pets.filter(pet => pet.category === category);
            setTimeout(() => displayPets(filteredPets), 2000); 
        });
    }
};

// sorting by pet price in descending order
const setUpSortByPrice = (pets) => {
    document.getElementById('sort').addEventListener('click', () => {
        showSpinner(); 

        setTimeout(() => {
            let sortedPets;
            
            if (activeCategory) {
                const filteredPets = pets.filter(pet => pet.category === activeCategory);
                sortedPets = filteredPets.sort((a, b) => b.price - a.price); 
            } else {
                sortedPets = pets.sort((a, b) => b.price - a.price); 
            }
            
            displayPets(sortedPets); 
        }, 2000); 
    });
};

window.onload = loadAllPet;

// when refresh the page 2sec loading
window.onload = () => {
    document.getElementById('spinner').classList.remove('hidden');

    setTimeout(function(){
        loadAllPet(); 
    }, 2000);
};






