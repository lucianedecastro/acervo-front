import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { modalidadeService } from "@/services/modalidadeService"
import { mediaService } from "@/services/mediaService"
import { Modalidade } from "@/types/modalidade"
import {
  CategoriaAtleta,
  TipoChavePix,
  StatusAtleta,
} from "@/types/atleta"

export default function AtletaCadastroForm() {
  const navigate = useNavigate()

  /* =======================
     IDENTIFICAÇÃO
     ======================= */
  const [nome, setNome] = useState("")
  const [nomeSocial, setNomeSocial] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [senha, setSenha] = useState("")

  /* =======================
     PERFIL ESPORTIVO
     ======================= */
  const [biografia, setBiografia] = useState("")
  const [categoria, setCategoria] = useState<CategoriaAtleta>("ATIVA")
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState<string[]>([])

  /* =======================
     REPRESENTAÇÃO (ESPÓLIO)
     ======================= */
  const [nomeRepresentante, setNomeRepresentante] = useState("")
  const [cpfRepresentante, setCpfRepresentante] = useState("")
  const [vinculoRepresentante, setVinculoRepresentante] = useState("")

  /* =======================
     GOVERNANÇA / CONTATO
     ======================= */
  const [contratoAssinado, setContratoAssinado] = useState(false)
  const [linkContratoDigital, setLinkContratoDigital] = useState("")
  const [dadosContato, setDadosContato] = useState("")

  /* =======================
     FINANCEIRO
     ======================= */
  const [tipoChavePix, setTipoChavePix] = useState<TipoChavePix>("CPF")
  const [chavePix, setChavePix] = useState("")
  const [banco, setBanco] = useState("")
  const [agencia, setAgencia] = useState("")
  const [conta, setConta] = useState("")
  const [tipoConta, setTipoConta] = useState("")
  const [comissaoPlataformaDiferenciada, setComissaoPlataformaDiferenciada] =
    useState<number>(0)

  /* =======================
     MÍDIA
     ======================= */
  const [fotoDestaqueUrl, setFotoDestaqueUrl] = useState("")
  const [fotoDestaqueId, setFotoDestaqueId] = useState("")

  /* =======================
     UI
     ======================= */
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  /* =======================
     LOAD MODALIDADES
     ======================= */
  useEffect(() => {
    modalidadeService.listarAdmin()
      .then(setModalidades)
      .finally(() => setLoading(false))
  }, [])

  async function handleUploadFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const data = await mediaService.upload(file, "/acervo/upload")
      setFotoDestaqueId(data.id)
      setFotoDestaqueUrl(data.url)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      nome,
      nomeSocial: nomeSocial || undefined,
      cpf,
      email,
      senha,

      modalidades: modalidadesSelecionadas,
      biografia,
      categoria,

      nomeRepresentante:
        categoria === "ESPOLIO" ? nomeRepresentante : undefined,
      cpfRepresentante:
        categoria === "ESPOLIO" ? cpfRepresentante : undefined,
      vinculoRepresentante:
        categoria === "ESPOLIO" ? vinculoRepresentante : undefined,

      contratoAssinado,
      linkContratoDigital: linkContratoDigital || undefined,
      dadosContato: dadosContato || undefined,

      tipoChavePix,
      chavePix: tipoChavePix === "NENHUM" ? "N/A" : chavePix,
      banco,
      agencia,
      conta,
      tipoConta,

      comissaoPlataformaDiferenciada:
        comissaoPlataformaDiferenciada > 0
          ? comissaoPlataformaDiferenciada
          : undefined,

      fotoDestaqueId: fotoDestaqueId || undefined,
      statusAtleta: "ATIVO" as StatusAtleta,
    }

    try {
      await atletaService.completarCadastro(payload)
      alert("Cadastro enviado para verificação.")
      navigate("/atleta/dashboard")
    } catch {
      alert("Erro ao enviar cadastro.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: "2rem" }}>Carregando…</div>

  return (
    <section style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
      <h1>Cadastro da Atleta</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* IDENTIFICAÇÃO */}
        <fieldset>
          <legend>Identificação</legend>
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome completo" required />
          <input value={nomeSocial} onChange={e => setNomeSocial(e.target.value)} placeholder="Nome social" />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
          <input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="CPF" required />
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha" required />
        </fieldset>

        {/* PERFIL */}
        <fieldset>
          <legend>Perfil Esportivo</legend>
          <textarea value={biografia} onChange={e => setBiografia(e.target.value)} />
          <select value={categoria} onChange={e => setCategoria(e.target.value as CategoriaAtleta)}>
            <option value="ATIVA">ATIVA</option>
            <option value="HISTORICA">HISTÓRICA</option>
            <option value="ESPOLIO">ESPÓLIO</option>
          </select>
        </fieldset>

        {/* FOTO */}
        <fieldset>
          <legend>Foto de Destaque</legend>
          {fotoDestaqueUrl && <img src={fotoDestaqueUrl} style={{ maxWidth: 200 }} />}
          <input type="file" onChange={handleUploadFoto} disabled={uploading} />
        </fieldset>

        <button type="submit" disabled={saving || uploading}>
          {saving ? "Enviando…" : "Finalizar Cadastro"}
        </button>
      </form>
    </section>
  )
}
