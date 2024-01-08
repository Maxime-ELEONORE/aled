import CoinGeckoService from '../Services/CoinGueckoService.js';
import { CryptoData, CryptoCandleSticks } from '../Models/CryptoDataModel.js';
import { getUsdToEur } from '../index.js'

const CryptoDataController = {
    async updateMarketData(cryptoID) {
        const marketData = await CoinGeckoService.fetchMarketData(cryptoID);
        if (!marketData) return;

        const {market_data, symbol, name, market_cap_rank, circulating_supply, total_supply, max_supply} = marketData;
        await CryptoData.findOneAndUpdate(
            {crypto: cryptoID},
            {
                symbol,
                name,
                rank: market_cap_rank,
                price: market_data.current_price.eur,
                priceChange24h: market_data.price_change_percentage_24h_in_currency.eur,
                volume24h: market_data.total_volume.eur,
                high24h: market_data.high_24h.eur,
                low24h: market_data.low_24h.eur,
                marketCap: market_data.market_cap.eur,
                circulatingSupply: circulating_supply,
                totalSupply: total_supply,
                maxSupply: max_supply,
                lastUpdated: market_data.last_updated
            },
            {upsert: true}
        );
    },
    async updateCandlestickData(cryptoID) {
        console.log(`Début de la mise à jour des données de chandeliers pour le cryptoID: ${cryptoID}`);

        console.log(`Récupération des données de chandeliers pour 4 jours.`);
        const candlesticksData4days = await CoinGeckoService.fetchCandlestickData(cryptoID);
        console.log(`Données récupérées pour 4 jours:`, candlesticksData4days);

        console.log(`Récupération des données de chandeliers pour 4 heures.`);
        const candlesticksData4hours = await CoinGeckoService.fetchCandlestickData(cryptoID, 30);
        console.log(`Données récupérées pour 4 heures:`, candlesticksData4hours);

        console.log(`Récupération des données de chandeliers pour 30 minutes.`);
        const candlesticksData30mins = await CoinGeckoService.fetchCandlestickData(cryptoID, 1);
        console.log(`Données récupérées pour 30 minutes:`, candlesticksData30mins);

        if (!candlesticksData4days || !candlesticksData4hours || !candlesticksData30mins) {
            console.log("Certaines données de chandeliers sont manquantes");
            return;
        }

        // ... Formatage des données ...
        console.log(`Formatage des données de chandeliers.`);
        const formattedCandlesticks4days = candlesticksData4days.map(candle => ({
            open: candle[1],
            high: candle[2],
            low: candle[3],
            close: candle[4],
            volume: candle[5],
            timestamp: new Date(candle[0])
        }));

        const formattedCandlesticks4hours = candlesticksData4hours.map(candle => ({
            open: candle[1],
            high: candle[2],
            low: candle[3],
            close: candle[4],
            volume: candle[5],
            timestamp: new Date(candle[0])
        }));

        const formattedCandlesticks30mins = candlesticksData30mins.map(candle => ({
            open: candle[1],
            high: candle[2],
            low: candle[3],
            close: candle[4],
            volume: candle[5],
            timestamp: new Date(candle[0])
        }));

        console.log(`Mise à jour de la base de données pour 4 jours.`);
        await CryptoCandleSticks.findOneAndUpdate(
            { crypto: cryptoID, period: '4days' },
            { $push: { candlesticks: { $each: formattedCandlesticks4days } } },
            { upsert: true }
        );
        console.log(`Mise à jour de la base de données pour 4 heures.`);
        await CryptoCandleSticks.findOneAndUpdate(
            {crypto: cryptoID, period: '4hours'},
            { $push: {
                candlesticks: { $each: formattedCandlesticks4hours }
                } },
            { upsert: true }
        );
        console.log(`Mise à jour de la base de données pour 30 mins.`);
        await CryptoCandleSticks.findOneAndUpdate(
            {crypto: cryptoID, period: '30mins'},
            { $push: {
                candlesticks: { $each: formattedCandlesticks30mins }
                } },
            { upsert: true }
        );
    },
    async getDatas(req, res)  {
        try {
            let result = [];
            const cryptoIds = req.params.cryptoIds.split(',');
            for (const cryptoId of cryptoIds){
                const datas = await CryptoData.findOne({crypto: cryptoId}).populate('crypto')
                result.push(datas);
            }
            res.status(200).send(result)
        } catch(err) {
            res.status(500).send({error: err})
        }
    },
    async getCandlesticksData(req, res) {
        try {
            const cryptoId = req.params.cryptoId;
            const period = req.params.period;
            const startDate = req.query.start ? new Date(req.query.start) : null;
            const endDate = req.query.end ? new Date(req.query.end) : null;

            const params = { crypto: cryptoId, period: period };
            const candlesticksData = await CryptoCandleSticks.findOne(params);

            if (candlesticksData && startDate && endDate) {
                candlesticksData.candlesticks = candlesticksData.candlesticks.filter(candlestick => {
                    const timestamp = new Date(candlestick.timestamp);
                    return timestamp >= startDate && timestamp <= endDate;
                });
            }

            res.status(200).json(candlesticksData);
        } catch (err) {
            res.status(500).send({ error: err });
        }
    },
    async getUSDtoEUR(req, res) {
        try {
            const result = getUsdToEur()
            res.status(200).json(result)
        } catch (e) {
            res.status(500).send({ error: e });
        }
    }
};
export default CryptoDataController;
