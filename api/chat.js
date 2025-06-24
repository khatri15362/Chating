export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-vercel-url.vercel.app',
        'X-Title': 'ChatGPT Clone'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ reply: `AI Error: ${data.error.message}` });
    }

    const reply = data.choices?.[0]?.message?.content || 'No response from AI';
    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: 'Server Error. Please try again.' });
  }
}