// pages/index.tsx
import { useState, FormEvent } from 'react';
import axios from 'axios';

interface WikipediaPageContent {
    title: string;
    content: string;
}

export default function Home() {
    const [query, setQuery] = useState<string>('');
    const [article, setArticle] = useState<WikipediaPageContent | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.get<{ parse: { title: string; text: { '*': string } } }>(
                `/api/wikipedia`,
                { params: { query } }
            );
            console.log(response.data)

            setArticle({
                title: response.data.parse.title,
                content: response.data.parse.text['*'],
            });
        } catch (error) {
            console.error("Error fetching article:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Wikipedia Article Viewer</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search Wikipedia..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {loading && <p>Loading...</p>}

            {article && (
                <div style={{ marginTop: '20px' }}>
                    <h2>{article.title}</h2>
                    <div
                        className="wikipediaContent" // Apply global class
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    ></div>
                </div>
            )}
        </div>
    );
}
