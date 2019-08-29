import StopWatch from '../';

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('measure', () => {
    it('should log', async () => {
        // StopWatch.disableAll();
        // StopWatch.setLogging();
        for (let index = 0; index < 30; index++) {
            const sw = new StopWatch(`key${Math.floor(Math.random() * 10)}`);
            await sleep(Math.floor(Math.random() * 10));
            sw.record('comment');
            sw.disable();
            await sleep(Math.floor(Math.random() * 10));
            sw.end();
        }
        // console.log(StopWatch.stats);
        // console.log(StopWatch.renderResult());
    });
});
