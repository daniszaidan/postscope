document.addEventListener('DOMContentLoaded', () => {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const rerumCountText = document.getElementById('rerumCountText');
  const userReportBody = document.getElementById('userReportBody');

  const setLoading = (isLoading) => {
    loadingEl.style.display = isLoading ? 'block' : 'none';
  };

  const setError = (isError) => {
    errorEl.style.display = isError ? 'block' : 'none';
  };

  const generateReports = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts'
      );
      const posts = await response.json();

      const rerumCount = posts.filter((post) =>
        post.body.includes('rerum')
      ).length;
      rerumCountText.textContent = `Number of posts containing the word "rerum" in the body: ${rerumCount}`;

      const userMap = new Map();
      posts.forEach((post) => {
        userMap.set(post.userId, (userMap.get(post.userId) || 0) + 1);
      });

      const fragment = document.createDocumentFragment();
      userMap.forEach((count, userId) => {
        const tr = document.createElement('tr');

        const tdUser = document.createElement('td');
        tdUser.textContent = userId;
        tr.appendChild(tdUser);

        const tdCount = document.createElement('td');
        tdCount.textContent = count;
        tr.appendChild(tdCount);

        fragment.appendChild(tr);
      });
      userReportBody.appendChild(fragment);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  generateReports();
});
