const lista = document.getElementById('lista-repos');
const stackContainer = document.querySelector('.countStack');

const GITHUB_USER = 'riccideveloper';
const STORAGE_KEY = 'github_repos_cache';
const CACHE_TIME = 1000 * 60 * 60;

async function carregarRepositorios() {
  try {
    const cachedData = localStorage.getItem(STORAGE_KEY);

    if (cachedData) {
      const { timestamp, repos } = JSON.parse(cachedData);

      if (Date.now() - timestamp < CACHE_TIME) {
        processarRepositorios(repos);
        return;
      }
    }

    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos`
    );

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    let repos = await response.json();

    repos.sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        repos
      })
    );

    processarRepositorios(repos);

  } catch (error) {
    console.error(error);
    lista.innerHTML = `
      <li style="opacity:0.7;text-align:center">
        Não foi possível carregar os projetos.
      </li>
    `;
  }
}

function processarRepositorios(repos) {
  renderizarRepositorios(repos);
  contarStacks(repos);
}

function renderizarRepositorios(repos) {
  lista.innerHTML = repos
    .map(repo => `
      <li data-stack="${repo.language}">
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
          ${repo.name}
        </a>
        <h6>Stack: ${repo.language ?? 'Não informado'}</h6>
      </li>
    `)
    .join('');
}

function contarStacks(repos) {
  const stacks = repos.reduce((acc, repo) => {
    const lang = repo.language ?? 'Outros';
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {});

  stackContainer.innerHTML = Object.entries(stacks)
    .sort((a, b) => b[1] - a[1])
    .map(([stack, count]) => `
      <div class="stack-item" data-stack="${stack}">
        <span class="stack-name">${stack}</span>
        <span class="stack-count">${count}</span>
      </div>
    `)
    .join('');
}

carregarRepositorios();
