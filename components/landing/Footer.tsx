export default function Footer() {
  return (
    <footer className="bg-[#02040a] text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-900/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 font-bold text-xl font-mono">W</span>
              </div>
              <span className="font-bold text-xl font-mono tracking-tight">Workshop<span className="text-blue-500">_PCC</span></span>
            </div>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              Workshop merupakan salah satu divisi yang ada di UKM Polytechnic Computer Club yang bertanggung jawab terhadap departement dibawahnya.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4 font-mono text-blue-400">_QUICK_LINKS</h3>
            <ul className="space-y-2 text-gray-500 font-mono text-sm">
              <li><a href="#about" className="hover:text-white transition-colors hover:underline decoration-blue-500 underline-offset-4">About</a></li>
              <li><a href="#program" className="hover:text-white transition-colors hover:underline decoration-blue-500 underline-offset-4">Tracks</a></li>
              <li><a href="#team" className="hover:text-white transition-colors hover:underline decoration-blue-500 underline-offset-4">Team</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors hover:underline decoration-blue-500 underline-offset-4">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 font-mono text-purple-400">_PROGRAMS</h3>
            <ul className="space-y-2 text-gray-500 font-mono text-sm">
              <li><a href="#program" className="hover:text-white transition-colors hover:underline decoration-purple-500 underline-offset-4">Software Development</a></li>
              <li><a href="#program" className="hover:text-white transition-colors hover:underline decoration-purple-500 underline-offset-4">Network Engineering</a></li>
              <li><a href="#program" className="hover:text-white transition-colors hover:underline decoration-purple-500 underline-offset-4">Multimedia Design</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 font-mono text-green-400">_CONTACT</h3>
            <ul className="space-y-2 text-gray-500 text-sm font-mono">
              <li>Politeknik Negeri Semarang</li>
              <li>Jl. Prof. Sudarto, SH, Tembalang</li>
              <li>Semarang, Jawa Tengah</li>
              <li className="pt-2">
                <a href="mailto:workshop@pcc.com" className="text-blue-400 hover:text-blue-300 transition-colors">workshop@pcc.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-600 text-sm font-mono">
          <p>&copy; 2025 Divisi Workshop PCC - Polytechnic Computer Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
