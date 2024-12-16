// DOM Elements
const personName = document.getElementById('person-name');
const addIdeaBtn = document.getElementById('add-idea-btn');
const deletePersonBtn = document.getElementById('delete-person-btn');
const backBtn = document.getElementById('back-btn');
const ideasList = document.getElementById('ideas-list');

// Retrieve data
const params = new URLSearchParams(window.location.search);
const personIndex = parseInt(params.get('index'), 10);
let people = JSON.parse(localStorage.getItem('people')) || [];

if (!people || !people[personIndex]) {
  alert('Errore: persona non trovata!');
  window.location.href = 'index.html';
} else {
  var person = people[personIndex];
}

// Save data to localStorage
function saveToStorage() {
  localStorage.setItem('people', JSON.stringify(people));
}

// Render the person's ideas
function renderPerson() {
  personName.textContent = person.name;
  ideasList.innerHTML = '';

  person.ideas.forEach((idea, index) => {
    const li = document.createElement('li');
    li.className = `idea ${idea.status}`;
    li.innerHTML = `
      <span>${idea.text}</span>
      <span>€${idea.price.toFixed(2)}</span>
      <button onclick="deleteIdea(${index})">🗑️</button>
      ${
        idea.status === 'black'
          ? `<button onclick="confirmIdea(${index})">✅</button>
             <button onclick="buyIdea(${index})">💵</button>`
          : idea.status === 'yellow'
          ? `<button onclick="buyIdea(${index})">💵</button>
             <button onclick="resetIdeaStatus(${index})">↩️</button>`
          : `<button onclick="resetIdeaStatus(${index})">↩️</button>`
      }
    `;
    ideasList.appendChild(li);
  });

  saveToStorage();
}

// Add a new idea
addIdeaBtn.addEventListener('click', () => {
  const text = prompt('Inserisci la tua idea regalo:');
  const price = parseFloat(prompt('Inserisci il prezzo dell\'idea:'));
  if (text && !isNaN(price)) {
    person.ideas.push({ text: text.trim(), price, status: 'black' });
    renderPerson();
  }
});

// Delete the person
deletePersonBtn.addEventListener('click', () => {
  if (confirm(`Sei sicuro di voler eliminare ${person.name}?`)) {
    people.splice(personIndex, 1);
    saveToStorage();
    window.location.href = 'index.html';
  }
});

// Edit the person's name
personName.addEventListener('dblclick', () => {
  const newName = prompt('Modifica il nome della persona:', person.name);
  if (newName) {
    person.name = newName.trim();
    renderPerson();
  }
});

// Delete an idea
function deleteIdea(index) {
  person.ideas.splice(index, 1);
  renderPerson();
}

// Confirm an idea
function confirmIdea(index) {
  toggleIdeaStatus(index, 'yellow');
}

// Buy an idea
function buyIdea(index) {
  const otherBoughtIdeas = person.ideas.some(
    (idea, i) => idea.status === 'green' && i !== index
  );

  if (otherBoughtIdeas) {
    const proceed = confirm(
      "Ci sono altre idee già acquistate per questa persona. Vuoi proseguire?"
    );
    if (!proceed) return;
  }

  toggleIdeaStatus(index, 'green');
}

// Reset an idea's status
function resetIdeaStatus(index) {
  toggleIdeaStatus(index, 'black');
}

// Toggle the status of an idea
function toggleIdeaStatus(index, newStatus) {
  person.ideas[index].status = newStatus;
  renderPerson();
}

// Go back to the home page
backBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Initial rendering
renderPerson();
