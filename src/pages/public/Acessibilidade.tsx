import { Link } from "react-router-dom"

// Preencha com o e-mail da equipe para receber relatos de barreiras de acessibilidade.
const EMAIL_CONTATO = ""

export default function Acessibilidade() {
  return (
    <div className="bg-acl-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <p className="eyebrow text-acl-gold-text mb-4">Para todas as pessoas</p>
        <h1 className="mb-6">Acessibilidade</h1>
        <p className="text-acl-ink-soft mb-10">
          O Acervo Carmen Lydia quer ser acessível a todas as pessoas, inclusive pessoas com deficiência
          visual, auditiva, motora ou cognitiva. Buscamos seguir as diretrizes WCAG 2.1 (nível AA) e o
          Modelo de Acessibilidade em Governo Eletrônico (eMAG).
        </p>

        <section aria-labelledby="recursos" className="mb-10">
          <h2 id="recursos" className="mb-4">Recursos disponíveis em todas as páginas</h2>
          <ul className="space-y-3 text-acl-ink-soft list-disc pl-5">
            <li>
              <strong className="text-acl-ink">VLibras:</strong> traduz textos do site para a Língua
              Brasileira de Sinais. Use o botão do VLibras na lateral direita da tela.
            </li>
            <li>
              <strong className="text-acl-ink">Barra de Acessibilidade:</strong> botão no canto inferior
              esquerdo, com aumento do texto (até 150%), alto contraste, sublinhado de links, fonte mais
              legível, espaçamento de texto e redução de animações. Suas escolhas ficam salvas neste
              navegador.
            </li>
            <li>
              <strong className="text-acl-ink">Links de salto:</strong> ao pressionar a tecla Tab no início
              da página, aparecem atalhos para ir direto ao conteúdo, ao menu ou ao rodapé.
            </li>
            <li>
              <strong className="text-acl-ink">Navegação por teclado:</strong> todo o site pode ser usado
              sem mouse. Use Tab e Shift+Tab para percorrer, Enter para ativar e Esc para fechar a barra de
              acessibilidade.
            </li>
            <li>
              <strong className="text-acl-ink">Leitores de tela:</strong> a troca de página é anunciada, e os
              campos de formulário, botões e menus têm nomes descritivos.
            </li>
            <li>
              <strong className="text-acl-ink">Respeito às preferências do sistema:</strong> se o seu
              dispositivo pede menos movimento, as animações são reduzidas automaticamente.
            </li>
          </ul>
        </section>

        <section aria-labelledby="limites" className="mb-10">
          <h2 id="limites" className="mb-4">Limitações conhecidas</h2>
          <p className="text-acl-ink-soft">
            Trabalhamos continuamente para melhorar. Algumas fotografias históricas podem ter descrições
            resumidas, e o conteúdo carregado de serviços externos (como o VLibras) segue as regras desses
            serviços.
          </p>
        </section>

        <section aria-labelledby="contato" className="mb-10">
          <h2 id="contato" className="mb-4">Encontrou uma barreira?</h2>
          <p className="text-acl-ink-soft">
            {EMAIL_CONTATO ? (
              <>
                Conte para nós pelo e-mail{" "}
                <a className="underline text-acl-gold-text" href={`mailto:${EMAIL_CONTATO}`}>{EMAIL_CONTATO}</a>,
                dizendo a página e o que não funcionou. Retornaremos o mais breve possível.
              </>
            ) : (
              <>Relate o problema à equipe do acervo, informando a página e o que não funcionou.</>
            )}
          </p>
        </section>

        <Link to="/" className="btn-secondary-light">Voltar ao início</Link>
      </div>
    </div>
  )
}
