
  let _workletCalls = 0;
let _lastWorkletReport = Date.now();

export function workletMonitor() {
  _workletCalls++;
  const now = Date.now();
  if (now - _lastWorkletReport >= 1000) {
    console.log(`Worklet calls/sec: ${_workletCalls}`);
    _workletCalls = 0;
    _lastWorkletReport = now;
  }
}



export const logWorklet = (msg: string, data?: any) => {
  console.log(`[Worklet] ${msg}`, data ?? '');
};