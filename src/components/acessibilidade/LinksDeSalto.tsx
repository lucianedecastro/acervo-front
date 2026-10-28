/**
 * Links de salto (eMAG 1.5): aparecem ao pressionar Tab no início da página
 * e levam direto ao conteúdo, ao menu ou ao rodapé.
 * Os alvos (#conteudo, #menu, #rodape) ficam nos layouts.
 */
export default function LinksDeSalto() {
  return (
    <nav className="links-de-salto" aria-label="Links de salto">
      <a href="#conteudo">Ir para o conteúdo principal</a>
      <a href="#menu" style={{ left: "17rem" }}>Ir para o menu</a>
      <a href="#rodape" style={{ left: "30rem" }}>Ir para o rodapé</a>
    </nav>
  )
}
