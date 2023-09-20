



const searchInput = document.getElementById('searchInput');
const suggestions = document.getElementById('suggestions');
const dropdown = document.getElementById('suggestions'); 

let isDropdownOpen = false;

searchInput.addEventListener('input', debounce(searchCountries, 300));


document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target) && !searchInput.contains(event.target)) {
        closeDropdown();
    }
});

function closeDropdown() {
    suggestions.innerHTML = '';
    dropdown.style.display = 'none'; 
    isDropdownOpen = false;
}

function debounce(func, delay) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

function searchCountries() {
    const query = searchInput.value.toLowerCase();

    
    if (!query) {
        closeDropdown();
        return;
    }

    fetch('https://restcountries.com/v3.1/all')
        .then((response) => response.json())
        .then((data) => {
            const matches = data.filter((country) =>
                country.name.common.toLowerCase().includes(query)
            );

            if (matches.length === 0) {
                suggestions.innerHTML = '<li>No matches found</li>'; 
                dropdown.style.display = 'block';
                isDropdownOpen = true;

            }  else {
                const html = matches
                    .map((country) => `<li>${country.name.common}</li>`)
                    .join('');
                suggestions.innerHTML = html;
                dropdown.style.display = 'block'; 
                isDropdownOpen = true;
            }
        })
        .catch((error) => {
            suggestions.innerHTML = `<li>Error: ${error.message}</li>`;
        });
}


suggestions.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        searchInput.value = event.target.textContent;
        closeDropdown();
    }
});


document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeDropdown();
    }
});
