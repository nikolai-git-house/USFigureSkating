/**
 * Run a promise-based function, but ensure resolution doesn't occur before a specified amount of time
 */
export function enforcePromiseResolutionDuration<T = any>(enfore_duration_ms: number, method: (...args: any[]) => Promise<T>, args: any[]): Promise<T> {
    const start_time = new Date()
        .getTime();

    /**
     * Enforce an elapsed duration before running a callback function
     */
    function enforcedDuration(callback: Function) {
        const current_time = new Date()
            .getTime();
        const elapsed = current_time - start_time;
        const wait_duration = enfore_duration_ms - elapsed;
        if (wait_duration <= 0) {
            callback();

            return;
        }
        setTimeout(() => {
            callback();
        }, wait_duration);

    }

    return new Promise((resolve, reject) => {
        method(...args)
            .then((args: any) => {
                enforcedDuration(() => {
                    resolve(args);
                });
            })
            .catch((args: any) => {
                enforcedDuration(() => {
                    reject(args);
                });
            });
    });

}