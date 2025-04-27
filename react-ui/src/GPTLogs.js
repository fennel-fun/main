import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

function GPTLogs() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "gpt_logs"), orderBy("timestamp", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            const newLogs = snapshot.docs.map(doc => doc.data());
            setLogs(newLogs);
        });
        return () => unsub();
    }, []);

    return (
        <div>
            <h1>📊 GPT Query Logs</h1>
            {logs.map((log, idx) => (
                <div key={idx} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
                    <p><strong>Event:</strong> {log.event}</p>
                    <p><strong>Query:</strong> {log.user_input}</p>
                    <p><strong>Spices:</strong> {log.spices?.join(', ')}</p>
                    <p><em>{log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000).toLocaleString() : 'No timestamp'}</em></p>
                </div>
            ))}
        </div>
    );
}

export default GPTLogs;
