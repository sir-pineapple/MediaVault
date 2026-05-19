async function parallelProcessing(items, batchSize, processor) {
    for (let i=0; i<items.length; i+=batchSize) {
        const batch = items.slice(i, i+batchSize);
        await Promise.all(batch.map(processor));
    }
}

module.exports = parallelProcessing;