import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { CategoriaAtleta } from "@/types/atleta"
import { User, Mail, Lock, CreditCard, Trophy, UserPlus } from "lucide-react"

export default function AtletaRegistroForm() {
  const navigate = useNavigate()

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [cpf, setCpf] = useState("")
  const [categoria, setCategoria] = useState<CategoriaAtleta>("ATIVA")

  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const payload = {
      nome,
      email,
      senha,
      cpf,
      categoria,
    }

    try {
      await atletaService.registrar(payload)
      alert("Cadastro realizado com sucesso. Faça login para continuar.")
      navigate("/login")
    } catch {
      alert("Erro ao realizar cadastro.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Card Principal */}
        <div className="bg-white border-4 sm:border-6 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          {/* Header */}
          <div className="bg-black border-b-4 sm:border-b-6 border-black p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-3">
              <UserPlus size={32} strokeWidth={3} className="text-[#D4A244]" />
              <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#D4A244]">
                Criar Conta
              </h1>
            </div>
            <p className="text-gray-400 font-bold text-sm">
              Cadastre-se para fazer parte do acervo da atleta brasileira
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Nome */}
            <div>
              <label className="flex items-center gap-2 text-xs font-black uppercase mb-2 text-gray-700">
                <User size={16} strokeWidth={3} />
                Nome Completo *
              </label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Digite seu nome completo"
                required
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-xs font-black uppercase mb-2 text-gray-700">
                <Mail size={16} strokeWidth={3} />
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>

            {/* CPF */}
            <div>
              <label className="flex items-center gap-2 text-xs font-black uppercase mb-2 text-gray-700">
                <CreditCard size={16} strokeWidth={3} />
                CPF *
              </label>
              <input
                type="text"
                value={cpf}
                onChange={e => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                required
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="flex items-center gap-2 text-xs font-black uppercase mb-2 text-gray-700">
                <Lock size={16} strokeWidth={3} />
                Senha *
              </label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Crie uma senha forte"
                required
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="flex items-center gap-2 text-xs font-black uppercase mb-2 text-gray-700">
                <Trophy size={16} strokeWidth={3} />
                Categoria *
              </label>
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value as CategoriaAtleta)}
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              >
                <option value="ATIVA">ATIVA</option>
                <option value="HISTORICA">HISTÓRICA</option>
                <option value="ESPOLIO">ESPÓLIO</option>
              </select>
              <p className="mt-2 text-xs text-gray-500 font-bold">
                Selecione a categoria que melhor representa seu perfil
              </p>
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-[#D4A244] text-black font-black uppercase text-sm border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <UserPlus size={18} strokeWidth={3} />
              {loading ? "Criando conta..." : "Registrar"}
            </button>
          </form>

          {/* Footer */}
          <div className="border-t-4 border-gray-200 p-6 bg-gray-50 text-center">
            <p className="text-sm text-gray-600 font-bold">
              Já tem uma conta?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-black font-black underline hover:text-[#D4A244] transition-colors"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
