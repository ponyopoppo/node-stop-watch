import StopWatch from '../';

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('measure', () => {
    it('should log', async () => {
        // StopWatch.disable();
        StopWatch.setLogging();
        for (let index = 0; index < 10; index++) {
            StopWatch.begin('key1');
            await sleep(5);
            StopWatch.record('key1');
            await sleep(5);
            StopWatch.end('key1');
        }
        for (let index = 0; index < 10; index++) {
            StopWatch.begin('key2');
            await sleep(3);
            StopWatch.record('key2');
            await sleep(3);
            StopWatch.end('key2');
        }
        console.log(StopWatch.stats);
    });
});
