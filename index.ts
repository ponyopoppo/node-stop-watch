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
    private _disabled = false;
    private beginTime: Date;
    private lastTime: Date;
    static stats: { [key: string]: StatsData } = {};

    static setLogging(func?: (text: string) => void) {
        if (func) this.loggingFunc = func;
        else this.loggingFunc = () => {};
    }

    static disableAll(value: boolean = true) {
        this.disabled = value;
    }

    disable(value: boolean = true) {
        this._disabled = value;
    }

    constructor(private key: string) {
        this.beginTime = new Date();
        this.lastTime = new Date();
    }

    record(comment: string) {
        if (StopWatch.disabled || this._disabled) return;
        const { key } = this;
        this.updateStats(key, comment);
    }

    end() {
        if (StopWatch.disabled || this._disabled) return;
        const { key } = this;
        this.updateStats(key, 'end');
        this.updateStats(key);
    }

    private updateStats(_key: string, comment?: string) {
        const key = comment ? `${_key}#${comment}` : _key;
        const now = new Date().getTime();
        const diff = comment
            ? now - this.lastTime.getTime()
            : now - this.beginTime.getTime();
        const statsData = StopWatch.stats[key] || defaultStatsData;
        const min = Math.min(statsData.min, diff);
        const max = Math.max(statsData.max, diff);
        const sum = statsData.sum + diff;
        const cnt = statsData.cnt + 1;
        const avg = sum / cnt;
        StopWatch.stats[key] = { min, max, sum, cnt, avg };
        StopWatch.loggingFunc(`[${key}]:\t${diff}`);
        this.lastTime = new Date();
    }

    static renderResult(): string {
        const rows = ['key', 'cnt', 'sum', 'avg', 'min', 'max'];
        return `
        <html><body><table id="table-id" border="1" style="width: 100%;">
        <thead>
            <tr>
                ${rows.map((row) => `<th>${row}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
        ${Object.keys(StopWatch.stats)
            .map((key) => {
                return `<tr>${rows
                    .map(
                        (row) =>
                            `<td>${
                                row === 'key' ? key : StopWatch.stats[key][row]
                            }</td>`
                    )
                    .join('')}
            </tr>`;
            })
            .join('')}
        </tbody>
        </table>
        <script src='https://cdnjs.cloudflare.com/ajax/libs/tablesort/5.1.0/tablesort.min.js'></script>
        <script src='https://cdnjs.cloudflare.com/ajax/libs/tablesort/5.1.0/sorts/tablesort.number.min.js'></script>
        <script src='https://cdnjs.cloudflare.com/ajax/libs/tablesort/5.1.0/sorts/tablesort.date.min.js'></script>
        <script>new Tablesort(document.getElementById('table-id'));</script>
        </body></html>`;
    }
}
