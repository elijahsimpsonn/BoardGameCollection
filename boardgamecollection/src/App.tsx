import React, { useEffect, useState } from 'react';

import fetchBoardGameData from './apiFunctions/fetchBoardGameData';

import BoardGame from './components/Game/BoardGame';

import gameids from './data/gameids';

import "./App.css"


//TODO LATER:
// 3. Remove lower bound for max players if min players is set
// 5. Add testing
// 6. Update README

const App = () => {
    const [minPlayers, setMinPlayers] = useState<number | null>(null);
    const [maxPlayers, setMaxPlayers] = useState<number | null>(null);
    const [playingTime, setPlayingTime] = useState<string | null>(null);
    const [filteredBoardGames, setFilteredBoardGames] = useState<any[]>([]);
    const [minPlayerOptions, setMinPlayerOptions] = useState<number[]>([]);
    const [maxPlayerOptions, setMaxPlayerOptions] = useState<number[]>([]);

    const handleMinPlayersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value ? parseInt(e.target.value) : null;
        setMinPlayers(value);
        if (value !== null) {
            setMaxPlayerOptions(minPlayerOptions.filter(option => option >= value));
        } else {
            setMaxPlayerOptions(minPlayerOptions);
        }
    };

    const handleMaxPlayersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMaxPlayers(e.target.value ? parseInt(e.target.value) : null);
    };

    const handlePlayingTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPlayingTime(e.target.value || null);
    };

    const handleResetFilters = () => {
        setMinPlayers(null);
        setMaxPlayers(null);
        setPlayingTime(null);
    };

    useEffect(() => {
        const filterGames = async () => {
            const games = await Promise.all(gameids.map(id => fetchBoardGameData(id)));
            const filtered = games.filter(game => {
                return (
                    (minPlayers === null || game.minplayers >= minPlayers) &&
                    (maxPlayers === null || game.maxplayers <= maxPlayers) &&
                    (playingTime === null ||
                        (playingTime === '1-2' && game.playingtime <= 120) ||
                        (playingTime === '3-4' && game.playingtime > 120 && game.playingtime <= 240) ||
                        (playingTime === '4+' && game.playingtime > 240)
                    )
                );
            });
            setFilteredBoardGames(filtered);
        };
        filterGames();
    }, [minPlayers, maxPlayers, playingTime]);

    return (
        <div>
            <h1>Elijah Game Library</h1>
            <div className="main-content">
                <label className="selection-label">
                    Min Players:
                    <select className="selection" value={minPlayers || ''} onChange={handleMinPlayersChange}>
                        <option value="">Any</option>
                        {minPlayerOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </label>
                <label className="selection-label">
                    Max Players:
                    <select className="selection" value={maxPlayers || ''} onChange={handleMaxPlayersChange}>
                        <option value="">Any</option>
                        {maxPlayerOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </label>
                <label className="selection-label">
                    Playing Time:
                    <select className="selection" value={playingTime || ''} onChange={handlePlayingTimeChange}>
                        <option value="">Any</option>
                        <option value="1-2">1-2 Hours</option>
                        <option value="3-4">3-4 Hours</option>
                        <option value="4+">Longer than 4 Hours</option>
                    </select>
                </label>
                <div>
                    <button className="button" onClick={handleResetFilters}>Reset Filters</button>
                </div>
            </div>
            {filteredBoardGames
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(game => (
                    <BoardGame key={game.id} id={game.id} />
                ))}
        </div>
    );
};

export default App;
