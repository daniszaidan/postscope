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
      renderPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const renderPosts = (posts) => {
    const fragment = document.createDocumentFragment();

    while (postsTable.firstChild) {
      postsTable.removeChild(postsTable.firstChild);
    }

    posts.forEach((post) => {
      const row = document.createElement('tr');

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

      // Comments row (hidden by default)
      const commentRow = document.createElement('tr');
      commentRow.classList.add('comment-row', 'hidden');
      const commentCell = document.createElement('td');
      commentCell.setAttribute('colspan', 4);
      commentCell.textContent = 'Loading comments...';
      commentRow.appendChild(commentCell);

      postsTable.appendChild(row);
      postsTable.appendChild(commentRow);

      button.addEventListener('click', () => {
        if (commentRow.classList.contains('hidden')) {
          commentRow.classList.remove('hidden');
          commentRow.classList.add('visible');
          fetchComments(post.id, commentCell);
          button.textContent = 'Hide';
        } else {
          commentRow.classList.remove('visible');
          commentRow.classList.add('hidden');
          button.textContent = 'View';
        }
      });
    });

    postsTable.appendChild(fragment);
  };

  const fetchComments = async (postId, row) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
      );
      const comments = await response.json();
      renderComments(comments, row, postId);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const renderComments = (comments, commentCell, postId) => {
    while (commentCell.firstChild) {
      commentCell.removeChild(commentCell.firstChild);
    }

    if (comments.length === 0) {
      const noCommentsText = document.createTextNode('No comments available.');
      commentCell.appendChild(noCommentsText);
      return;
    }

    const heading = document.createElement('h3');
    heading.textContent = 'Comments';
    commentCell.appendChild(heading);

    const ul = document.createElement('ul');
    comments.forEach((comment) => {
      const li = document.createElement('li');
      li.textContent = `${comment.name}: ${comment.body}`;
      ul.appendChild(li);
    });

    commentCell.appendChild(ul);

    const commentRow = commentCell.closest('tr');
    const contentHeight = commentRow.scrollHeight;
    commentRow.style.maxHeight = `${contentHeight}px`;
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
