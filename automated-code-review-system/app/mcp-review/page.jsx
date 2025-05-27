'use client';
import { useState } from 'react';

export default function CodeReviewPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!repoUrl.trim()) return alert('Please enter a GitHub PR URL.');
    setLoading(true);

    // Call MCP API to get review
    const res = await fetch('/api/mcp', {
      method: 'POST',
      body: JSON.stringify({ prompt: `Review this GitHub PR: ${repoUrl}` }),
      headers: { 'Content-Type': 'application/json' },
    });

    const { result, error } = await res.json();
    if (error) {
      alert(error);
      setLoading(false);
      return;
    }

    setReview(result);

    // Save review to Neon DB
    await fetch('/api/review', {
      method: 'POST',
      body: JSON.stringify({ repoUrl, reviewText: result }),
      headers: { 'Content-Type': 'application/json' },
    });

    setLoading(false);
  };

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Automated Code Review</h1>
      <input
        type="text"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder="Enter GitHub PR URL"
        className="border p-2 w-full mb-4"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Reviewing...' : 'Submit for Review'}
      </button>
      {review && (
        <div className="mt-4 bg-gray-100 p-4 rounded whitespace-pre-wrap">
          <h2 className="font-semibold mb-2">Review Result:</h2>
          <pre>{review}</pre>
        </div>
      )}
    </main>
  );
}
