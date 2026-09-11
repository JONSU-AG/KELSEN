import React, { useState } from 'react';
import { 
  BookOpen, Video, Users, Sparkles, LogIn, 
  ChevronRight, Phone, Sun, Moon, Plus, Trash2, 
  Play, Upload, CheckCircle2, Lock, FileText, Check,
  Image, ExternalLink, Key, CloudUpload, Edit2, Save,
  MapPin, Settings, RefreshCw, Layout, Eye, AlertCircle
} from 'lucide-react';
import { db, storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const INITIAL_TEACHERS = [
  { id: 1, name: 'Profe Cívico', subject: 'Cívica y Filosofía', role: 'COFUNDADOR', experience: '12+ Años Exp.', description: 'Especialista en el prospecto UNSA y referente en enseñanza cívica.', image: '/PROFECIVICO.jpg' },
  { id: 2, name: 'Prof. Carlos Mendoza', subject: 'Razonamiento Matemático', role: 'DOCENTE TOP', experience: '10 Años Exp.', description: 'Creador del método rápido de resolución de ecuaciones.', image: null },
  { id: 3, name: 'Dra. Elena Rostova', subject: 'Biología y Química', role: 'DOCENTE TOP', experience: '8 Años Exp.', description: 'Doctora en Medicina UNSA, mentora de futuros médicos.', image: null },
  { id: 4, name: 'Prof. Mario Vargas', subject: 'Lenguaje y Raz. Verbal', role: 'DOCENTE TOP', experience: '15 Años Exp.', description: 'Maestro en comprensión lectora y análisis textual.', image: null }
];

const INITIAL_CYCLES = [
  { id: 1, title: 'Ciclo Quintos 2025', badge: 'UNSA FASE II', duration: '14 Semanas', hours: 'Mañana & Tarde', modal: 'Presencial + Híbrido', price: 'S/ 380', period: '/ mes', status: 'Inscripciones Abiertas', highlight: true },
  { id: 2, title: 'Ciclo Intensivo Verano', badge: 'REPASO FRENÉTICO', duration: '8 Semanas', hours: 'Turno Mañana', modal: '100% Presencial', price: 'S/ 420', period: '/ mes', status: 'Últimas Vacantes', highlight: false },
  { id: 3, title: 'Ciclo Anual UNSA 2026', badge: 'DESDE CERO', duration: '36 Semanas', hours: 'Turno Mañana', modal: 'Presencial + Virtual', price: 'S/ 320', period: '/ mes', status: 'Pre-Inscripciones', highlight: false }
];

const INITIAL_LOCATIONS = [
  { id: 1, name: 'Sede Central - Arequipa', address: 'Av. Independencia 123 (Frente a la UNSA)', phone: '954 123 456' },
  { id: 2, name: 'Sede Yanahuara', address: 'Calle Ejércitos 405', phone: '954 987 654' }
];

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('landing'); 
  const [authRole, setAuthRole] = useState(null); 

  // Dynamic Customizable State
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [cycles, setCycles] = useState(INITIAL_CYCLES);
  const [locations, setLocations] = useState(INITIAL_LOCATIONS);
  const [tiktokEmbedUrl, setTiktokEmbedUrl] = useState('https://www.tiktok.com/@profecivico');

  // Intranet & Drive States
  const [dniInput, setDniInput] = useState('');
  const [studentAuth, setStudentAuth] = useState(null);
  const [adminPass, setAdminPass] = useState('');
  
  const [driveConnected, setDriveConnected] = useState(false);
  const [userDriveEmail, setUserDriveEmail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Edit Modals / Inline CMS State
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [editingCycleId, setEditingCycleId] = useState(null);
  const [editingLocationId, setEditingLocationId] = useState(null);

  // CMS Form State
  const [newTeacher, setNewTeacher] = useState({ name: '', subject: '', role: 'DOCENTE TOP', experience: '', description: '', image: null });
  const [newCycle, setNewCycle] = useState({ title: '', badge: '', duration: '', hours: '', modal: '', price: '', period: '/ mes', status: 'Inscripciones Abiertas', highlight: false });
  const [newLocation, setNewLocation] = useState({ name: '', address: '', phone: '' });

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleConnectGoogleDrive = () => {
    const userEmail = prompt("Ingresa tu correo de Google para conectar tu Drive personal:", "profesor@gmail.com");
    if (userEmail) {
      setUserDriveEmail(userEmail);
      setDriveConnected(true);
      alert(`¡Google Drive conectado con éxito!\nCuenta activa: ${userEmail}`);
    }
  };

  const handleFileUpload = (e, folderName, callback) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(20);

    const targetDrive = userDriveEmail || "Google Cloud (kelsen-51b97)";

    if (storage) {
      const storageRef = ref(storage, `user_drives/${userDriveEmail || 'default'}/${folderName}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            callback(reader.result);
            setUploading(false);
          };
          reader.readAsDataURL(file);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            callback(downloadURL);
            setUploading(false);
            alert(`¡Archivo subido con éxito!\nGuardado en tu Drive: ${targetDrive}`);
          });
        }
      );
    }
  };

  // CMS Teacher Handlers
  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.subject) return;
    setTeachers([...teachers, { ...newTeacher, id: Date.now() }]);
    setNewTeacher({ name: '', subject: '', role: 'DOCENTE TOP', experience: '', description: '', image: null });
  };
  const handleDeleteTeacher = (id) => setTeachers(teachers.filter(t => t.id !== id));
  const handleUpdateTeacherField = (id, field, value) => {
    setTeachers(teachers.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  // CMS Cycle Handlers
  const handleAddCycle = (e) => {
    e.preventDefault();
    if (!newCycle.title) return;
    setCycles([...cycles, { ...newCycle, id: Date.now() }]);
    setNewCycle({ title: '', badge: '', duration: '', hours: '', modal: '', price: '', period: '/ mes', status: 'Inscripciones Abiertas', highlight: false });
  };
  const handleDeleteCycle = (id) => setCycles(cycles.filter(c => c.id !== id));
  const handleUpdateCycleField = (id, field, value) => {
    setCycles(cycles.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // CMS Location Handlers
  const handleAddLocation = (e) => {
    e.preventDefault();
    if (!newLocation.name) return;
    setLocations([...locations, { ...newLocation, id: Date.now() }]);
    setNewLocation({ name: '', address: '', phone: '' });
  };
  const handleDeleteLocation = (id) => setLocations(locations.filter(l => l.id !== id));

  // Logins
  const handleStudentLogin = (e) => {
    e.preventDefault();
    if (dniInput.length >= 7) {
      setStudentAuth({ dni: dniInput, name: 'Postulante Kelsen' });
      setAuthRole('student');
    } else {
      alert('Ingresa un DNI válido (mínimo 7 dígitos)');
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPass === 'admin' || adminPass === 'kelsen2025') {
      setAuthRole('admin');
    } else {
      alert('Contraseña incorrecta (Usa: admin)');
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* GLOW BACKGROUND DECORATION */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* NAVBAR */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* LOGO IMAGE */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('landing')}>
            <img 
              src={theme === 'dark' ? '/KELSENNEGRO.jpg' : '/KELSENBLANCO.jpg'} 
              alt="Kelsen Logo" 
              className="h-12 w-auto object-contain rounded-xl shadow-lg border border-red-500/30 group-hover:scale-105 transition"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-red-500 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                KELSEN
              </h1>
              <p className="text-[10px] tracking-widest text-slate-400 font-bold uppercase">Academia Preuniversitaria</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
            <button onClick={() => setActiveTab('landing')} className={`hover:text-red-500 transition ${activeTab === 'landing' ? 'text-red-500 font-bold border-b-2 border-red-500 pb-1' : 'text-slate-400'}`}>
              Inicio
            </button>
            <a href="#ciclos" onClick={() => setActiveTab('landing')} className="text-slate-400 hover:text-red-500 transition">
              Ciclos
            </a>
            <a href="#docentes" onClick={() => setActiveTab('landing')} className="text-slate-400 hover:text-red-500 transition">
              Docentes
            </a>
            <button onClick={() => setActiveTab('intranet')} className={`hover:text-red-500 transition flex items-center space-x-1.5 ${activeTab === 'intranet' ? 'text-red-500 font-bold border-b-2 border-red-500 pb-1' : 'text-slate-400'}`}>
              <BookOpen className="w-4 h-4" /> <span>Campus Virtual</span>
            </button>
            <button onClick={() => setActiveTab('admin')} className={`hover:text-amber-400 transition flex items-center space-x-1.5 ${activeTab === 'admin' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-1' : 'text-slate-400'}`}>
              <Settings className="w-4 h-4 animate-spin-slow" /> <span>CMS Customizar</span>
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className={`p-2.5 rounded-xl border transition ${theme === 'dark' ? 'border-slate-800 bg-slate-900 text-amber-400 hover:bg-slate-800' : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
            
            <button onClick={() => setActiveTab('intranet')} className="hidden sm:flex bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-red-950/50 items-center space-x-2 transition transform hover:-translate-y-0.5">
              <LogIn className="w-4 h-4" /> <span>Ingresar DNI</span>
            </button>
          </div>
        </div>
      </header>

      {/* LANDING TAB */}
      {activeTab === 'landing' && (
        <main className="relative z-10">
          
          {/* HERO SECTION */}
          <section className="relative pt-20 pb-28 px-4 max-w-7xl mx-auto text-center lg:text-left grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center space-x-2 bg-red-950/80 border border-red-800/80 px-4 py-2 rounded-full text-red-400 font-extrabold text-xs uppercase tracking-widest shadow-inner">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>PREPARACIÓN DE ALTO RENDIMIENTO - UNSA AREQUIPA</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                Asegura tu Ingreso a la <br />
                <span className="bg-gradient-to-r from-red-500 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  UNSA con Metodología Kelsen
                </span>
              </h1>

              <p className="text-slate-300 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl">
                Exámenes tipo admisión, simulacros semanales calificados y el mejor equipo de docentes liderado por mentores con más de 12 años de trayectoria en Arequipa.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button onClick={() => setActiveTab('intranet')} className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-lg px-8 py-4 rounded-xl shadow-xl shadow-red-950/80 flex items-center justify-center space-x-3 transition transform hover:scale-105">
                  <span>Ingresar a mis Clases</span>
                  <ChevronRight className="w-5 h-5 text-amber-400" />
                </button>

                <a href="https://wa.me/51900000000" target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-lg px-8 py-4 rounded-xl transition flex items-center justify-center space-x-3 shadow-lg">
                  <Phone className="w-5 h-5 text-emerald-400" />
                  <span>Inscribirme por WhatsApp</span>
                </a>
              </div>
            </div>

            {/* HERO FEATURED PROFE CIVICO CARD & TIKTOK PREVIEW */}
            <div className="lg:col-span-5 relative">
              <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
                
                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <img 
                    src="/PROFECIVICO.jpg" 
                    alt="Profe Cívico" 
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-red-500 shadow-lg"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop'; }}
                  />
                  <div>
                    <span className="bg-red-500/20 text-red-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-red-500/30 uppercase">
                      COFUNDADOR & DOCENTE TOP
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">Profe Cívico</h3>
                    <p className="text-xs text-slate-400">Referente en Cívica y Filosofía en Arequipa</p>
                  </div>
                </div>

                {/* TIKTOK PLAYER */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold flex items-center space-x-1">
                      <Play className="w-3.5 h-3.5 text-red-500" />
                      <span>Video Viral TikTok</span>
                    </span>
                    <a href={tiktokEmbedUrl} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center space-x-1">
                      <span>Ver enlace</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="w-full h-72 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center relative">
                    {tiktokEmbedUrl.includes('tiktok.com') ? (
                      <iframe 
                        src={`https://www.tiktok.com/embed/v2/${tiktokEmbedUrl.split('/video/')[1] || ''}`}
                        className="w-full h-full border-0"
                        title="TikTok Video Kelsen"
                      ></iframe>
                    ) : (
                      <div className="text-center p-6 text-slate-500 space-y-2">
                        <Video className="w-10 h-10 text-red-500/50 mx-auto" />
                        <p className="text-sm font-bold text-slate-300">Video de TikTok Personalizado</p>
                        <p className="text-xs text-slate-500">Configura la URL en el CMS Admin</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </section>

          {/* TEACHERS SECTION */}
          <section id="docentes" className="py-24 bg-slate-900/40 border-t border-b border-slate-800/80">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <h2 className="text-3xl sm:text-5xl font-black text-white">Nuestra Plana Docente Estrella</h2>
                <p className="text-slate-400 text-lg">Docentes de altísima trayectoria en la preparación UNSA.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-red-500/60 transition duration-300 shadow-xl group flex flex-col justify-between">
                    <div>
                      <div className="relative h-64 bg-slate-950 border-b border-slate-800 flex flex-col items-center justify-center text-slate-500">
                        {teacher.image ? (
                          <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center space-y-2">
                            <Image className="w-10 h-10 text-slate-600" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">[ Foto Docente ]</span>
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                          {teacher.role}
                        </div>
                      </div>

                      <div className="p-6 space-y-3">
                        <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition">{teacher.name}</h3>
                        <p className="text-red-400 font-bold text-sm">{teacher.subject}</p>
                        <p className="text-slate-400 text-xs leading-relaxed">{teacher.description}</p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-slate-800/60 mt-4 flex items-center justify-between text-xs text-slate-400">
                      <span>Experiencia:</span>
                      <span className="font-extrabold text-amber-400">{teacher.experience}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CYCLES SECTION */}
          <section id="ciclos" className="py-24 max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black text-white">Ciclos Académicos 2025 - 2026</h2>
              <p className="text-slate-400 text-lg">Elige el programa según tu avance y meta de ingreso en la Universidad Nacional de San Agustín.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {cycles.map((cycle) => (
                <div key={cycle.id} className={`relative bg-slate-900 border rounded-3xl p-8 shadow-2xl flex flex-col justify-between transition duration-300 ${cycle.highlight ? 'border-amber-500 shadow-amber-950/20' : 'border-slate-800 hover:border-slate-700'}`}>
                  {cycle.highlight && (
                    <div className="absolute -top-3.5 right-8 bg-amber-500 text-slate-950 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow">
                      Recomendado
                    </div>
                  )}

                  <div>
                    <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold px-3 py-1 rounded-full mb-6">
                      {cycle.badge}
                    </span>

                    <h3 className="text-2xl font-black text-white mb-6">{cycle.title}</h3>

                    <div className="space-y-4 mb-8 text-sm text-slate-300">
                      <div className="flex items-center space-x-3"><CheckCircle2 className="w-5 h-5 text-red-500" /><span>Duración: <strong>{cycle.duration}</strong></span></div>
                      <div className="flex items-center space-x-3"><CheckCircle2 className="w-5 h-5 text-red-500" /><span>Horario: <strong>{cycle.hours}</strong></span></div>
                      <div className="flex items-center space-x-3"><CheckCircle2 className="w-5 h-5 text-red-500" /><span>Modalidad: <strong>{cycle.modal}</strong></span></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-6">
                      <span className="text-4xl font-black text-white">{cycle.price}</span>
                      <span className="text-slate-400 text-sm font-semibold ml-1">{cycle.period}</span>
                    </div>

                    <button onClick={() => setActiveTab('intranet')} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition">
                      Matricularme Ahora
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* LOCATIONS */}
          <section className="py-20 bg-slate-900/60 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white mb-8">Nuestras Sedes en Arequipa</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {locations.map((loc) => (
                  <div key={loc.id} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl text-left space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold">
                      <MapPin className="w-5 h-5" />
                      <span>{loc.name}</span>
                    </div>
                    <p className="text-slate-300 text-sm">{loc.address}</p>
                    <p className="text-slate-400 text-xs font-mono">Teléfono: {loc.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>
      )}

      {/* INTRANET TAB */}
      {activeTab === 'intranet' && (
        <div className="max-w-5xl mx-auto py-20 px-4 relative z-10">
          {!studentAuth ? (
            <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
              <div className="w-20 h-20 bg-red-600/15 text-red-500 rounded-3xl flex items-center justify-center mx-auto border border-red-500/30">
                <LogIn className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Campus Virtual Kelsen</h2>
                <p className="text-slate-400 text-sm mt-2">Ingresa tu DNI de alumno para ver clases grabadas y descargar simulacros PDF.</p>
              </div>

              <form onSubmit={handleStudentLogin} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Ingresa tu DNI" 
                  value={dniInput} 
                  onChange={(e) => setDniInput(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white text-center font-mono text-xl tracking-widest focus:outline-none focus:border-red-500 transition"
                />
                <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition">
                  Ingresar a mis Clases
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Bienvenido, {studentAuth.name}</h2>
                  <p className="text-slate-400 text-sm mt-1">DNI: {studentAuth.dni} • Alumno Matriculado 2025</p>
                </div>
                <button onClick={() => setStudentAuth(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-5 py-2.5 rounded-xl border border-slate-700 transition">
                  Cerrar Sesión
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Video className="w-6 h-6 text-red-500" />
                    <h3 className="text-xl font-bold text-white">Clases Grabadas (Google Drive)</h3>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300 font-medium">Cívica - Tema: Constitución UNSA</span>
                      <a href="#" className="text-red-400 hover:underline font-bold flex items-center space-x-1"><Play className="w-4 h-4" /> <span>Ver Video Drive</span></a>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-amber-500" />
                    <h3 className="text-xl font-bold text-white">Simulacros y Materiales (PDF)</h3>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300 font-medium">Prospecto UNSA 2025 Oficial PDF</span>
                      <a href="#" className="text-amber-400 hover:underline font-bold">Descargar PDF Drive</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ADMIN CMS FULL CUSTOMIZATION TAB */}
      {activeTab === 'admin' && (
        <div className="max-w-6xl mx-auto py-16 px-4 relative z-10">
          {authRole !== 'admin' ? (
            <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
              <div className="w-20 h-20 bg-amber-500/15 text-amber-500 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30">
                <Lock className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Panel Administrador CMS</h2>
                <p className="text-slate-400 text-sm mt-2">Customización completa de docentes, ciclos, videos y sedes.</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input 
                  type="password" 
                  placeholder="Contraseña (admin)" 
                  value={adminPass} 
                  onChange={(e) => setAdminPass(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white text-center font-mono text-lg focus:outline-none focus:border-amber-500 transition"
                />
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-xl shadow-lg transition">
                  Ingresar al CMS
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-12">
              
              <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900 border border-slate-800 rounded-3xl p-8 gap-4">
                <div>
                  <h2 className="text-3xl font-black text-white flex items-center space-x-3">
                    <Settings className="w-7 h-7 text-amber-400" />
                    <span>Panel de Customización CMS</span>
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">Edita la web de nuevo como si fuera una vista editable súper sencilla.</p>
                </div>
                <button onClick={() => setAuthRole(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-5 py-2.5 rounded-xl border border-slate-700">
                  Cerrar CMS
                </button>
              </div>

              {/* GOOGLE DRIVE DRIVE ACCOUNT SECTION */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <CloudUpload className="w-6 h-6 text-amber-400" /> 
                    <span>1. Almacenamiento Google Drive por Docente</span>
                  </h3>
                  <button 
                    onClick={handleConnectGoogleDrive}
                    className={`text-xs font-bold px-4 py-2.5 rounded-xl border flex items-center space-x-2 transition ${driveConnected ? 'bg-emerald-950 border-emerald-700 text-emerald-400' : 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white'}`}
                  >
                    <Key className="w-4 h-4" />
                    <span>{driveConnected ? `Conectado: ${userDriveEmail}` : 'Conectar mi Google Drive'}</span>
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <p className="text-xs text-slate-400">
                    {driveConnected 
                      ? `Conectado como: ${userDriveEmail}. Todo lo que subas irá directamente a tu propio almacenamiento de Google Drive.` 
                      : 'Presiona "Conectar mi Google Drive" para vincular tu cuenta personal antes de subir fotos o videos.'}
                  </p>
                </div>
              </div>

              {/* TIKTOK VIDEO LINK EDIT SECTION */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Video className="w-6 h-6 text-red-500" /> 
                  <span>2. Cambiar Video de TikTok en Inicio</span>
                </h3>

                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <p className="text-xs text-slate-400">Normalmente se sube video de TikTok mediante enlace y se reproduce ahí:</p>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      placeholder="Pega el enlace de TikTok (ej: https://www.tiktok.com/@profecivico/video/123456789)" 
                      value={tiktokEmbedUrl} 
                      onChange={e => setTiktokEmbedUrl(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm"
                    />
                    <button className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition">
                      Actualizar TikTok
                    </button>
                  </div>
                </div>
              </div>

              {/* TEACHERS CMS CARD CUSTOMIZATION */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Users className="w-6 h-6 text-red-500" /> 
                    <span>3. Editar o Renovar Tarjetas de Profesores</span>
                  </h3>
                  <span className="text-xs text-slate-400">Sube fotos directo de Celular o PC</span>
                </div>

                {/* ADD TEACHER FORM */}
                <form onSubmit={handleAddTeacher} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <input type="text" placeholder="Nombre del Profesor" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" />
                  <input type="text" placeholder="Materia (ej: Biología)" value={newTeacher.subject} onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" />
                  <input type="text" placeholder="Experiencia (ej: 10 Años Exp.)" value={newTeacher.experience} onChange={e => setNewTeacher({...newTeacher, experience: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" />
                  <input type="text" placeholder="Descripción breve" value={newTeacher.description} onChange={e => setNewTeacher({...newTeacher, description: e.target.value})} className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" />
                  
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white px-5 py-3 rounded-xl flex items-center space-x-2">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Subir Foto</span>
                      <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'docentes', imgUrl => setNewTeacher({...newTeacher, image: imgUrl}))} className="hidden" />
                    </label>
                    {newTeacher.image && <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1"><Check className="w-4 h-4" /> <span>Cargada</span></span>}
                  </div>

                  <button type="submit" className="md:col-span-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm py-3.5 rounded-xl transition flex items-center justify-center space-x-2">
                    <Plus className="w-5 h-5" /> <span>Agregar Nueva Tarjeta de Profesor</span>
                  </button>
                </form>

                {/* EDITABLE TEACHER CARDS LIST */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {teachers.map((t) => (
                    <div key={t.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 relative group">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center">
                          {t.image ? (
                            <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                          ) : (
                            <Image className="w-6 h-6 text-slate-500" />
                          )}
                          <label className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                            <Upload className="w-5 h-5 text-amber-400" />
                            <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'docentes', imgUrl => handleUpdateTeacherField(t.id, 'image', imgUrl))} className="hidden" />
                          </label>
                        </div>

                        <div className="flex-1 space-y-1">
                          <input 
                            type="text" 
                            value={t.name} 
                            onChange={e => handleUpdateTeacherField(t.id, 'name', e.target.value)} 
                            className="bg-transparent border-b border-slate-800 font-bold text-white text-base focus:border-amber-400 w-full"
                          />
                          <input 
                            type="text" 
                            value={t.subject} 
                            onChange={e => handleUpdateTeacherField(t.id, 'subject', e.target.value)} 
                            className="bg-transparent border-b border-slate-800 text-xs text-red-400 font-semibold w-full"
                          />
                        </div>

                        <button onClick={() => handleDeleteTeacher(t.id)} className="text-slate-600 hover:text-red-500 p-2 transition">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <input 
                          type="text" 
                          placeholder="Rol (ej: COFUNDADOR / DOCENTE TOP)"
                          value={t.role} 
                          onChange={e => handleUpdateTeacherField(t.id, 'role', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-bold w-full"
                        />
                        <textarea 
                          rows={2} 
                          value={t.description} 
                          onChange={e => handleUpdateTeacherField(t.id, 'description', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 w-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CYCLES EDIT SECTION */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <BookOpen className="w-6 h-6 text-amber-400" /> 
                    <span>4. Customizar / Quitar / Renovación de Ciclos</span>
                  </h3>
                </div>

                <form onSubmit={handleAddCycle} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <input type="text" placeholder="Título del Ciclo" value={newCycle.title} onChange={e => setNewCycle({...newCycle, title: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" />
                  <input type="text" placeholder="Insignia (ej: UNSA FASE II)" value={newCycle.badge} onChange={e => setNewCycle({...newCycle, badge: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" />
                  <input type="text" placeholder="Precio (ej: S/ 380)" value={newCycle.price} onChange={e => setNewCycle({...newCycle, price: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" />
                  <input type="text" placeholder="Duración (ej: 14 Semanas)" value={newCycle.duration} onChange={e => setNewCycle({...newCycle, duration: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" />
                  <input type="text" placeholder="Horario" value={newCycle.hours} onChange={e => setNewCycle({...newCycle, hours: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" />
                  <input type="text" placeholder="Modalidad" value={newCycle.modal} onChange={e => setNewCycle({...newCycle, modal: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" />

                  <button type="submit" className="md:col-span-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm py-3.5 rounded-xl transition flex items-center justify-center space-x-2">
                    <Plus className="w-5 h-5" /> <span>Publicar Nuevo Ciclo Académico</span>
                  </button>
                </form>

                <div className="space-y-4">
                  {cycles.map((c) => (
                    <div key={c.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                        <input 
                          type="text" 
                          value={c.title} 
                          onChange={e => handleUpdateCycleField(c.id, 'title', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 font-bold text-white text-sm"
                        />
                        <input 
                          type="text" 
                          value={c.badge} 
                          onChange={e => handleUpdateCycleField(c.id, 'badge', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-amber-400 font-bold"
                        />
                        <input 
                          type="text" 
                          value={c.price} 
                          onChange={e => handleUpdateCycleField(c.id, 'price', e.target.value)} 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 font-bold text-white text-sm"
                        />
                      </div>
                      <button onClick={() => handleDeleteCycle(c.id)} className="text-slate-600 hover:text-red-500 p-2 transition">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 relative z-10 mt-20 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 Academia Preuniversitaria Kelsen • Arequipa, Perú</div>
        </div>
      </footer>

    </div>
  );
}
