// Layer 0 placeholder. The operator UI (flow table, verdict stream, model
// switcher, source selector, live metrics) is generated from the Claude Design
// export in later slices; see system/context/design-handoff.md. The UI prime
// directive: make the current verdict, and whether to trust it, obvious at a glance.
export default function App() {
  return (
    <main className="shell">
      <h1>Caught</h1>
      <p className="tagline">Network intrusion detection — system skeleton (Layer 0).</p>
      <p>Nothing is classified yet. The live UI arrives with the keystone.</p>
    </main>
  );
}
