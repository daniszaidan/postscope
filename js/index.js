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

      // Comments Button
      const buttonCell = document.createElement('td');
      const button = document.createElement('button');
      button.classList.add('comment-button');
      button.setAttribute('data-post-id', post.id);

      const iconDiv = document.createElement('div');
      iconDiv.insertAdjacentHTML(
        'beforeend',
        `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 
            1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 
            .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 
            2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 
            0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
        </svg>
      `
      );

      const textNode = document.createElement('span');
      textNode.textContent = 'Show';

      button.appendChild(iconDiv);
      button.appendChild(textNode);
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
        const isHidden = commentRow.classList.contains('hidden');
        commentRow.classList.toggle('hidden', !isHidden);
        commentRow.classList.toggle('visible', isHidden);
        textNode.textContent = isHidden ? 'Hide' : 'Show';

        if (isHidden) {
          fetchComments(post.id, commentCell);
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
