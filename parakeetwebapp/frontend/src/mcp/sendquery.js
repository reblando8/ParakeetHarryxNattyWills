

export async function sendQuery(query: string) {
  const res = await fetch('http://localhost:4000/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_query: query })
  });
  
  if (!res.ok) throw new Error('Server error');
  return await res.json();
}