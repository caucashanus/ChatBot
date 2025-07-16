// netlify/functions/ai-answer.js

exports.handler = async function(event) {
  // Logování pro kontrolu, jestli je klíč načten
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'OK' : 'NENÍ NASTAVEN');

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  const { dotaz, context } = JSON.parse(event.body || '{}');
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: 'Missing OpenAI API key'
    };
  }

  // Sestavíme prompt pro OpenAI
  const messages = [
    {
      role: 'system',
      content: 'Odpovídej na dotazy uživatele. Pokud máš kontext, použij ho, jinak odpověz podle svých znalostí.'
    },
    {
      role: 'user',
      content: `Dotaz: ${dotaz}\n\nKontext:\n${context || 'Žádný kontext'}`
    }
  ];

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 400
      })
    });

    const data = await openaiRes.json();
    console.log('OpenAI response:', JSON.stringify(data));

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return {
        statusCode: 500,
        body: JSON.stringify({ answer: 'Chyba při komunikaci s OpenAI.' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: data.choices[0].message.content })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ answer: 'Chyba při komunikaci s OpenAI.' })
    };
  }
};
