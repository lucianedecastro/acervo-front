export default function Home() {
  return (
    <main style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1>Acervo "Carmen Lydia" da Mulher Brasileira no Esporte</h1>
        <p>
          Plataforma dedicada à preservação da memória das mulheres no esporte
          brasileiro, reunindo atletas, modalidades e histórias que marcaram
          gerações.
        </p>
      </header>

      <section style={{ marginBottom: "3rem" }}>
        <h2>Modalidades</h2>
        <p>
          Conheça as modalidades esportivas presentes no acervo e descubra suas
          trajetórias históricas.
        </p>

        <a href="/modalidades">
          <button>Ver modalidades</button>
        </a>
      </section>

      <section>
        <h2>Sobre o Acervo</h2>
        <p>
          O Acervo Carmen Lydia nasce do compromisso com a memória, a pesquisa
          acadêmica e a valorização da presença feminina no esporte.
        </p>
      </section>
    </main>
  )
}
