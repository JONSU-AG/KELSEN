import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Video, Users, Sparkles, LogIn, 
  ChevronRight, ChevronLeft, Phone, Sun, Moon, Plus, Trash2, 
  Play, Upload, CheckCircle2, Lock, FileText, Check,
  Image, ExternalLink, Key, CloudUpload, Edit2, Save,
  MapPin, Settings, RefreshCw, Layout, Eye, AlertCircle,
  Calendar, MessageSquare, Shield, UserCheck, X, Download, Share2
} from 'lucide-react';
import { db, storage } from './firebase';

// 1. Initial State Definitions
const INITIAL_ADMINS = [
  { id: 1, email: 'admin@kelsen.edu.pe', name: 'Director Académico', role: 'SUPER_ADMIN' },
  { id: 2, email: 'profecivico@gmail.com', name: 'Profe Cívico', role: 'ADMIN' }
];

const INITIAL_REGISTERED_STUDENTS = [
  { id: 1, dni: '72849102', name: 'Mateo Quispe Gómez', cycle: 'Ciclo Quintos 2025', turn: 'Turno Mañana' },
  { id: 2, dni: '74125896', name: 'Valeria Condori Flores', cycle: 'Ciclo Intensivo Verano', turn: 'Turno Tarde' },
  { id: 3, dni: '70258147', name: 'Rodrigo Abarca Pinto', cycle: 'Ciclo Anual UNSA 2026', turn: 'Turno Mañana' }
];

const INITIAL_TEACHERS = [
  { id: 1, name: 'Profe Cívico', subject: 'Cívica y Filosofía', role: 'COFUNDADOR', description: 'Especialista en el prospecto UNSA y referente en enseñanza cívica.', image: '/PROFECIVICO.jpg' },
  { id: 2, name: 'Prof. Carlos Mendoza', subject: 'Razonamiento Matemático', role: 'DOCENTE', description: 'Creador del método rápido de resolución de ejercicios tipo UNSA.', image: null },
  { id: 3, name: 'Dra. Elena Rostova', subject: 'Biología y Química', role: 'DOCENTE', description: 'Doctora en Medicina UNSA, mentora de futuros alumnos de biomédicas.', image: null },
  { id: 4, name: 'Prof. Mario Vargas', subject: 'Lenguaje y Raz. Verbal', role: 'DOCENTE', description: 'Maestro en comprensión lectora y análisis textual preuniversitario.', image: null }
];

const INITIAL_CYCLES = [
  { id: 1, title: 'Ciclo Quintos 2025', badge: 'UNSA FASE II', duration: '14 Semanas', hours: 'Mañana & Tarde', modal: 'Presencial + Híbrido', status: 'Inscripciones Abiertas', highlight: true, syllabusPdfUrl: 'https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true' },
  { id: 2, title: 'Ciclo Intensivo Verano', badge: 'REPASO FRENÉTICO', duration: '8 Semanas', hours: 'Turno Mañana', modal: '100% Presencial', status: 'Últimas Vacantes', highlight: false, syllabusPdfUrl: 'https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true' },
  { id: 3, title: 'Ciclo Anual UNSA 2026', badge: 'DESDE CERO', duration: '36 Semanas', hours: 'Turno Mañana', modal: 'Presencial + Virtual', status: 'Pre-Inscripciones', highlight: false, syllabusPdfUrl: 'https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true' }
];

const INITIAL_LOCATIONS = [
  { id: 1, name: 'Sede Central - Arequipa', address: 'Av. Independencia 123 (Frente a la UNSA)', phone: '954 123 456' },
  { id: 2, name: 'Sede Yanahuara', address: 'Calle Ejércitos 405', phone: '954 987 654' }
];

const INITIAL_CLASSES = [
  { id: 1, title: 'Cívica — Semana 3: Constitución y Derechos Humanos', course: 'Cívica', week: 'Semana 3', driveVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', driveMaterialUrl: 'https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true', materialTitle: 'Resumen y Banco de Preguntas Cívica UNSA' },
  { id: 2, title: 'Raz. Matemático — Semana 3: Planteo de Ecuaciones y Móviles', course: 'Raz. Matemático', week: 'Semana 3', driveVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', driveMaterialUrl: 'https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true', materialTitle: 'Guía Práctica N° 3 - Raz. Matemático' }
];

const INITIAL_SCHEDULE = [
  { id: 1, day: 'Lunes', time: '08:00 - 10:00 AM', course: 'Cívica y Filosofía', teacher: 'Profe Cívico' },
  { id: 2, day: 'Martes', time: '08:00 - 10:00 AM', course: 'Raz. Matemático', teacher: 'Prof. Carlos Mendoza' },
  { id: 3, day: 'Miércoles', time: '08:00 - 10:00 AM', course: 'Biología y Anatomía', teacher: 'Dra. Elena Rostova' },
  { id: 4, day: 'Jueves', time: '08:00 - 10:00 AM', course: 'Lenguaje y Raz. Verbal', teacher: 'Prof. Mario Vargas' },
  { id: 5, day: 'Viernes', time: '08:00 - 11:00 AM', course: 'Simulacro Tipo Examen UNSA', teacher: 'Plana Docente Kelsen' }
];

const INITIAL_FORUM_POSTS = [
  { id: 1, studentName: 'Mateo Quispe', question: '¿El simulacro del viernes incluirá preguntas de la Constitución del 93?', answer: 'Sí, estimado Mateo. Abarcará los primeros 14 artículos del prospecto oficial UNSA.', answeredBy: 'Profe Cívico' }
];

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('landing'); 
  
  // Dynamic Content States
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [cycles, setCycles] = useState(INITIAL_CYCLES);
  const [locations, setLocations] = useState(INITIAL_LOCATIONS);
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [forumPosts, setForumPosts] = useState(INITIAL_FORUM_POSTS);
  
  // Modular On/Off Settings for Campus
  const [moduleScheduleEnabled, setModuleScheduleEnabled] = useState(true);
  const [moduleForumEnabled, setModuleForumEnabled] = useState(true);
  
  // WhatsApp Settings
  const [whatsappNumber, setWhatsappNumber] = useState('51954123456');
  const [whatsappDefaultMessage, setWhatsappDefaultMessage] = useState('Hola Academia Kelsen, deseo información para asegurar mi ingreso a la UNSA.');
  const [tiktokEmbedUrl, setTiktokEmbedUrl] = useState('https://www.tiktok.com/@profecivico');

  // Interactive Carousel State
  const [activeTeacherIndex, setActiveTeacherIndex] = useState(0);

  // Authentication & Roles
  const [adminsList, setAdminsList] = useState(INITIAL_ADMINS);
  const [studentsList, setStudentsList] = useState(INITIAL_REGISTERED_STUDENTS);
  const [activeAdminUser, setActiveAdminUser] = useState(null);
  const [adminEmailInput, setAdminEmailInput] = useState('');
  
  // Student Portal Auth
  const [studentDniInput, setStudentDniInput] = useState('');
  const [currentStudentAuth, setCurrentStudentAuth] = useState(null);
  const [activeCampusTab, setActiveCampusTab] = useState('clases'); // 'clases', 'simulacros', 'horario', 'foro'
  const [newForumQuestion, setNewForumQuestion] = useState('');

  // PDF Modal Viewer State
  const [modalPdfUrl, setModalPdfUrl] = useState(null);
  const [modalPdfTitle, setModalPdfTitle] = useState('');

  // CMS Subpage Navigation State
  const [cmsSubpage, setCmsSubpage] = useState('docentes'); // 'docentes', 'ciclos', 'clases', 'alumnos', 'admins', 'sedes', 'modulos'

  // Forms
  const [newStudentForm, setNewStudentForm] = useState({ name: '', dni: '', cycle: 'Ciclo Quintos 2025', turn: 'Turno Mañana' });
  const [newAdminForm, setNewAdminForm] = useState({ email: '', name: '', role: 'ADMIN' });
  const [newClassForm, setNewClassForm] = useState({ title: '', course: 'Cívica', week: 'Semana 1', driveVideoUrl: '', driveMaterialUrl: '', materialTitle: '' });
  const [newTeacher, setNewTeacher] = useState({ name: '', subject: '', role: 'DOCENTE', description: '', image: null });
  const [newCycle, setNewCycle] = useState({ title: '', badge: '', duration: '', hours: '', modal: '', status: 'Inscripciones Abiertas', highlight: false, syllabusPdfUrl: '' });
  const [newLocation, setNewLocation] = useState({ name: '', address: '', phone: '' });

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Carousel controls
  const nextTeacher = () => setActiveTeacherIndex(prev => (prev + 1) % teachers.length);
  const prevTeacher = () => setActiveTeacherIndex(prev => (prev - 1 + teachers.length) % teachers.length);

  useEffect(() => {
    if (teachers.length <= 1) return;
    const interval = setInterval(() => {
      setActiveTeacherIndex(prev => (prev + 1) % teachers.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [teachers.length]);

  // Real Student Login Authentication (Checked against registered DB)
  const handleStudentLogin = (e) => {
    e.preventDefault();
    const cleanDni = studentDniInput.trim();
    const student = studentsList.find(s => s.dni === cleanDni);
    if (student) {
      setCurrentStudentAuth(student);
    } else {
      alert(`⚠️ DNI "${cleanDni}" no registrado.\nPor favor solicita tu alta a secretaría académica Kelsen.`);
    }
  };

  // Real Individual Role-Based Admin Login
  const handleAdminEmailLogin = (e) => {
    e.preventDefault();
    const cleanEmail = adminEmailInput.trim().toLowerCase();
    const adminMatch = adminsList.find(a => a.email.toLowerCase() === cleanEmail);
    if (adminMatch) {
      setActiveAdminUser(adminMatch);
    } else {
      alert(`⚠️ El correo "${cleanEmail}" no cuenta con rol de Administrador asignado.`);
    }
  };

  // Student Forum Submit
  const handleAddForumQuestion = (e) => {
    e.preventDefault();
    if (!newForumQuestion.trim() || !currentStudentAuth) return;
    const newPost = {
      id: Date.now(),
      studentName: currentStudentAuth.name,
      question: newForumQuestion,
      answer: null,
      answeredBy: null
    };
    setForumPosts([newPost, ...forumPosts]);
    setNewForumQuestion('');
  };

  // Student Registration in CMS
  const handleRegisterStudent = (e) => {
    e.preventDefault();
    if (!newStudentForm.name || !newStudentForm.dni) return;
    if (studentsList.some(s => s.dni === newStudentForm.dni)) {
      alert('Ya existe un alumno con ese DNI registrado.');
      return;
    }
    setStudentsList([...studentsList, { ...newStudentForm, id: Date.now() }]);
    setNewStudentForm({ name: '', dni: '', cycle: 'Ciclo Quintos 2025', turn: 'Turno Mañana' });
    alert('¡Alumno registrado con éxito! Ya puede ingresar con su DNI.');
  };

  // Admin Registration in CMS
  const handleRegisterAdmin = (e) => {
    e.preventDefault();
    if (!newAdminForm.email) return;
    setAdminsList([...adminsList, { ...newAdminForm, id: Date.now() }]);
    setNewAdminForm({ email: '', name: '', role: 'ADMIN' });
    alert('¡Rol de Administrador otorgado correctamente!');
  };

  // CMS Class Upload via Google Drive
  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClassForm.title || !newClassForm.driveVideoUrl) {
      alert('Por favor ingresa al menos el título y el enlace de video de Google Drive.');
      return;
    }
    setClasses([...classes, { ...newClassForm, id: Date.now() }]);
    setNewClassForm({ title: '', course: 'Cívica', week: 'Semana 1', driveVideoUrl: '', driveMaterialUrl: '', materialTitle: '' });
    alert('¡Clase agregada con éxito mediante enlace de Google Drive!');
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0A0A0A] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* GLOW BACKGROUND ORBS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* MODAL PDF PREVIEW (DRIVE EMBEDDED VIEWER) */}
      {modalPdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141416] border border-slate-700 rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm truncate">
                <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="truncate">{modalPdfTitle || 'Visualizador de Documentos Kelsen'}</span>
              </div>
              <button 
                onClick={() => setModalPdfUrl(null)} 
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-600 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 bg-slate-950 p-2">
              <iframe 
                src={modalPdfUrl} 
                className="w-full h-full rounded-2xl border border-slate-800"
                title="Visor PDF Google Drive"
              />
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0A0A0A]/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* LOGO VECTORIAL SVG KELSEN */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('landing')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-amber-500 p-0.5 shadow-lg shadow-red-950/40 group-hover:scale-105 transition">
              <div className="w-full h-full bg-[#0A0A0A] rounded-[14px] flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current text-amber-400">
                  <polygon points="50,12 90,85 10,85" stroke="#EF4444" strokeWidth="6" fill="none" />
                  <polygon points="50,28 78,80 22,80" fill="#EF4444" opacity="0.85" />
                  <circle cx="50" cy="58" r="8" fill="#F59E0B" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-red-500 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                KELSEN
              </h1>
              <p className="text-[9px] tracking-widest text-slate-400 font-bold uppercase">Academia Preuniversitaria</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-7 text-sm font-semibold">
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
              <Settings className="w-4 h-4" /> <span>Panel Admin</span>
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className={`p-2.5 rounded-xl border transition ${theme === 'dark' ? 'border-slate-800 bg-[#161616] text-amber-400 hover:bg-slate-800' : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
            
            <button onClick={() => setActiveTab('intranet')} className="hidden sm:flex bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm px-6 py-2.5 rounded-2xl shadow-lg shadow-red-950/50 items-center space-x-2 transition transform hover:-translate-y-0.5">
              <LogIn className="w-4 h-4" /> <span>Ingresar DNI</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. LANDING TAB */}
      {activeTab === 'landing' && (
        <main className="relative z-10">
          
          {/* HERO SECTION */}
          <section className="relative pt-20 pb-24 px-4 max-w-7xl mx-auto text-center lg:text-left grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center space-x-2 bg-red-950/80 border border-red-800/80 px-4 py-2 rounded-full text-red-400 font-extrabold text-xs uppercase tracking-widest shadow-inner">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>PREPARACIÓN DE ALTO RENDIMIENTO — UNSA AREQUIPA</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                Asegura tu Ingreso a la <br />
                <span className="bg-gradient-to-r from-red-500 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  UNSA con Metodología Kelsen
                </span>
              </h1>

              <p className="text-slate-300 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl">
                Exámenes tipo admisión, simulacros semanales calificados y el mejor equipo docente preuniversitario en Arequipa para asegurar tu vacante.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button onClick={() => setActiveTab('intranet')} className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-base px-8 py-4 rounded-2xl shadow-xl shadow-red-950/80 flex items-center justify-center space-x-3 transition transform hover:scale-105">
                  <span>Ingresar a mis Clases</span>
                  <ChevronRight className="w-5 h-5 text-amber-400" />
                </button>

                <a 
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappDefaultMessage)}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base px-8 py-4 rounded-2xl transition flex items-center justify-center space-x-3 shadow-lg shadow-emerald-950/40"
                >
                  <Phone className="w-5 h-5 text-white" />
                  <span>Inscribirme por WhatsApp</span>
                </a>
              </div>
            </div>

            {/* HERO FEATURED PROFE CIVICO CARD & TIKTOK PREVIEW */}
            <div className="lg:col-span-5 relative">
              <div className="relative bg-[#141416] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
                
                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#0A0A0A] border border-slate-800">
                  <img 
                    src="/PROFECIVICO.jpg" 
                    alt="Profe Cívico" 
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-red-500 shadow-lg"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop'; }}
                  />
                  <div>
                    <span className="bg-red-500/20 text-red-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-red-500/30 uppercase">
                      COFUNDADOR
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
                      <span>Tips Virales de TikTok</span>
                    </span>
                    <a href={tiktokEmbedUrl} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center space-x-1">
                      <span>Ver enlace oficial</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="w-full h-72 bg-[#0A0A0A] rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center relative">
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

          {/* TEACHERS 3D CAROUSEL */}
          <section id="docentes" className="py-24 bg-[#141416]/50 border-t border-b border-slate-800/80 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
                <h2 className="text-3xl sm:text-5xl font-black text-white">Nuestra Plana Docente</h2>
                <p className="text-slate-400 text-lg">Especialistas de élite comprometidos con tu vacante en la UNSA.</p>
              </div>

              <div className="relative py-6">
                <button 
                  onClick={prevTeacher}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#161616] border border-slate-700 text-amber-400 hover:bg-slate-800 shadow-2xl hover:scale-110 transition"
                  aria-label="Docente Anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextTeacher}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#161616] border border-slate-700 text-amber-400 hover:bg-slate-800 shadow-2xl hover:scale-110 transition"
                  aria-label="Docente Siguiente"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="flex justify-center items-center h-[460px] relative max-w-5xl mx-auto">
                  {teachers.map((teacher, index) => {
                    const total = teachers.length;
                    let offset = (index - activeTeacherIndex + total) % total;
                    if (offset > total / 2) offset -= total;

                    const isActive = offset === 0;
                    const isPrev = offset === -1 || (activeTeacherIndex === 0 && index === total - 1);
                    const isNext = offset === 1 || (activeTeacherIndex === total - 1 && index === 0);

                    let positionClass = 'opacity-0 scale-75 pointer-events-none z-0 translate-x-0';
                    if (isActive) {
                      positionClass = 'z-20 scale-105 opacity-100 translate-x-0 shadow-2xl shadow-red-950/80 border-red-500/80';
                    } else if (isPrev) {
                      positionClass = 'z-10 scale-85 opacity-70 -translate-x-[65%] sm:-translate-x-[85%] border-slate-800 cursor-pointer hover:opacity-90';
                    } else if (isNext) {
                      positionClass = 'z-10 scale-85 opacity-70 translate-x-[65%] sm:translate-x-[85%] border-slate-800 cursor-pointer hover:opacity-90';
                    }

                    return (
                      <div
                        key={teacher.id}
                        onClick={() => setActiveTeacherIndex(index)}
                        className={`absolute w-72 sm:w-80 bg-[#141416] border rounded-3xl overflow-hidden transition-all duration-500 ease-out flex flex-col justify-between ${positionClass}`}
                        style={{ height: isActive ? '430px' : '370px' }}
                      >
                        <div>
                          <div className={`relative ${isActive ? 'h-52' : 'h-44'} bg-[#0A0A0A] border-b border-slate-800 flex flex-col items-center justify-center text-slate-500 transition-all`}>
                            {teacher.image ? (
                              <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex flex-col items-center space-y-2">
                                <Image className="w-10 h-10 text-slate-600" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">[ Foto Docente ]</span>
                              </div>
                            )}
                            
                            <div className={`absolute top-4 right-4 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg ${teacher.role === 'COFUNDADOR' ? 'bg-red-600' : 'bg-slate-800 border border-slate-700'}`}>
                              {teacher.role === 'COFUNDADOR' ? 'COFUNDADOR' : 'DOCENTE'}
                            </div>
                          </div>

                          <div className="p-5 space-y-2">
                            <h3 className={`font-bold text-white transition ${isActive ? 'text-2xl text-amber-400' : 'text-lg'}`}>
                              {teacher.name}
                            </h3>
                            <p className="text-red-400 font-bold text-xs uppercase tracking-wider">
                              {teacher.subject}
                            </p>
                            <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                              {teacher.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-center items-center space-x-2 mt-4">
                  {teachers.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTeacherIndex(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${activeTeacherIndex === idx ? 'w-8 bg-amber-400' : 'w-2.5 bg-slate-700 hover:bg-slate-600'}`}
                      aria-label={`Docente ${idx + 1}`}
                    />
                  ))}
                </div>

              </div>
            </div>
          </section>

          {/* CYCLES SECTION (CERO PRECIOS + TEMARIO PDF PREVIEW) */}
          <section id="ciclos" className="py-24 max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black text-white">Ciclos Académicos 2025 - 2026</h2>
              <p className="text-slate-400 text-lg">Elige el programa según tu avance y meta de ingreso en la Universidad Nacional de San Agustín.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {cycles.map((cycle) => (
                <div key={cycle.id} className={`relative bg-[#141416] border rounded-3xl p-8 shadow-2xl flex flex-col justify-between transition duration-300 ${cycle.highlight ? 'border-amber-500 shadow-amber-950/20' : 'border-slate-800 hover:border-slate-700'}`}>
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

                    <div className="space-y-3.5 mb-6 text-sm text-slate-300">
                      <div className="flex items-center space-x-3"><CheckCircle2 className="w-5 h-5 text-red-500" /><span>Duración: <strong>{cycle.duration}</strong></span></div>
                      <div className="flex items-center space-x-3"><CheckCircle2 className="w-5 h-5 text-red-500" /><span>Horario: <strong>{cycle.hours}</strong></span></div>
                      <div className="flex items-center space-x-3"><CheckCircle2 className="w-5 h-5 text-red-500" /><span>Modalidad: <strong>{cycle.modal}</strong></span></div>
                      <div className="flex items-center space-x-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /><span>Estado: <strong>{cycle.status}</strong></span></div>
                    </div>

                    {/* TEMARIO DESCARGABLE / VISTA PREVIA PDF */}
                    {cycle.syllabusPdfUrl && (
                      <button 
                        onClick={() => {
                          setModalPdfTitle(`Temario Prospecto — ${cycle.title}`);
                          setModalPdfUrl(cycle.syllabusPdfUrl);
                        }}
                        className="mb-6 w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-bold text-amber-400 flex items-center justify-center space-x-2 transition"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Ver Temario Oficial (PDF Preview)</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <a 
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola Kelsen, solicito vacante para el ${cycle.title}`)}`}
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center space-x-2"
                    >
                      <span>Solicitar Información y Matrícula</span>
                      <ChevronRight className="w-4 h-4 text-amber-400" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SEDES DINAMICAS AREQUIPA */}
          <section className="py-20 bg-[#141416]/60 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white mb-8">Nuestras Sedes en Arequipa</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {locations.map((loc) => (
                  <div key={loc.id} className="bg-[#0A0A0A] border border-slate-800 p-6 rounded-3xl text-left space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold">
                      <MapPin className="w-5 h-5 text-red-500" />
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

      {/* 3. CAMPUS VIRTUAL (ÁREA DE ALUMNOS) */}
      {activeTab === 'intranet' && (
        <div className="max-w-6xl mx-auto py-16 px-4 relative z-10">
          {!currentStudentAuth ? (
            <div className="max-w-md mx-auto bg-[#141416] border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
              <div className="w-20 h-20 bg-red-600/15 text-red-500 rounded-3xl flex items-center justify-center mx-auto border border-red-500/30">
                <LogIn className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Campus Virtual Kelsen</h2>
                <p className="text-slate-400 text-sm mt-2">Acceso exclusivo para postulantes matriculados en Kelsen Arequipa.</p>
              </div>

              <form onSubmit={handleStudentLogin} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Ingresa tu DNI registrado" 
                  value={studentDniInput} 
                  onChange={(e) => setStudentDniInput(e.target.value)} 
                  className="w-full bg-[#0A0A0A] border border-slate-800 rounded-2xl px-4 py-3.5 text-white text-center font-mono text-xl tracking-widest focus:outline-none focus:border-red-500 transition"
                />
                <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3.5 rounded-2xl shadow-lg transition">
                  Ingresar a mis Clases
                </button>
              </form>

              <p className="text-[11px] text-slate-500">
                * Tu DNI debe haber sido activado por secretaría. Si eres nuevo alumno, solicita tu alta con el director.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* STUDENT PROFILE HEADER */}
              <div className="bg-[#141416] border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center font-black text-2xl text-white">
                    {currentStudentAuth.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">{currentStudentAuth.name}</h2>
                    <p className="text-slate-400 text-xs mt-0.5">
                      DNI: <span className="font-mono text-amber-400">{currentStudentAuth.dni}</span> • Academia Kelsen UNSA • {currentStudentAuth.cycle} ({currentStudentAuth.turn})
                    </p>
                  </div>
                </div>
                <button onClick={() => setCurrentStudentAuth(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-5 py-2.5 rounded-xl border border-slate-700 transition">
                  Cerrar Sesión
                </button>
              </div>

              {/* CAMPUS SUB-TABS */}
              <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
                <button 
                  onClick={() => setActiveCampusTab('clases')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition ${activeCampusTab === 'clases' ? 'bg-red-600 text-white' : 'bg-[#141416] text-slate-400 hover:bg-slate-800'}`}
                >
                  <Video className="w-4 h-4" /> <span>Clases Grabadas & Material</span>
                </button>

                {moduleScheduleEnabled && (
                  <button 
                    onClick={() => setActiveCampusTab('horario')}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition ${activeCampusTab === 'horario' ? 'bg-red-600 text-white' : 'bg-[#141416] text-slate-400 hover:bg-slate-800'}`}
                  >
                    <Calendar className="w-4 h-4" /> <span>Horario de Clases</span>
                  </button>
                )}

                {moduleForumEnabled && (
                  <button 
                    onClick={() => setActiveCampusTab('foro')}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition ${activeCampusTab === 'foro' ? 'bg-red-600 text-white' : 'bg-[#141416] text-slate-400 hover:bg-slate-800'}`}
                  >
                    <MessageSquare className="w-4 h-4" /> <span>Foro de Dudas & Preguntas</span>
                  </button>
                )}
              </div>

              {/* TAB 1: CLASES GRABADAS & MATERIAL DRIVE */}
              {activeCampusTab === 'clases' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {classes.map((c) => (
                    <div key={c.id} className="bg-[#141416] border border-slate-800 rounded-3xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full">{c.course} • {c.week}</span>
                        <span className="text-xs text-slate-400 font-mono">Drive Cloud Video</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{c.title}</h3>

                      <div className="w-full h-56 bg-[#0A0A0A] rounded-2xl border border-slate-800 overflow-hidden">
                        <iframe src={c.driveVideoUrl} className="w-full h-full border-0" title={c.title}></iframe>
                      </div>

                      {/* ATTACHED PDF MATERIAL PREVIEW BUTTON */}
                      {c.driveMaterialUrl && (
                        <div className="pt-2">
                          <button 
                            onClick={() => {
                              setModalPdfTitle(c.materialTitle || 'Material Adjunto de Clase');
                              setModalPdfUrl(c.driveMaterialUrl);
                            }}
                            className="w-full bg-[#0A0A0A] hover:bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center justify-between text-xs transition text-slate-200"
                          >
                            <span className="font-bold flex items-center space-x-2 truncate">
                              <FileText className="w-4 h-4 text-amber-400 flex-shrink-0" />
                              <span className="truncate">{c.materialTitle || 'Material Adjunto (PDF)'}</span>
                            </span>
                            <span className="text-amber-400 font-bold flex items-center space-x-1 flex-shrink-0">
                              <Eye className="w-3.5 h-3.5" /> <span>Ver Preview</span>
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: HORARIO DE CLASES */}
              {activeCampusTab === 'horario' && moduleScheduleEnabled && (
                <div className="bg-[#141416] border border-slate-800 rounded-3xl p-8 space-y-6">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <span>Cronograma de Clases Semanales — {currentStudentAuth.cycle}</span>
                  </h3>
                  <div className="divide-y divide-slate-800">
                    {schedule.map((sch) => (
                      <div key={sch.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-3">
                          <span className="bg-amber-500/20 text-amber-400 font-black text-xs px-3 py-1 rounded-lg w-24 text-center">{sch.day}</span>
                          <span className="font-bold text-white">{sch.course}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-slate-400">
                          <span>Docente: <strong className="text-slate-200">{sch.teacher}</strong></span>
                          <span className="font-mono text-red-400">{sch.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: FORO DE PREGUNTAS */}
              {activeCampusTab === 'foro' && moduleForumEnabled && (
                <div className="bg-[#141416] border border-slate-800 rounded-3xl p-8 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-red-500" />
                      <span>Foro Académico & Consultas al Staff Docente</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Escribe tu duda sobre cualquier ejercicio o tema del prospecto UNSA.</p>
                  </div>

                  <form onSubmit={handleAddForumQuestion} className="space-y-3">
                    <textarea 
                      rows={3} 
                      placeholder="Escribe tu consulta o duda académica aquí..." 
                      value={newForumQuestion}
                      onChange={(e) => setNewForumQuestion(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-slate-800 rounded-2xl p-4 text-white text-sm focus:border-red-500 focus:outline-none"
                    />
                    <button type="submit" className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition">
                      Publicar Pregunta
                    </button>
                  </form>

                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    {forumPosts.map((post) => (
                      <div key={post.id} className="bg-[#0A0A0A] border border-slate-800 p-6 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-400">{post.studentName}</span>
                          <span className="text-slate-500">Pregunta en foro</span>
                        </div>
                        <p className="text-sm text-slate-200">{post.question}</p>
                        
                        {post.answer ? (
                          <div className="bg-[#141416] border-l-2 border-emerald-500 p-4 rounded-xl mt-3 space-y-1">
                            <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> <span>Respuesta de {post.answeredBy}:</span>
                            </span>
                            <p className="text-xs text-slate-300">{post.answer}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-amber-400/80 italic">Esperando respuesta del docente tutor...</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* 4. PANEL DE ADMINISTRACIÓN (CMS CON ROLES REALES) */}
      {activeTab === 'admin' && (
        <div className="max-w-7xl mx-auto py-16 px-4 relative z-10">
          {!activeAdminUser ? (
            <div className="max-w-md mx-auto bg-[#141416] border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
              <div className="w-20 h-20 bg-amber-500/15 text-amber-500 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30">
                <Lock className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Ingreso Administrador Kelsen</h2>
                <p className="text-slate-400 text-sm mt-2">Acceso por rol verificado. Ingresa tu correo electrónico autorizado.</p>
              </div>

              <form onSubmit={handleAdminEmailLogin} className="space-y-4">
                <input 
                  type="email" 
                  placeholder="ej: admin@kelsen.edu.pe" 
                  value={adminEmailInput} 
                  onChange={(e) => setAdminEmailInput(e.target.value)} 
                  className="w-full bg-[#0A0A0A] border border-slate-800 rounded-2xl px-4 py-3.5 text-white text-center text-base focus:outline-none focus:border-amber-500 transition"
                />
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-2xl shadow-lg transition">
                  Verificar Rol & Entrar
                </button>
              </form>

              <div className="p-3 bg-slate-900/60 rounded-xl text-[11px] text-slate-400 text-left space-y-1">
                <p className="font-bold text-amber-400">Cuentas autorizadas por defecto:</p>
                <p>• admin@kelsen.edu.pe (Director)</p>
                <p>• profecivico@gmail.com (Cofundador)</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* ADMIN HEADER */}
              <div className="flex flex-col sm:flex-row items-center justify-between bg-[#141416] border border-slate-800 rounded-3xl p-8 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">{activeAdminUser.name}</h2>
                    <p className="text-slate-400 text-xs">Rol: <strong className="text-amber-400">{activeAdminUser.role}</strong> ({activeAdminUser.email})</p>
                  </div>
                </div>
                <button onClick={() => setActiveAdminUser(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-5 py-2.5 rounded-xl border border-slate-700">
                  Cerrar Panel
                </button>
              </div>

              {/* CMS SUB-PAGES NAVIGATION (TIPO POWERPOINT MODULAR) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 bg-[#141416] p-2 rounded-2xl border border-slate-800 text-xs font-bold">
                <button onClick={() => setCmsSubpage('docentes')} className={`p-3 rounded-xl transition ${cmsSubpage === 'docentes' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                  1. Docentes
                </button>
                <button onClick={() => setCmsSubpage('ciclos')} className={`p-3 rounded-xl transition ${cmsSubpage === 'ciclos' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                  2. Ciclos
                </button>
                <button onClick={() => setCmsSubpage('clases')} className={`p-3 rounded-xl transition ${cmsSubpage === 'clases' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                  3. Clases Drive
                </button>
                <button onClick={() => setCmsSubpage('alumnos')} className={`p-3 rounded-xl transition ${cmsSubpage === 'alumnos' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                  4. Alta Alumnos
                </button>
                <button onClick={() => setCmsSubpage('admins')} className={`p-3 rounded-xl transition ${cmsSubpage === 'admins' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                  5. Roles Admin
                </button>
                <button onClick={() => setCmsSubpage('sedes')} className={`p-3 rounded-xl transition ${cmsSubpage === 'sedes' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                  6. Sedes & WSP
                </button>
                <button onClick={() => setCmsSubpage('modulos')} className={`p-3 rounded-xl transition ${cmsSubpage === 'modulos' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                  7. Módulos On/Off
                </button>
              </div>

              {/* SUBPAGE 1: GESTIÓN DE DOCENTES */}
              {cmsSubpage === 'docentes' && (
                <div className="bg-[#141416] border border-slate-800 rounded-3xl p-8 space-y-6">
                  <h3 className="text-xl font-bold text-white">Gestión de Plana Docente (Carrusel 3D)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {teachers.map(t => (
                      <div key={t.id} className="bg-[#0A0A0A] border border-slate-800 p-6 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <input 
                            type="text" 
                            value={t.name} 
                            onChange={e => setTeachers(teachers.map(tc => tc.id === t.id ? {...tc, name: e.target.value} : tc))}
                            className="bg-transparent font-bold text-white border-b border-slate-800 w-2/3"
                          />
                          <select 
                            value={t.role} 
                            onChange={e => setTeachers(teachers.map(tc => tc.id === t.id ? {...tc, role: e.target.value} : tc))}
                            className="bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold rounded-lg px-2 py-1"
                          >
                            <option value="DOCENTE">DOCENTE</option>
                            <option value="COFUNDADOR">COFUNDADOR</option>
                          </select>
                        </div>
                        <input 
                          type="text" 
                          placeholder="Área Académica"
                          value={t.subject} 
                          onChange={e => setTeachers(teachers.map(tc => tc.id === t.id ? {...tc, subject: e.target.value} : tc))}
                          className="bg-transparent text-red-400 text-xs w-full border-b border-slate-800"
                        />
                        <textarea 
                          rows={2}
                          value={t.description} 
                          onChange={e => setTeachers(teachers.map(tc => tc.id === t.id ? {...tc, description: e.target.value} : tc))}
                          className="bg-slate-900 border border-slate-800 text-xs text-slate-300 w-full rounded-xl p-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBPAGE 2: GESTIÓN DE CICLOS */}
              {cmsSubpage === 'ciclos' && (
                <div className="bg-[#141416] border border-slate-800 rounded-3xl p-8 space-y-6">
                  <h3 className="text-xl font-bold text-white">Gestión de Ciclos Académicos (Cero Precios)</h3>
                  <div className="space-y-4">
                    {cycles.map(c => (
                      <div key={c.id} className="bg-[#0A0A0A] border border-slate-800 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <input 
                          type="text" 
                          value={c.title} 
                          onChange={e => setCycles(cycles.map(cy => cy.id === c.id ? {...cy, title: e.target.value} : cy))}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold text-sm"
                        />
                        <input 
                          type="text" 
                          value={c.badge} 
                          onChange={e => setCycles(cycles.map(cy => cy.id === c.id ? {...cy, badge: e.target.value} : cy))}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-amber-400 text-xs font-bold"
                        />
                        <input 
                          type="text" 
                          placeholder="Enlace Temario PDF"
                          value={c.syllabusPdfUrl || ''} 
                          onChange={e => setCycles(cycles.map(cy => cy.id === c.id ? {...cy, syllabusPdfUrl: e.target.value} : cy))}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300"
                        />
                        <button onClick={() => setCycles(cycles.filter(cy => cy.id !== c.id))} className="text-red-500 hover:text-red-400 text-xs font-bold">
                          Eliminar Ciclo
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBPAGE 3: GESTIÓN DE CLASES VÍA DRIVE */}
              {cmsSubpage === 'clases' && (
                <div className="bg-[#141416] border border-slate-800 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Cursos y Clases Grabadas (Vía Google Drive)</h3>
                      <p className="text-xs text-slate-400 mt-1">Sube tus videos y PDFs a tu propio Google Drive y pega los enlaces aquí sin recargar el servidor.</p>
                    </div>
                  </div>

                  <form onSubmit={handleAddClass} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0A0A0A] p-6 rounded-2xl border border-slate-800">
                    <input type="text" placeholder="Título de la clase (ej: Cívica - Semana 4)" value={newClassForm.title} onChange={e => setNewClassForm({...newClassForm, title: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-sm" />
                    <input type="text" placeholder="Curso / Materia" value={newClassForm.course} onChange={e => setNewClassForm({...newClassForm, course: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-sm" />
                    <input type="text" placeholder="Enlace de Video Google Drive" value={newClassForm.driveVideoUrl} onChange={e => setNewClassForm({...newClassForm, driveVideoUrl: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-sm" />
                    <input type="text" placeholder="Enlace Material PDF Google Drive" value={newClassForm.driveMaterialUrl} onChange={e => setNewClassForm({...newClassForm, driveMaterialUrl: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-sm" />
                    <input type="text" placeholder="Nombre del Material (ej: Práctica Calificada)" value={newClassForm.materialTitle} onChange={e => setNewClassForm({...newClassForm, materialTitle: e.target.value})} className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-sm" />
                    
                    <button type="submit" className="md:col-span-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition">
                      Publicar Clase Grabada & Material
                    </button>
                  </form>
                </div>
              )}

              {/* SUBPAGE 4: ALTA REAL DE ALUMNOS (DNI) */}
              {cmsSubpage === 'alumnos' && (
                <div className="bg-[#141416] border border-slate-800 rounded-3xl p-8 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Alta y Padrón de Alumnos (Campus Virtual)</h3>
                    <p className="text-xs text-slate-400 mt-1">Registra nombre y DNI del alumno para habilitar su acceso.</p>
                  </div>

                  <form onSubmit={handleRegisterStudent} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#0A0A0A] p-6 rounded-2xl border border-slate-800">
                    <input type="text" placeholder="Nombre Completo del Alumno" value={newStudentForm.name} onChange={e => setNewStudentForm({...newStudentForm, name: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-sm" />
                    <input type="text" placeholder="DNI del Alumno" value={newStudentForm.dni} onChange={e => setNewStudentForm({...newStudentForm, dni: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-sm font-mono" />
                    <input type="text" placeholder="Ciclo Asignado" value={newStudentForm.cycle} onChange={e => setNewStudentForm({...newStudentForm, cycle: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-sm" />
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition">
                      Dar de Alta Alumno
                    </button>
                  </form>

                  <div className="divide-y divide-slate-800">
                    {studentsList.map(st => (
                      <div key={st.id} className="py-3 flex items-center justify-between text-sm">
                        <div>
                          <p className="font-bold text-white">{st.name}</p>
                          <p className="text-xs text-slate-400">DNI: <span className="font-mono text-amber-400">{st.dni}</span> • {st.cycle}</p>
                        </div>
                        <button onClick={() => setStudentsList(studentsList.filter(s => s.id !== st.id))} className="text-red-500 hover:underline text-xs font-bold">
                          Dar de Baja
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBPAGE 5: ROLES Y ADMINISTRADORES */}
              {cmsSubpage === 'admins' && (
                <div className="bg-[#141416] border border-slate-800 rounded-3xl p-8 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Gestión de Roles y Administradores</h3>
                    <p className="text-xs text-slate-400 mt-1">Otorga o revoca permisos de administración por correo individual.</p>
                  </div>

                  <form onSubmit={handleRegisterAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0A0A0A] p-6 rounded-2xl border border-slate-800">
                    <input type="email" placeholder="Correo Google de la persona" value={newAdminForm.email} onChange={e => setNewAdminForm({...newAdminForm, email: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-sm" />
                    <input type="text" placeholder="Nombre y Apellidos" value={newAdminForm.name} onChange={e => setNewAdminForm({...newAdminForm, name: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-sm" />
                    <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl transition">
                      Otorgar Rol Admin
                    </button>
                  </form>

                  <div className="divide-y divide-slate-800">
                    {adminsList.map(adm => (
                      <div key={adm.id} className="py-3 flex items-center justify-between text-sm">
                        <div>
                          <p className="font-bold text-white">{adm.name} <span className="bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded font-black ml-2">{adm.role}</span></p>
                          <p className="text-xs text-slate-400">{adm.email}</p>
                        </div>
                        {adm.role !== 'SUPER_ADMIN' && (
                          <button onClick={() => setAdminsList(adminsList.filter(a => a.id !== adm.id))} className="text-red-500 hover:underline text-xs font-bold">
                            Quitar Rol
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBPAGE 6: SEDES & WHATSAPP */}
              {cmsSubpage === 'sedes' && (
                <div className="bg-[#141416] border border-slate-800 rounded-3xl p-8 space-y-6">
                  <h3 className="text-xl font-bold text-white">Configuración de Sedes y WhatsApp Oficial</h3>
                  
                  <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-slate-800 space-y-4">
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Número Oficial de WhatsApp y Mensaje de Conversión:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        value={whatsappNumber} 
                        onChange={e => setWhatsappNumber(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-sm font-mono"
                        placeholder="ej: 51954123456"
                      />
                      <input 
                        type="text" 
                        value={whatsappDefaultMessage} 
                        onChange={e => setWhatsappDefaultMessage(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-sm"
                        placeholder="Mensaje de consulta por defecto"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUBPAGE 7: ACTIVACIÓN DE MÓDULOS OPCIONALES */}
              {cmsSubpage === 'modulos' && (
                <div className="bg-[#141416] border border-slate-800 rounded-3xl p-8 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Activación / Desactivación de Módulos (Campus)</h3>
                    <p className="text-xs text-slate-400 mt-1">Elige qué funciones están disponibles para los alumnos sin tocar código.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0A0A0A] border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-base">Módulo Horario de Clases</h4>
                        <p className="text-xs text-slate-400">Cronograma semanal con salones y turnos.</p>
                      </div>
                      <button 
                        onClick={() => setModuleScheduleEnabled(!moduleScheduleEnabled)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs transition ${moduleScheduleEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                      >
                        {moduleScheduleEnabled ? 'ACTIVO' : 'APAGADO'}
                      </button>
                    </div>

                    <div className="bg-[#0A0A0A] border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-base">Módulo Foro de Dudas & Preguntas</h4>
                        <p className="text-xs text-slate-400">Espacio de preguntas de alumnos y respuestas del staff.</p>
                      </div>
                      <button 
                        onClick={() => setModuleForumEnabled(!moduleForumEnabled)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs transition ${moduleForumEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                      >
                        {moduleForumEnabled ? 'ACTIVO' : 'APAGADO'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-[#0A0A0A] py-12 px-4 relative z-10 mt-20 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 Academia Preuniversitaria Kelsen • Arequipa, Perú</div>
          <div className="flex space-x-4">
            <a href="https://www.tiktok.com/@profecivico" target="_blank" rel="noreferrer" className="hover:text-red-400 transition">TikTok Oficial</a>
            <a href="#ciclos" className="hover:text-red-400 transition">Ciclos UNSA</a>
            <button onClick={() => setActiveTab('intranet')} className="hover:text-amber-400 transition">Campus Virtual</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
