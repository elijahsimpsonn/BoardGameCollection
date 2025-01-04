import React, { useEffect, useState } from 'react';
import fetchBoardGameData from '../../apiFunctions/fetchBoardGameData';
import './BoardGame.css'

const BoardGame = ({ id }: { id: number }) => {
    const [gameData, setGameData] = useState<any>(null);

    useEffect(() => {
        const getData = async () => {
            const data = await fetchBoardGameData(id);
            setGameData(data);
        };
        getData();
    }, [id]);

    if (!gameData) return (
        <div>Loading...</div>
    )

    return (
        <div className="game-container">
            <div className="main-info">
                <img className="thumbnail" src={gameData.thumbnail} alt={gameData.name} />
                <h2 className="game-title">{gameData.name}</h2>
            </div>
            <div className="sub-info">
                <p>Minimum Players: {gameData.minplayers}</p>
                <p>Maximum Players: {gameData.maxplayers}</p>
                <p>Avg Playing Time: {gameData.playingtime}</p>
            </div>
            <div className="desc">
                <p>{gameData.description}</p>
            </div>
        </div>
    )
}

export default BoardGame;