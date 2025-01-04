import axios from 'axios';


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

export default fetchBoardGameData;