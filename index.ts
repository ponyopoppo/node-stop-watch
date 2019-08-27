import fs from 'fs';

interface StatsData {
    min: number;
    max: number;
    avg: number;
    sum: number;
    cnt: number;
}

const defaultStatsData: StatsData = {
    min: Infinity,
    max: -Infinity,
    avg: 0,
    sum: 0,
    cnt: 0,
};

export default class StopWatch {
    private static loggingFunc: (text: string) => void = console.log;
    private static disabled = false;
    private static beginTime: { [key: string]: Date } = {};

    static stats: { [key: string]: StatsData } = {};

    static setLogging(func?: (text: string) => void) {
        if (func) this.loggingFunc = func;
        else this.loggingFunc = () => {};
    }

    static disable() {
        this.disabled = true;
    }

    static begin(key: string) {
        if (this.disabled) return;
        this.beginTime[key] = new Date();
    }

    static record(key: string) {
        if (this.disabled) return;
        if (!this.beginTime[key]) {
            this.loggingFunc(`Error for ${key}: It's not started.`);
            return;
        }
        const now = new Date().getTime();
        this.loggingFunc(
            `[${key}] rec: ${now - this.beginTime[key].getTime()}`
        );
    }

    static end(key: string) {
        if (this.disabled) return;
        if (!this.beginTime[key]) {
            this.loggingFunc(`Error for ${key}: It's not started.`);
            return;
        }
        const now = new Date().getTime();
        const diff = now - this.beginTime[key].getTime();
        delete this.beginTime[key];
        const statsData = this.stats[key] || defaultStatsData;
        const min = Math.min(statsData.min, diff);
        const max = Math.max(statsData.max, diff);
        const sum = statsData.sum + diff;
        const cnt = statsData.cnt + 1;
        const avg = sum / cnt;
        this.stats[key] = { min, max, sum, cnt, avg };
        this.loggingFunc(`[${key}] end: ${diff}`);
    }
}
