document.addEventListener('DOMContentLoaded', () => {
  let postsData = [];
  let debounceTimeout;

  const searchInput = document.getElementById('search');
  const postsTable = document.getElementById('posts');

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts'
      );
      postsData = await response.json();
      console.log(postsData);
      renderPosts(postsData);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timed out.');
      } else {
        console.error('Error fetching posts:', error);
      }
    }
  };

  const renderPosts = (posts) => {
    const fragment = document.createDocumentFragment();

    while (postsTable.firstChild) {
      postsTable.removeChild(postsTable.firstChild);
    }

    posts.forEach((post) => {
      const row = document.createElement('tr');

      // ID
      const idCell = document.createElement('td');
      idCell.textContent = post.id;
      row.appendChild(idCell);

      // Title
      const titleCell = document.createElement('td');
      titleCell.textContent = post.title;
      row.appendChild(titleCell);

      // Body
      const bodyCell = document.createElement('td');
      const bodyContent = document.createElement('span');
      post.body.split(/(rerum)/gi).forEach((word) => {
        const span = document.createElement('span');
        if (/rerum/gi.test(word)) span.classList.add('highlight');
        span.textContent = word;
        bodyContent.appendChild(span);
      });
      bodyCell.appendChild(bodyContent);
      row.appendChild(bodyCell);

      // Comments
      const buttonCell = document.createElement('td');
      const button = document.createElement('button');
      button.classList.add('comment-btn');
      button.textContent = 'View';
      button.setAttribute('data-post-id', post.id);
      buttonCell.appendChild(button);
      row.appendChild(buttonCell);

      fragment.appendChild(row);
    });

    postsTable.appendChild(fragment);
  };

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const query = searchInput.value.toLowerCase();
      const filteredPosts = postsData.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.body.toLowerCase().includes(query)
      );
      renderPosts(filteredPosts);
    }, 500);
  });

  fetchPosts();
});
