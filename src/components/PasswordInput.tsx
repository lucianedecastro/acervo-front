import { useState, InputHTMLAttributes } from "react"
import { Eye, EyeOff } from "lucide-react"

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  /** Classe do contêiner. O input recebe `className` e precisa de padding direito (pr-11 ou mais) para o botão. */
  wrapperClassName?: string
}

/**
 * Campo de senha com botão "olhinho" para mostrar/ocultar o texto.
 */
export default function PasswordInput({ className = "", wrapperClassName = "", ...props }: Props) {
  const [visivel, setVisivel] = useState(false)

  return (
    <div className={`relative ${wrapperClassName}`}>
      <input {...props} type={visivel ? "text" : "password"} className={className} />
      <button
        type="button"
        onClick={() => setVisivel(v => !v)}
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={visivel}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-acl-muted hover:text-acl-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-acl-gold"
      >
        {visivel ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}
