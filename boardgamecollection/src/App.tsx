import React, { useEffect, useState } from 'react';  
import axios from 'axios';  

const boardGameIds = [47, 100901, 175914, 147949, 180956, 221965, 188834, 356768, 54043, 10547, 274364, 230802, 193037, 229741, 234691, 115746, 170216, 266192, 34119, 13, 237182, 256960, 332686, 297562, 155821, 342942, 224783, 162886, 167791, 224517, 167355, 55690]; // Replace with your actual board game IDs  

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
       minplayers: parseInt(xml.getElementsByTagName('minplayers')[0].getAttribute('value') || '0'),  
       maxplayers: parseInt(xml.getElementsByTagName('maxplayers')[0].getAttribute('value') || '0'),  
       playingtime: parseInt(xml.getElementsByTagName('playingtime')[0].getAttribute('value') || '0')  
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
           const games = await Promise.all(boardGameIds.map(id => fetchBoardGameData(id)));  
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
           setMinPlayerOptions([...new Set(games.map(game => game.minplayers))].sort((a, b) => a - b));
           setMaxPlayerOptions([...new Set(games.map(game => game.maxplayers))].sort((a, b) => a - b));
       };  
       filterGames();  
   }, [minPlayers, maxPlayers, playingTime]);  

   return (  
       <div>  
           <h1>Elijah Game Library</h1>  
           <div>  
               <label>  
                   Min Players:  
                   <select value={minPlayers || ''} onChange={handleMinPlayersChange}>
                       <option value="">Any</option>
                       {minPlayerOptions.map(option => (
                           <option key={option} value={option}>{option}</option>
                       ))}
                   </select>
               </label>  
               <label>  
                   Max Players:  
                   <select value={maxPlayers || ''} onChange={handleMaxPlayersChange}>
                       <option value="">Any</option>
                       {maxPlayerOptions.map(option => (
                           <option key={option} value={option}>{option}</option>
                       ))}
                   </select>
               </label>  
               <label>  
                   Playing Time:  
                   <select value={playingTime || ''} onChange={handlePlayingTimeChange}>
                       <option value="">Any</option>
                       <option value="1-2">1-2 Hours</option>
                       <option value="3-4">3-4 Hours</option>
                       <option value="4+">Longer than 4 Hours</option>
                   </select>
               </label>  
               <button onClick={handleResetFilters}>Reset Filters</button>
           </div>  
           {filteredBoardGames.map(game => (  
               <BoardGame key={game.id} id={game.id} />  
           ))}  
       </div>  
   );  
};  

export default App;