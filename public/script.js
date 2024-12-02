const socket = new WebSocket('ws://localhost:8080'');


const nameInput = document.getElementById('name');
const projectTypeInput = document.getElementById('projectType');
const projectTitleInput = document.getElementById('projectTitle');
const projectDescriptionInput = document.getElementById('projectDescription');

const ideasList = document.getElementById('ideas-list');

socket.addEventListener('open', () => {
  console.log('Connected to WebSocket server');
});

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);

  if (message.action === 'initIdeas') {
    message.ideas.forEach((idea) => {
      displayIdea(idea);
    });
  }

  if (message.action === 'addDiv') {
    displayIdea(message);
  }
});

const displayIdea = (idea) => {
  if (
    idea &&
    idea.projectTitle &&
    idea.projectType &&
    idea.name &&
    idea.projectDescription
  ) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'idea-card';
    ideasList.appendChild(cardDiv);

    const ideaCardTitle = document.createElement('h3');
    ideaCardTitle.className = 'idea-card__title';
    ideaCardTitle.textContent = idea.projectTitle;
    cardDiv.appendChild(ideaCardTitle);

    const ideaCardInfo = document.createElement('p');
    ideaCardInfo.className = 'idea-card__info';
    ideaCardInfo.textContent = idea.projectType;
    cardDiv.appendChild(ideaCardInfo);

    const ideaCardName = document.createElement('p');
    ideaCardName.className = 'idea-card__name';
    ideaCardName.textContent = idea.name;
    cardDiv.appendChild(ideaCardName);

    const ideaCardDescription = document.createElement('p');
    ideaCardDescription.className = 'idea-card__description';
    ideaCardDescription.textContent = idea.projectDescription;
    cardDiv.appendChild(ideaCardDescription);
  } else {
    console.error('Invalid idea data:', idea);
  }
};

const form = document.getElementById('projectForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const projectType = projectTypeInput.value.trim();
  const projectTitle = projectTitleInput.value.trim();
  const projectDescription = projectDescriptionInput.value.trim();

  const words = projectDescription.trim().split(/\s+/);

  if (
    name &&
    projectType &&
    projectTitle &&
    projectDescription &&
    words.length > 50
  ) {
    const idea = {
      name,
      projectType,
      projectTitle,
      projectDescription,
    };

    socket.send(JSON.stringify(idea));

    form.reset();
  } else {
    console.error(
      'All fields are required to submit an idea, And description must be 50 words or higher'
    );
  }
});
