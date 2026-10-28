import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CreditCard, Lock, Mail, Trophy, User } from "lucide-react"
import PasswordInput from "@/components/PasswordInput"
import { atletaService } from "@/services/atletaService"
import { CategoriaAtleta } from "@/types/atleta"
import { mensagemErroCadastro } from "@/utils/erroApi"

const inputClass =
  "w-full pl-10 pr-4 py-3 border border-acl-line rounded-sm text-sm bg-white focus:outline-none focus:border-acl-gold-deep transition-colors"

export default function AtletaRegistroForm() {
  const navigate = useNavigate()

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [categoria, setCategoria] = useState<CategoriaAtleta>("ATIVA")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.")
      return
    }

    setLoading(true)
    try {
      await atletaService.registrar({ nome, email, senha, cpf, categoria })
      alert("Cadastro recebido! Seu perfil será analisado pela curadoria. Faça login para continuar.")
      navigate("/login")
    } catch (err) {
      setError(mensagemErroCadastro(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-acl-cream py-12 px-4 sm:px-6">
      <div className="w-full max-w-lg card-editorial p-6 sm:p-8">
        <div className="mb-7 text-center">
          <h1 className="font-serif text-2xl sm:text-3xl text-acl-ink mb-2">Criar conta de atleta</h1>
          <p className="text-acl-muted text-sm">
            Cadastre-se para fazer parte do acervo da atleta brasileira. Seu perfil será analisado pela curadoria.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="atleta-nome" className="block text-xs text-acl-ink-soft mb-2">Nome completo *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-acl-muted" size={16} aria-hidden="true" />
              <input id="atleta-nome" type="text" value={nome} onChange={e => setNome(e.target.value)} required
                     maxLength={150} autoComplete="name" className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="atleta-email" className="block text-xs text-acl-ink-soft mb-2">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-acl-muted" size={16} aria-hidden="true" />
              <input id="atleta-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required
                     placeholder="seu@email.com" autoComplete="email" className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="atleta-cpf" className="block text-xs text-acl-ink-soft mb-2">CPF *</label>
            <div className="relative">
              <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-acl-muted" size={16} aria-hidden="true" />
              <input id="atleta-cpf" type="text" value={cpf} onChange={e => setCpf(e.target.value)} required
                     inputMode="numeric" maxLength={14} placeholder="000.000.000-00" className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="atleta-senha" className="block text-xs text-acl-ink-soft mb-2">Senha * (mínimo de 8 caracteres)</label>
            <div className="relative">
              <Lock className="z-10 pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-acl-muted" size={16} aria-hidden="true" />
              <PasswordInput id="atleta-senha" value={senha} onChange={e => setSenha(e.target.value)} required
                             minLength={8} maxLength={72} autoComplete="new-password"
                             className={`${inputClass} pr-11`} />
            </div>
          </div>

          <div>
            <label htmlFor="atleta-confirmar" className="block text-xs text-acl-ink-soft mb-2">Confirmar senha *</label>
            <div className="relative">
              <Lock className="z-10 pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-acl-muted" size={16} aria-hidden="true" />
              <PasswordInput id="atleta-confirmar" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)}
                             required minLength={8} maxLength={72} autoComplete="new-password"
                             className={`${inputClass} pr-11`} />
            </div>
          </div>

          <div>
            <label htmlFor="atleta-categoria" className="block text-xs text-acl-ink-soft mb-2">Categoria *</label>
            <div className="relative">
              <Trophy className="absolute left-3.5 top-1/2 -translate-y-1/2 text-acl-muted" size={16} aria-hidden="true" />
              <select id="atleta-categoria" value={categoria} onChange={e => setCategoria(e.target.value as CategoriaAtleta)}
                      aria-describedby="atleta-categoria-ajuda" className={inputClass}>
                <option value="ATIVA">Ativa</option>
                <option value="HISTORICA">Histórica</option>
                <option value="ESPOLIO">Espólio</option>
              </select>
            </div>
            <p id="atleta-categoria-ajuda" className="mt-2 text-xs text-acl-muted">
              Selecione a categoria que melhor representa o seu perfil.
            </p>
          </div>

          {error && (
            <div className="bg-acl-wine/10 border border-acl-wine rounded-sm p-3" role="alert">
              <p className="text-acl-wine text-sm text-center">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-acl-ink-soft">
          Já tem uma conta?{" "}
          <Link to="/login" className="underline hover:text-acl-gold-text">Fazer login</Link>
        </p>
      </div>
    </div>
  )
}
