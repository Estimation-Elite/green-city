export default function HomePage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1>fb-leads-webhook</h1>
      <p>OK. Passerelle Make.com -&gt; GreenCity.</p>
      <p>
        Endpoint: <code>POST /api/leads/inbound</code>
      </p>
    </main>
  );
}
