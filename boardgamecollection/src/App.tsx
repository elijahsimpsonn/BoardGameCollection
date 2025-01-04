import React, { useEffect, useState } from 'react';
import axios from 'axios';

const boardGameIds = [47, 100901, 175914, 147949, 180956, 221965, 188834, 356768, 54043, 10547, 274364, 230802, 193037, 229741, 234691, 115746, 170216, 266192, 34119, 13, 237182, 256960, 332686, 297562, 155821, 342942, 224783, 162886, 167791, 224517, 167355]; // Replace with your actual board game IDs

const fetchBoardGameData = async (id: number) => {
    const response = await axios.get(`https://boardgamegeek.com/xmlapi2/thing?id=${id}`);
    const parser = new DOMParser();
    const xml = parser.parseFromString(response.data, 'text/xml');
    return {
        id,
        name: xml.getElementsByTagName('name')[0].getAttribute('value'),
        yearPublished: xml.getElementsByTagName('yearpublished')[0].getAttribute('value'),
        image: xml.getElementsByTagName('image')[0].textContent,
        thumbnail: xml.getElementsByTagName('thumbnail')[0].textContent,
        description: xml.getElementsByTagName('description')[0].textContent,
        minplayers: xml.getElementsByTagName('minplayers')[0].getAttribute('value'),
        maxplayers: xml.getElementsByTagName('maxplayers')[0].getAttribute('value'),
        playingtime: xml.getElementsByTagName('playingtime')[0].getAttribute('value')
    };
};

const BoardGame = ({ id }: { id: number }) => {
    const [gameData, setGameData] = useState<any>(null);

    useEffect(() => {
        const getData = async () => {
            const data = await fetchBoardGameData(id);
            setGameData(data);
        };
        getData();
    }, [id]);

    if (!gameData) return <div>Loading...</div>;
    console.log(gameData)

    return (
        <div>
            <img src={gameData.thumbnail} alt={gameData.name} />
            <h2>{gameData.name}</h2>
            <p>Year Published: {gameData.yearPublished}</p>
            <p>{gameData.description}</p>
            <p>Minimum Players: {gameData.minplayers}</p>
            <p>Maximum Players: {gameData.maxplayers}</p>
            <p>Avg Playing Time: {gameData.playingtime}</p>
            {/* Add more fields as needed */}
        </div>
    );
};

const App = () => {
    return (
        <div>
            <h1>Elijah Game Libary</h1>
            {boardGameIds.map(id => (
                <BoardGame key={id} id={id} />
            ))}
        </div>
    );
};

export default App;
