export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="font-bold text-xl">Workshop PCC</span>
            </div>
            <p className="text-gray-400 text-sm">
              Workshop merupakan salah satu divisi yang ada di UKM Polytechnic Computer Club yang bertanggung jawab terhadap departement dibawahnya, bertanggung jawab pada pelatihan yang ada di UKM Polytechnic Computer Club
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#about" className="hover:text-white transition">Tentang</a></li>
              <li><a href="#program" className="hover:text-white transition">Program</a></li>
              <li><a href="#team" className="hover:text-white transition">Tim</a></li>
              <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Program</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#program" className="hover:text-white transition">Software Development</a></li>
              <li><a href="#program" className="hover:text-white transition">Network Engineering</a></li>
              <li><a href="#program" className="hover:text-white transition">Multimedia Design</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Kontak</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Politeknik Negeri Semarang</li>
              <li>Jl. Prof. Sudarto, SH, Tembalang</li>
              <li>Semarang, Jawa Tengah</li>
              <li className="pt-2">
                <a href="mailto:workshop@pcc.com" className="hover:text-white transition">workshop@pcc.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Divisi Workshop PCC - Polytechnic Computer Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
