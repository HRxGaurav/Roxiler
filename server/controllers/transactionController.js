import Transaction from '../models/Transaction.js';



const listTransactions = async (req, res) => {
    try {
        const { month, page , search, perPage=10 } = req.query;
        
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);

        const filter = {
            $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
        };

        
        if (search) {
            const priceFilter = {
                $expr: {
                    $regexMatch: {
                        input: { $toString: "$price" },
                        regex: search.toString(),
                        options: "i"
                    }
                }
            };
            
            const textFilter = {
                $or: [
                    { productName: { $regex: new RegExp(search, 'i') } },
                    { description: { $regex: new RegExp(search, 'i') } }
                ]
            };

            filter.$or = [priceFilter, textFilter];
        }

        const totalCount = await Transaction.countDocuments(filter);

        const transactions = await Transaction.find(filter)
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.status(200).json({ transactions, totalCount });
    } catch (error) {
        console.error('Error listing transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getStatistics = async (req, res) => {
    try {
        const { month } = req.query;

        
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);

        
        const filter = {
            $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
        };

        
        const totalSaleAmount = await Transaction.aggregate([
            { $match: { ...filter, isSold: true } },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);

        
        const totalSoldItems = await Transaction.countDocuments({
            ...filter,
            isSold: true
        });

        
        const totalNotSoldItems = await Transaction.countDocuments({
            ...filter,
            isSold: false
        });

        res.status(200).json({
            totalSaleAmount: totalSaleAmount.length ? totalSaleAmount[0].total : 0,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        console.error('Error getting statistics:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const getBarChartData = async (req, res) => {
    try {
        const { month } = req.query;

       
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);

        
        const filter = {
            $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
        };

        
        const priceRanges = [
            { min: 0, max: 100 },
            { min: 101, max: 200 },
            { min: 201, max: 300 },
            { min: 301, max: 400 },
            { min: 401, max: 500 },
            { min: 501, max: 600 },
            { min: 601, max: 700 },
            { min: 701, max: 800 },
            { min: 801, max: 900 },
            { min: 901, max: Infinity } 
        ];

        const barChartData = [];
        for (const range of priceRanges) {
            const count = await Transaction.countDocuments({
                ...filter,
                price: { $gte: range.min, $lte: range.max }
            });
            const rangeLabel = range.max === Infinity ? `${range.min}-above` : `${range.min}-${range.max}`;
            barChartData.push({ range: rangeLabel, count });
        }

        res.status(200).json(barChartData);
    } catch (error) {
        console.error('Error getting bar chart data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const getPieChartData = async (req, res) => {
    try {
        const { month } = req.query;

        
        const filter = {
            $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
        };

        
        const categoryCounts = await Transaction.aggregate([
            { $match: filter },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        const pieChartData = categoryCounts.map(({ _id, count }) => ({ category: _id, count }));

        res.status(200).json(pieChartData);
    } catch (error) {
        console.error('Error getting pie chart data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

 
const getCombinedData = async (req, res) => {
    try {
        const { month } = req.body;
        const monthRegex = /^\d{4}-\d{2}$/;

        

        const startDate = new Date(month);
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);

        const filter = {
            dateOfSale: { $gte: startDate, $lt: endDate },
            isSold: true 
        };

        
        const totalSaleAmount = await Transaction.aggregate([
            { $match: filter },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);

        
        const totalSoldItems = await Transaction.countDocuments(filter);

        
        const totalNotSoldItems = await Transaction.countDocuments({
            dateOfSale: { $gte: startDate, $lt: endDate },
            isSold: false
        });

        const priceRanges = [
            { min: 0, max: 100 },
            { min: 101, max: 200 },
            { min: 201, max: 300 },
            { min: 301, max: 400 },
            { min: 401, max: 500 },
            { min: 501, max: 600 },
            { min: 601, max: 700 },
            { min: 701, max: 800 },
            { min: 801, max: 900 },
            { min: 901, max: Infinity } 
        ];

        const barChartData = [];
        for (const range of priceRanges) {
            const count = await Transaction.countDocuments({
                dateOfSale: { $gte: startDate, $lt: endDate },
                price: { $gte: range.min, $lte: range.max }
            });
            const rangeLabel = range.max === Infinity ? `${range.min}-above` : `${range.min}-${range.max}`;
            barChartData.push({ range: rangeLabel, count });
        }

        const pieChartData = await Transaction.aggregate([
            {
                $match: {
                    dateOfSale: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        const combinedData = {
            statistics: {
                totalSaleAmount: totalSaleAmount.length ? totalSaleAmount[0].total : 0,
                totalSoldItems,
                totalNotSoldItems
            },
            barChartData,
            pieChartData
        };

        res.json(combinedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





export { listTransactions, getStatistics, getBarChartData, getPieChartData, getCombinedData };