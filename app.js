// DOM Elements
const peopleList = document.getElementById('people-list');
const addPersonBtn = document.getElementById('add-person-btn');
const clearStorageBtn = document.getElementById('clear-storage-btn');
const confirmedTotalDisplay = document.getElementById('confirmed-total');
const spentTotalDisplay = document.getElementById('spent-total');

// Global variables
let people = JSON.parse(localStorage.getItem('people')) || [];

// Save data to localStorage
function saveToStorage() {
  localStorage.setItem('people', JSON.stringify(people));
}

// Update the people list on the page
function updatePeopleList() {
  peopleList.innerHTML = '';
  let totalConfirmed = 0;
  let totalSpent = 0;

  people.forEach((person, index) => {
    let confirmedTotal = 0;
    let boughtTotal = 0;

    person.ideas.forEach((idea) => {
      if (idea.status === 'yellow') confirmedTotal += idea.price;
      if (idea.status === 'green') boughtTotal += idea.price;
    });

    person.confirmedTotal = confirmedTotal;
    person.boughtTotal = boughtTotal;

    person.status = boughtTotal > 0 ? 'green' : confirmedTotal > 0 ? 'yellow' : 'black';

    const li = document.createElement('li');
    li.className = `person ${person.status}`;
    li.draggable = true;
    li.setAttribute('data-index', index);
    li.innerHTML = `
  <a href="person.html?index=${index}">
    <div class="person-content">
      <span class="person-name">${person.name}</span>
      <span class="person-totals">
        ${
          boughtTotal > 0
            ? `€${boughtTotal.toFixed(2)}${
                confirmedTotal > 0 ? ` (€${confirmedTotal.toFixed(2)})` : ''
              }`
            : confirmedTotal > 0
            ? `€${confirmedTotal.toFixed(2)}`
            : ''
        }
      </span>
    </div>
  </a>
`;


    li.addEventListener('dragstart', dragStart);
    li.addEventListener('dragover', dragOver);
    li.addEventListener('drop', dragDrop);
    peopleList.appendChild(li);

    totalConfirmed += confirmedTotal;
    totalSpent += boughtTotal;
  });

  confirmedTotalDisplay.textContent = totalConfirmed.toFixed(2);
  spentTotalDisplay.textContent = totalSpent.toFixed(2);

  saveToStorage();
}

// Drag-and-drop functions
let dragStartIndex;

function dragStart(e) {
  dragStartIndex = +e.target.getAttribute('data-index');
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop(e) {
  const dragEndIndex = +e.target.getAttribute('data-index');
  const personToMove = people.splice(dragStartIndex, 1)[0];
  people.splice(dragEndIndex, 0, personToMove);
  updatePeopleList();
}

// Add a new person
addPersonBtn.addEventListener('click', () => {
  const name = prompt('Inserisci il nome della persona:');
  if (name) {
    people.push({ name: name.trim(), ideas: [], status: 'black', confirmedTotal: 0 });
    updatePeopleList();
  }
});

// Clear storage
clearStorageBtn.addEventListener('click', () => {
  if (confirm('Sei sicuro di voler svuotare tutta la lista?')) {
    localStorage.clear();
    people = [];
    updatePeopleList();
  }
});

// Initial rendering
updatePeopleList();
