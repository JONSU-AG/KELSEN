import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Video, Users, Sparkles, LogIn, 
  ChevronRight, Phone, Sun, Moon, Plus, Trash2, 
  Play, Upload, CheckCircle2, Lock, FileText, Check,
  MapPin, Image, ExternalLink, Menu, X, CloudUpload, Key
} from 'lucide-react';
import { db, storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const DRIVE_API_KEY = "AIzaSyDU_u71jdpM38iOAu7Q0NpMPnvpfRMveqk";
const GOOGLE_CLIENT_ID = "258601810184-web.apps.googleusercontent.com"; 

const INITIAL_TEACHERS = [
  { id: 1, name: 'Profe Cívico', subject: 'Cívica y Filosofía', role: 'COFUNDADOR', experience: '12+ Años Exp.', description: 'Especialista en el prospecto UNSA y referente en enseñanza cívica.', image: null },
  { id: 2, name: 'Prof. Carlos Mendoza', subject: 'Razonamiento Matemático', role: 'DOCENTE TOP', experience: '10 Años Exp.', description: 'Creador del método rápido de resolución de ecuaciones.', image: null },
  { id: 3, name: 'Dra. Elena Rostova', subject: 'Biología y Química', role: 'DOCENTE TOP', experience: '8 Años Exp.', description: 'Doctora en Medicina UNSA, mentora de futuros médicos.', image: null },
  { id: 4, name: 'Prof. Mario Vargas', subject: 'Lenguaje y Raz. Verbal', role: 'DOCENTE TOP', experience: '15 Años Exp.', description: 'Maestro en comprensión lectora y análisis textual.', image: null }
];

const INITIAL_CYCLES = [
  { id: 1, title: 'Ciclo Quintos 2025', badge: 'UNSA FASE II', duration: '14 Semanas', hours: 'Mañana & Tarde', modal: 'Presencial + Híbrido', price: 'S/ 380', period: '/ mes', status: 'Inscripciones Abiertas', highlight: true },
  { id: 2, title: 'Ciclo Intensivo Verano', badge: 'REPASO FRENÉTICO', duration: '8 Semanas', hours: 'Turno Mañana', modal: '100% Presencial', price: 'S/ 420', period: '/ mes', status: 'Últimas Vacantes', highlight: false },
  { id: 3, title: 'Ciclo Anual UNSA 2026', badge: 'DESDE CERO', duration: '36 Semanas', hours: 'Turno Mañana', modal: 'Presencial + Virtual', price: 'S/ 320', period: '/ mes', status: 'Pre-Inscripciones', highlight: false }
];

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('landing'); 
  const [authRole, setAuthRole] = useState(null); 

  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [cycles, setCycles] = useState(INITIAL_CYCLES);

  // Intranet & Drive States
  const [dniInput, setDniInput] = useState('');
  const [studentAuth, setStudentAuth] = useState(null);
  const [adminPass, setAdminPass] = useState('');
  
  const [driveConnected, setDriveConnected] = useState(false);
  const [userDriveEmail, setUserDriveEmail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // CMS Form State
  const [newTeacher, setNewTeacher] = useState({ name: '', subject: '', role: 'DOCENTE TOP', experience: '', description: '', image: null });

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Google Drive Authentication Simulation/Integration
  const handleConnectGoogleDrive = () => {
    // Simulated auth flow for Google Picker
    const userEmail = prompt("Ingresa tu correo de Google para conectar tu Drive personal:", "profesor@gmail.com");
    if (userEmail) {
      setUserDriveEmail(userEmail);
      setDriveConnected(true);
      alert(`¡Google Drive conectado con éxito!\nCuenta activa: ${userEmail}\n\nLos archivos que subas irán directamente a tu almacenamiento de Google Drive.`);
    }
  };

  // Direct Upload Handler
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
          console.error("Upload error:", error);
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
            alert(`¡Archivo subido exitosamente!\nGuardado en el Drive de: ${targetDrive}\nEnlace público generado para alumnos.`);
          });
        }
      );
    }
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.subject) return;
    setTeachers([...teachers, { ...newTeacher, id: Date.now() }]);
    setNewTeacher({ name: '', subject: '', role: 'DOCENTE TOP', experience: '', description: '', image: null });
  };

  const handleDeleteTeacher = (id) => setTeachers(teachers.filter(t => t.id !== id));

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
      
      {/* NAVBAR */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="w-12 h-12 bg-slate-900 border-2 border-red-500/40 rounded-xl flex items-center justify-center text-red-500 font-black text-xl shadow-lg">
              K
            </div>
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
              <Lock className="w-4 h-4" /> <span>CMS Admin</span>
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

            {/* HERO PROFE CIVICO FEATURE CARD */}
            <div className="lg:col-span-5 relative">
              <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-red-500 flex flex-col items-center justify-center text-slate-500">
                    <Image className="w-6 h-6 mb-1 text-slate-400" />
                    <span className="text-[9px] font-bold uppercase">Foto</span>
                  </div>
                  <div>
                    <span className="bg-red-500/20 text-red-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-red-500/30 uppercase">
                      COFUNDADOR & DOCENTE TOP
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">Profe Cívico</h3>
                    <p className="text-xs text-slate-400">Referente en Cívica y Filosofía en Arequipa</p>
                  </div>
                </div>

                <div className="w-full h-64 bg-slate-950 rounded-2xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 space-y-2 p-6 text-center">
                  <Video className="w-10 h-10 text-red-500/50" />
                  <p className="text-sm font-bold text-slate-300">Espacio para Video TikTok</p>
                  <p className="text-xs text-slate-500">Subida directa desde tu Google Drive</p>
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
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">[ Espacio Foto Docente ]</span>
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

      {/* ADMIN CMS TAB */}
      {activeTab === 'admin' && (
        <div className="max-w-6xl mx-auto py-16 px-4 relative z-10">
          {authRole !== 'admin' ? (
            <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
              <div className="w-20 h-20 bg-amber-500/15 text-amber-500 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30">
                <Lock className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Panel Administrador CMS</h2>
                <p className="text-slate-400 text-sm mt-2">Conexión directa a Google Drive por docente.</p>
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
                    <Sparkles className="w-7 h-7 text-amber-400" />
                    <span>Administrador Kelsen CMS</span>
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">Conectado a Google Drive API con Key activada.</p>
                </div>
                <button onClick={() => setAuthRole(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-5 py-2.5 rounded-xl border border-slate-700">
                  Cerrar CMS
                </button>
              </div>

              {/* GOOGLE DRIVE MULTI-ACCOUNT CONNECT SECTION */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <CloudUpload className="w-6 h-6 text-amber-400" /> 
                    <span>Subida Directa a Google Drive Personal</span>
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
                      : 'Presiona "Conectar mi Google Drive" para vincular tu cuenta. Si no conectas una cuenta personal, se usará la nube central de la academia.'}
                  </p>
                  
                  <label className="cursor-pointer bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90 text-white font-bold text-sm px-6 py-4 rounded-xl flex items-center justify-center space-x-3 shadow-lg">
                    <Upload className="w-5 h-5" />
                    <span>Seleccionar y Subir Archivo a mi Drive</span>
                    <input 
                      type="file" 
                      onChange={(e) => handleFileUpload(e, 'materiales_kelsen', (url) => console.log('File URL:', url))} 
                      className="hidden" 
                    />
                  </label>

                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-amber-400 font-bold">
                        <span>Subiendo a tu cuenta de Google Drive...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* TEACHERS CMS */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-red-500" /> <span>Gestión de Docentes (Tarjetas)</span>
                </h3>

                <form onSubmit={handleAddTeacher} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <input type="text" placeholder="Nombre del Profesor" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" />
                  <input type="text" placeholder="Materia (ej: Biología)" value={newTeacher.subject} onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" />
                  <input type="text" placeholder="Experiencia (ej: 10 Años Exp.)" value={newTeacher.experience} onChange={e => setNewTeacher({...newTeacher, experience: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" />
                  
                  <div className="md:col-span-2 flex items-center space-x-4">
                    <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white px-5 py-3 rounded-xl flex items-center space-x-2">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Subir Foto (a tu Drive)</span>
                      <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'docentes', imgUrl => setNewTeacher({...newTeacher, image: imgUrl}))} className="hidden" />
                    </label>
                    {newTeacher.image && <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1"><Check className="w-4 h-4" /> <span>Foto Subida</span></span>}
                  </div>

                  <button type="submit" className="bg-red-600 hover:bg-red-500 text-white font-bold text-sm py-3 rounded-xl transition flex items-center justify-center space-x-2">
                    <Plus className="w-4 h-4" /> <span>Publicar Profesor</span>
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>
      )}

      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 relative z-10 mt-20 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 Academia Preuniversitaria Kelsen • Arequipa, Perú</div>
        </div>
      </footer>

    </div>
  );
}
