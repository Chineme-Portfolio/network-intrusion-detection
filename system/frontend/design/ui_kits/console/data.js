/* Fake but plausible fixtures for the Caught console kit. Deterministic PRNG so
   the screens look identical on every load. */
(function () {
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(20260812);
  const pick = (a) => a[Math.floor(rnd() * a.length)];

  const models = [
    { id: 'rf-v4', name: 'Random forest', arch: '120 trees, depth 18', precision: 0.984, recall: 0.978, f1: 0.981, latency: 1.2, size: '14.2 MB', trained: '2026-07-28', active: true },
    { id: 'xgb-v2', name: 'Gradient boosting', arch: '400 rounds, lr 0.08', precision: 0.991, recall: 0.969, f1: 0.980, latency: 2.4, size: '8.9 MB', trained: '2026-08-02' },
    { id: 'mlp-v1', name: 'Neural net', arch: '3 × 128 dense', precision: 0.962, recall: 0.981, f1: 0.971, latency: 3.8, size: '4.1 MB', trained: '2026-07-14' },
    { id: 'knn-v3', name: 'k-nearest', arch: 'k = 9, ball tree', precision: 0.948, recall: 0.933, f1: 0.940, latency: 11.6, size: '96.4 MB', trained: '2026-06-30' },
    { id: 'svm-v1', name: 'Linear SVM', arch: 'hinge, C = 1.0', precision: 0.937, recall: 0.902, f1: 0.919, latency: 0.7, size: '1.8 MB', trained: '2026-06-11' },
  ];

  const benign = [
    ['192.168.8.14', 44012, '93.184.216.34', 443, 'TCP', 'HTTPS'],
    ['192.168.8.31', 5353, '224.0.0.251', 5353, 'UDP', 'MDNS'],
    ['192.168.8.9', 51888, '10.4.2.4', 53, 'UDP', 'DNS'],
    ['192.168.8.52', 60122, '172.217.16.14', 443, 'TCP', 'HTTPS'],
    ['10.4.7.18', 47712, '10.4.2.11', 3306, 'TCP', 'MYSQL'],
    ['192.168.8.77', 39104, '151.101.1.69', 443, 'TCP', 'HTTPS'],
    ['10.4.7.4', 22, '10.4.19.8', 55210, 'TCP', 'SSH'],
    ['192.168.8.23', 137, '192.168.8.255', 137, 'UDP', 'NBNS'],
  ];
  const malicious = [
    ['10.4.19.22', 51204, '10.4.2.9', 445, 'TCP', 'SMB'],
    ['10.4.19.22', 51203, '10.4.2.9', 139, 'TCP', 'NBSS'],
    ['10.4.19.22', 51209, '10.4.2.9', 3389, 'TCP', 'RDP'],
    ['45.83.220.14', 6667, '10.4.7.31', 49402, 'TCP', 'IRC'],
    ['10.4.19.22', 51216, '10.4.2.9', 22, 'TCP', 'SSH'],
  ];
  const attacks = ['Port scan', 'SMB brute force', 'DoS Hulk', 'Botnet C2', 'Brute force — SSH'];
  /* Keep the label consistent with the flow it is attached to. */
  const attackFor = { 445: 'SMB brute force', 139: 'SMB brute force', 3389: 'Port scan', 22: 'Brute force — SSH', 49402: 'Botnet C2' };

  let seq = 4820;
  const pad = (n, w) => String(n).padStart(w, '0');
  function stamp(d) {
    return pad(d.getHours(), 2) + ':' + pad(d.getMinutes(), 2) + ':' + pad(d.getSeconds(), 2) + '.' + pad(d.getMilliseconds(), 3);
  }

  function makeFlow(when) {
    const bad = rnd() < 0.13;
    const row = bad ? pick(malicious) : pick(benign);
    const conf = bad ? 0.86 + rnd() * 0.13 : rnd() < 0.12 ? 0.58 + rnd() * 0.2 : 0.9 + rnd() * 0.099;
    const d = when || new Date();
    return {
      id: 'f' + (seq++),
      ts: stamp(d),
      src: row[0] + ':' + row[1],
      dst: row[2] + ':' + row[3],
      srcIp: row[0], dstIp: row[2], dstPort: row[3],
      proto: row[4],
      service: row[5],
      pkts: 6 + Math.floor(rnd() * 240),
      bytes: (bad ? 380 : 1200) + Math.floor(rnd() * 24000),
      dur: (bad ? 4 : 60) + Math.floor(rnd() * 900),
      verdict: bad ? 'malicious' : 'benign',
      attack: bad ? (attackFor[row[3]] || 'Port scan') : null,
      confidence: Number(conf.toFixed(2)),
      isNew: true,
    };
  }

  function seedFlows(n) {
    const out = [];
    const now = Date.now();
    for (let i = n; i > 0; i--) {
      const f = makeFlow(new Date(now - i * 820));
      f.isNew = false;
      out.push(f);
    }
    return out.reverse();
  }

  /* Feature contributions shown in the flow detail drawer. */
  const features = [
    { key: 'dst_port', label: 'Destination port', value: '445', weight: 0.31 },
    { key: 'flow_iat_std', label: 'IAT std dev', value: '0.004 s', weight: 0.24 },
    { key: 'syn_flag_cnt', label: 'SYN flags', value: '42', weight: 0.18 },
    { key: 'fwd_pkt_len_mean', label: 'Fwd pkt len mean', value: '58.2 B', weight: 0.11 },
    { key: 'flow_duration', label: 'Flow duration', value: '11 ms', weight: 0.09 },
    { key: 'bwd_pkts', label: 'Backward packets', value: '0', weight: 0.07 },
  ];

  const alerts = [
    { id: 'a1', host: '10.4.19.22', pattern: 'Port scan', flows: 42, window: '00:31', peak: 0.97, first: '14:21:36', target: '10.4.2.9', state: 'open' },
    { id: 'a2', host: '45.83.220.14', pattern: 'Botnet C2', flows: 6, window: '04:12', peak: 0.93, first: '14:18:04', target: '10.4.7.31', state: 'open' },
    { id: 'a3', host: '10.4.19.22', pattern: 'SMB brute force', flows: 18, window: '01:47', peak: 0.96, first: '14:12:51', target: '10.4.2.9', state: 'ack' },
    { id: 'a4', host: '192.168.8.66', pattern: 'DoS Hulk', flows: 311, window: '02:03', peak: 0.99, first: '13:58:20', target: '10.4.2.20', state: 'closed' },
  ];

  const agreement = [
    { id: 'rf-v4', verdict: 'malicious', confidence: 0.97 },
    { id: 'xgb-v2', verdict: 'malicious', confidence: 0.95 },
    { id: 'mlp-v1', verdict: 'malicious', confidence: 0.91 },
    { id: 'knn-v3', verdict: 'malicious', confidence: 0.74 },
    { id: 'svm-v1', verdict: 'benign', confidence: 0.62 },
  ];

  window.CaughtData = { models, makeFlow, seedFlows, features, alerts, agreement, attacks };
})();
