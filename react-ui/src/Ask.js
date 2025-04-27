import { useState } from 'react';

function Ask() {

    const [userInput, setUserInput] = useState('');
    const [gptResponse, setGptResponse] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('https://us-central1-heyfennel-a232f.cloudfunctions.net/api/ask-gpt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_input: userInput })
        });
        const data = await res.json();
        setGptResponse(data.response);
    };

    return (
        <div>
            <h1>Ask Fennel</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    style={{ width: "80%", marginRight: "1rem" }}
                    placeholder="What can Fennel do for you?..."
                />
                <button type="submit">Ask</button>
            </form>
            {gptResponse && (
                <div style={{ marginTop: '2rem' }}>
                    <h2>Fennel's Answer:</h2>
                    <p>{gptResponse}</p>
                </div>
            )}
        </div>
    );
}

export default Ask;
