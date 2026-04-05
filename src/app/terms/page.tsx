import Link from "next/link";

export const metadata = {
  title: "Términos de Servicio | Studdia",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#060608] text-white font-sans px-6 py-16 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors mb-8 inline-flex items-center gap-1.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Volver al inicio
        </Link>

        <h1 className="text-3xl font-black tracking-tight mb-2 mt-4">Términos de Servicio</h1>
        <p className="text-gray-500 text-sm mb-10">Última actualización: 31 de marzo de 2026</p>

        <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-base mb-2">1. Aceptación de los Términos</h2>
            <p>Al acceder o usar Studdia («el Servicio»), aceptas quedar vinculado por estos Términos de Servicio. Si no estás de acuerdo, por favor no uses el Servicio.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">2. Descripción del Servicio</h2>
            <p>Studdia es una aplicación web que ofrece herramientas de concentración y productividad: temporizador Pomodoro, sonidos de ambiente, gestión de tareas, listas de música y una liga semanal competitiva. La versión básica del Servicio es gratuita.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">3. Cuentas de usuario</h2>
            <p>Puedes iniciar sesión en Studdia mediante tu cuenta de Google vía OAuth 2.0. Al iniciar sesión, nos autorizas a acceder a información básica de tu perfil (nombre y correo electrónico) únicamente para identificar tu cuenta y guardar tus preferencias.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">4. Uso aceptable</h2>
            <p>Aceptas no hacer un uso indebido del Servicio, no intentar obtener acceso no autorizado, no interrumpir ni sobrecargar nuestra infraestructura, y no usar el Servicio con fines ilegales.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">5. Propiedad intelectual</h2>
            <p>Todo el contenido y código del Servicio es propiedad de Studdia y sus desarrolladores. No puedes copiar, reproducir ni distribuir ninguna parte del Servicio sin permiso expreso.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">6. Exención de garantías</h2>
            <p>El Servicio se proporciona «tal cual», sin garantías de ningún tipo. No garantizamos que el Servicio sea ininterrumpido, libre de errores o de componentes dañinos.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">7. Limitación de responsabilidad</h2>
            <p>En la máxima medida permitida por la ley, Studdia no será responsable de daños indirectos, incidentales, especiales o derivados del uso del Servicio.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">8. Cambios en los términos</h2>
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado del Servicio tras los cambios implica la aceptación de los nuevos términos.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">9. Contacto</h2>
            <p>Si tienes preguntas sobre estos Términos, contáctanos en <span className="text-violet-400">support@studdia.app</span>.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex gap-6 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">Política de Privacidad</Link>
          <Link href="/" className="hover:text-gray-300 transition-colors">Inicio</Link>
        </div>
      </div>
    </main>
  );
}
