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
                <div className="image-container">
                    <img className="thumbnail" src={gameData.thumbnail} alt={gameData.name} />
                </div>
                <div className="info-container">
                    <h2 className="game-title">{gameData.name}</h2>
                    <p>Player Count: {gameData.minplayers === gameData.maxplayers ? gameData.minplayers : `${gameData.minplayers} - ${gameData.maxplayers}`}</p>
                    <p>Avg Playing Time: {gameData.playingtime}</p>
                </div>
            </div>
            <div className="desc">
                <p>{gameData.description.split('&#10;').map((line: string, index: number) => (
                    <React.Fragment key={index}>
                        {line}
                        <br />
                    </React.Fragment>
                ))}</p>
            </div>
        </div>
    )
}

export default BoardGame;