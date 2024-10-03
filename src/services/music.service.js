
class MusicService {

    ask = async (ask) => {
        const targetUrl = `http://ac.mp3.zing.vn/complete?type=artist,song,key,code&num=500&query=${encodeURIComponent(ask)}`;

        try {
            const response = await fetch(targetUrl);
            const data = await response.json();

            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    }

}

module.exports = new MusicService()