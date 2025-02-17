const generateDummyTransactions = (count) => {
    const businesses = ["Freelance Writing Services", "Digital Marketing Agency", "E-commerce Store", "Graphic Design Studio", "Software Development Firm"];
    const industries = ["Content Writing", "Marketing", "Retail", "Design", "IT Services"];
    const upiHandles = ["@upi", "@pay", "@bank", "@service", "@fast"];
    
    const transactions = Array.from({ length: count }, (_, i) => {
        const randomBusinessIndex = Math.floor(Math.random() * businesses.length);
        const randomIndustryIndex = Math.floor(Math.random() * industries.length);
        const randomUpiIndex = Math.floor(Math.random() * upiHandles.length);
        const amount = Math.floor(Math.random() * 50000) + 1000; // Amount between 1000 and 51000
        const date = new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString();
        const uniqueId = Math.floor(Math.random() * 900000) + 100000;
        
        return {
            "date": date,
            "businessName": businesses[randomBusinessIndex],
            "industryType": industries[randomIndustryIndex],
            "transferAmount": amount,
            "customerUPI": `customer${uniqueId}${upiHandles[randomUpiIndex]}`,
            "customerUTR": `UTR${uniqueId}`,
            "orderId": `ORD${uniqueId}`,
            "txnId": `TXN${uniqueId}`,
            "mdrRate": parseFloat((Math.random() * 2).toFixed(2)) // MDR rate between 0% and 2%
        };
    });
    
    console.log(JSON.stringify(transactions, null, 2));
};

generateDummyTransactions(100);
