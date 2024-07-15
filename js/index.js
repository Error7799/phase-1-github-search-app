const githubForm = document.getElementById('github-form');
const searchInput = document.getElementById('search');
const userList = document.getElementById('user-list');
const reposList = document.getElementById('repos-list');
const githubContainer = document.getElementById('github-container');

const baseURL = 'https://api.github.com';

// Event listener for form submission
githubForm.addEventListener('submit', e => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();

  if (searchTerm) {
    // Clear previous search results
    userList.innerHTML = '';
    reposList.innerHTML = '';

    searchUsers(searchTerm);
  }
});

// Function to fetch users based on search term
async function searchUsers(searchTerm) {
  try {
    const response = await fetch(`${baseURL}/search/users?q=${searchTerm}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const data = await response.json();

    displayUsers(data.items);
  } catch (error) {
    console.error('Error searching users:', error);
    githubContainer.innerHTML = '<p>Error searching users. Please try again later.</p>';
  }
}

// Function to fetch repositories for a user
async function getUserRepos(username) {
  try {
    const response = await fetch(`${baseURL}/users/${username}/repos`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const data = await response.json();

    displayRepos(data);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    reposList.innerHTML = '<p>Error fetching repositories. Please try again later.</p>';
  }
}

// Display search results (users) in the DOM
function displayUsers(users) {
  if (users.length > 0) {
    users.forEach(user => {
      const userItem = document.createElement('li');
      userItem.innerHTML = `
        <div>
          <img src="${user.avatar_url}" alt="${user.login}" style="width: 50px; height: 50px;">
          <span>${user.login}</span>
          <button onclick="getUserRepos('${user.login}')">Show Repos</button>
        </div>
      `;
      userList.appendChild(userItem);
    });
  } else {
    userList.innerHTML = '<li>No users found</li>';
  }
}

// Display repositories in the DOM
function displayRepos(repos) {
  if (repos.length > 0) {
    repos.forEach(repo => {
      const repoItem = document.createElement('li');
      repoItem.innerHTML = `
        <div>
          <h3>${repo.name}</h3>
          <p>${repo.description || 'No description'}</p>
          <a href="${repo.html_url}" target="_blank">View Repo</a>
        </div>
      `;
      reposList.appendChild(repoItem);
    });
  } else {
    reposList.innerHTML = '<li>No repositories found</li>';
  }
}
