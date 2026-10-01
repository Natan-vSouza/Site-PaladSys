import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Idioma = "pt-BR" | "en" | "es";

const traducoes: Record<string, [string, string]> = {
  "O que fazemos": ["What we do", "Qué hacemos"],
  "O que pensamos": ["Insights", "Perspectivas"],
  "Quem somos": ["About us", "Quiénes somos"],
  "Entre em contato": ["Contact us", "Contáctenos"],
  "Início": ["Home", "Inicio"],
  "Contato": ["Contact", "Contacto"],
  "Nuvem Soberana": ["Sovereign Cloud", "Nube soberana"],
  "Resiliência de Dados": ["Data Resilience", "Resiliencia de datos"],
  "Serviços Gerenciados": ["Managed Services", "Servicios gestionados"],
  "Tecnologia": ["Technology", "Tecnología"],
  "como deve ser.": ["as it should be.", "como debe ser."],
  "Tecnologia como deve ser.": [
    "Technology as it should be.",
    "Tecnología como debe ser.",
  ],
  "Soberania · Resiliência · Continuidade": [
    "Sovereignty · Resilience · Continuity",
    "Soberanía · Resiliencia · Continuidad",
  ],
  "Conhecer soluções": ["Explore solutions", "Conocer soluciones"],
  "Entenda nosso propósito": [
    "Discover our purpose",
    "Conozca nuestro propósito",
  ],
  "Organizações dependem de tecnologia para operar. Garantimos que ela permaneça disponível, protegida e sob controle.": [
    "Organizations rely on technology to operate. We keep it available, protected and under control.",
    "Las organizaciones dependen de la tecnología para operar. Garantizamos que permanezca disponible, protegida y bajo control.",
  ],
  "Infraestrutura digital · Imagem ilustrativa": [
    "Digital infrastructure · Illustrative image",
    "Infraestructura digital · Imagen ilustrativa",
  ],
  "Saiba mais": ["Learn more", "Más información"],
  "Controle, proteção e continuidade.": [
    "Control, protection and continuity.",
    "Control, protección y continuidad.",
  ],
  "Controle": ["Control", "Control"],
  "Monitoramento": ["Monitoring", "Monitorización"],
  "Proteção": ["Protection", "Protección"],
  "Disponibilidade": ["Availability", "Disponibilidad"],
  "Explorar conteúdos": ["Explore insights", "Explorar contenidos"],
};

type ContextoIdioma = {
  idioma: Idioma;
  mudarIdioma: (idioma: Idioma) => void;
  t: (texto: string) => string;
};

const Contexto = createContext<ContextoIdioma | null>(null);

export function ProvedorIdioma({
  children,
}: {
  children: React.ReactNode;
}) {
  const [idioma, setIdioma] = useState<Idioma>("pt-BR");

  useEffect(() => {
    try {
      const salvo = localStorage.getItem("paladsys-idioma");

      if (salvo === "pt-BR" || salvo === "en" || salvo === "es") {
        setIdioma(salvo);
      }
    } catch {
      // O site continua funcionando se o armazenamento estiver bloqueado.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  function mudarIdioma(novo: Idioma) {
    setIdioma(novo);

    try {
      localStorage.setItem("paladsys-idioma", novo);
    } catch {
      // A seleção ainda funciona durante a visita.
    }
  }

  function t(texto: string) {
    if (idioma === "pt-BR") return texto;

    const traducao = traducoes[texto];

    return traducao?.[idioma === "en" ? 0 : 1] ?? texto;
  }

  return (
    <Contexto.Provider value={{ idioma, mudarIdioma, t }}>
      {children}
    </Contexto.Provider>
  );
}

export function useIdioma() {
  const contexto = useContext(Contexto);

  if (!contexto) {
    throw new Error("useIdioma precisa estar dentro de ProvedorIdioma.");
  }

  return contexto;
}

export function SeletorIdioma() {
  const { idioma, mudarIdioma } = useIdioma();
  const [aberto, setAberto] = useState(false);
  const area = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);

  const titulo = {
    "pt-BR": "Idioma do site",
    en: "Site language",
    es: "Idioma del sitio",
  }[idioma];

  useEffect(() => {
    if (!aberto) return;

    function clicarFora(evento: PointerEvent) {
      if (
        evento.target instanceof Node &&
        !area.current?.contains(evento.target)
      ) {
        setAberto(false);
      }
    }

    function teclado(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        setAberto(false);
        botao.current?.focus();
      }
    }

    document.addEventListener("pointerdown", clicarFora);
    document.addEventListener("keydown", teclado);

    return () => {
      document.removeEventListener("pointerdown", clicarFora);
      document.removeEventListener("keydown", teclado);
    };
  }, [aberto]);

  const opcoes: { valor: Idioma; nome: string }[] = [
    { valor: "pt-BR", nome: "Português (Brasil)" },
    { valor: "en", nome: "English" },
    { valor: "es", nome: "Español" },
  ];

  return (
    <div
      className="language"
      ref={area}
      onBlur={(evento) => {
        if (!evento.currentTarget.contains(evento.relatedTarget)) {
          setAberto(false);
        }
      }}
    >
      <button
        ref={botao}
        type="button"
        className="icon-button"
        aria-label={titulo}
        aria-expanded={aberto}
        aria-controls="opcoes-idioma"
        onClick={() => setAberto((valor) => !valor)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="4" ry="9" />
          <path d="M3 12h18" />
        </svg>
      </button>

      {aberto && (
        <div className="language-panel" id="opcoes-idioma">
          <strong>{titulo}</strong>

          <div className="idioma-opcoes">
            {opcoes.map((opcao) => (
              <button
                key={opcao.valor}
                type="button"
                className="idioma-opcao"
                lang={opcao.valor}
                aria-pressed={idioma === opcao.valor}
                onClick={() => {
                  mudarIdioma(opcao.valor);
                  setAberto(false);
                  botao.current?.focus();
                }}
              >
                {opcao.nome}
                <span aria-hidden="true">
                  {idioma === opcao.valor ? "✓" : ""}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}