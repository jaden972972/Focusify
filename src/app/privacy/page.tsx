import Link from "next/link";

export const metadata = {
  title: "Política de Privacidad | Studdia",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#060608] text-white font-sans px-6 py-16 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors mb-8 inline-flex items-center gap-1.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Volver al inicio
        </Link>

        <h1 className="text-3xl font-black tracking-tight mb-2 mt-4">Política de Privacidad</h1>
        <p className="text-gray-500 text-sm mb-10">Última actualización: 31 de marzo de 2026</p>

        <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-base mb-2">1. Introducción</h2>
            <p>Studdia («nosotros», «nuestro») se compromete a proteger tu información personal. Esta Política de Privacidad explica qué datos recopilamos, cómo los usamos y tus derechos al respecto.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">2. Información que recopilamos</h2>
            <p>Cuando inicias sesión con Google, recibimos de tu cuenta la siguiente información:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li>Tu nombre</li>
              <li>Tu dirección de correo electrónico</li>
              <li>Tu foto de perfil de Google (avatar)</li>
            </ul>
            <p className="mt-2">También almacenamos datos generados por el usuario, como tus listas de reproducción guardadas y listas de tareas.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">3. Cómo usamos tu información</h2>
            <p>Utilizamos la información recopilada exclusivamente para:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li>Identificar y autenticar tu cuenta</li>
              <li>Guardar y sincronizar tus preferencias entre dispositivos</li>
              <li>Ofrecerte funciones personalizadas dentro del Servicio</li>
            </ul>
            <p className="mt-2">No vendemos, alquilamos ni compartimos tus datos personales con terceros con fines comerciales o publicitarios.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">4. Almacenamiento de datos</h2>
            <p>Tus datos se almacenan de forma segura mediante <span className="text-violet-400">Supabase</span>, proveedor de bases de datos de terceros. Los datos están cifrados en tránsito (HTTPS/TLS) y en reposo. Puedes consultar la política de privacidad de Supabase en <span className="text-violet-400">supabase.com/privacy</span>.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">5. Cookies y almacenamiento local</h2>
            <p>Utilizamos cookies para mantener tu sesión autenticada. Estas cookies son estrictamente necesarias para mantenerte conectado y no se usan para rastreo ni publicidad.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">6. Servicios de terceros</h2>
            <p>Studdia utiliza los siguientes servicios de terceros:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li><strong className="text-gray-300">Google OAuth</strong> — autenticación de usuarios</li>
              <li><strong className="text-gray-300">Supabase</strong> — base de datos y gestión de cuentas</li>
              <li><strong className="text-gray-300">YouTube Data API</strong> — reproducción de música y vídeos</li>
              <li><strong className="text-gray-300">Vercel</strong> — alojamiento de la aplicación</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">7. Conservación y eliminación de datos</h2>
            <p>Tus datos se conservan mientras tu cuenta esté activa. Puedes solicitar la eliminación de tu cuenta y todos los datos asociados en cualquier momento contactándonos. Atenderemos las solicitudes de eliminación en un plazo de 30 días.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">8. Privacidad de menores</h2>
            <p>Studdia no está dirigido a menores de 13 años. No recopilamos conscientemente información personal de niños. Si crees que un menor nos ha proporcionado sus datos, contáctanos de inmediato.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">9. Tus derechos</h2>
            <p>Dependiendo de tu ubicación, puedes tener derecho a acceder, corregir o eliminar tus datos personales. Para ejercer estos derechos, contáctanos en <span className="text-violet-400">support@studdia.app</span>.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">10. Cambios en esta política</h2>
            <p>Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos los cambios significativos actualizando la fecha en la parte superior de esta página.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">11. Contacto</h2>
            <p>Si tienes preguntas sobre esta Política de Privacidad, contáctanos en <span className="text-violet-400">support@studdia.app</span>.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex gap-6 text-xs text-gray-600">
          <Link href="/terms" className="hover:text-gray-300 transition-colors">Términos de Servicio</Link>
          <Link href="/" className="hover:text-gray-300 transition-colors">Inicio</Link>
        </div>
      </div>
    </main>
  );
}
