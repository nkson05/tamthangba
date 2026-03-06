import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// === 1. DANH SÁCH ẢNH CỦA BẠN ===
const MY_PHOTOS = [
  "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg"
];

const MY_AUDIO_FILE = "/tamthangba/nhac.mp3"; 

// === ĐỊNH NGHĨA KIỂU DỮ LIỆU ===
interface TwinklingStar { id: number; top: number; left: number; size: number; delay: number; duration: number; }
interface ShootingStar { id: number; top: number; left: number; delay: number; duration: number; }
interface FloatingItem { id: number; icon: string; color: string; x: number; y: number; }
interface FallingPhoto { id: number; url: string; left: number; duration: number; rotate: number; }

const CUTE_ICONS = [
  { icon: '💖', color: '#ffb3ba' }, { icon: '✨', color: '#ffffba' }, { icon: '🧸', color: '#baffc9' },
  { icon: '🌷', color: '#bae1ff' }, { icon: '🌟', color: '#fddde6' }, { icon: '🐰', color: '#e0bbe4' },
];

// --- COMPONENT HỖ TRỢ GÕ CHỮ ---
const Typewriter = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 50); // Tốc độ gõ 50ms
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayText}</span>;
};

const App: React.FC = () => {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [showGallery, setShowGallery] = useState(false); 
  const [isPlaying, setIsPlaying] = useState(false); // Bổ sung thiếu
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [fallingPhotos, setFallingPhotos] = useState<FallingPhoto[]>([]);

  const audioRef = useRef<HTMLAudioElement>(null); // Bổ sung thiếu

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const twinklingStars = useMemo(() => {
    const stars: TwinklingStar[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      });
    }
    return stars;
  }, []);

  const floatingItems = useMemo(() => {
    const items: FloatingItem[] = [];
    for (let i = 0; i < 12; i++) {
      const iconInfo = CUTE_ICONS[i % CUTE_ICONS.length];
      items.push({
        id: i,
        ...iconInfo,
        x: Math.random() * 250 - 125,
        y: Math.random() * 250 - 125,
      });
    }
    return items;
  }, []);

  useEffect(() => {
    const starInterval = setInterval(() => {
      const newStar = { id: Date.now(), top: Math.random() * 40, left: Math.random() * 100, duration: Math.random() * 2 + 1.5, delay: Math.random() * 0.5 };
      setShootingStars((prev) => [...prev.slice(-8), newStar]);
    }, 1500);

    let photoInterval: any;
    if (showGallery) {
      photoInterval = setInterval(() => {
        const newPhoto = {
          id: Date.now(),
          url: MY_PHOTOS[Math.floor(Math.random() * MY_PHOTOS.length)],
          left: Math.random() * 85 + 5,
          duration: Math.random() * 4 + 6,
          rotate: Math.random() * 40 - 20
        };
        setFallingPhotos((prev) => [...prev.slice(-10), newPhoto]);
      }, 1500);
    }

    return () => {
      clearInterval(starInterval);
      clearInterval(photoInterval);
    };
  }, [showGallery]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden flex flex-col items-center justify-between font-['Quicksand'] text-white select-none"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, #111827, #1e3a8a 50%, transparent 80%),
          url('https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?q=80&w=1600')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <audio 
  ref={audioRef} 
  src={MY_AUDIO_FILE} 
  loop 
  preload="auto" 
/>

      <motion.div 
        onClick={toggleMusic}
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="fixed bottom-6 right-6 z-[100] cursor-pointer w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg"
      >
        {isPlaying ? '🎵' : '🔇'}
      </motion.div>

      <div className="absolute inset-0 z-0 pointer-events-none">
        {twinklingStars.map((star) => (
          <div key={star.id} className="absolute bg-white rounded-full animate-twinkle shadow-[0_0_10px_1px_rgba(255,255,255,0.8)]"
            style={{ top: `${star.top}%`, left: `${star.left}%`, width: star.size, height: star.size, animationDelay: `${star.delay}s`, animationDuration: `${star.duration}s` } as any}
          />
        ))}
        {shootingStars.map((star) => (
          <div key={star.id} className="absolute w-0.5 h-0.5 bg-white rounded-full shooting-star"
            style={{ top: `${star.top}vh`, left: `${star.left}vw`, animationDelay: `${star.delay}s`, animationDuration: `${star.duration}s` } as any}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!showGallery ? (
          <motion.div key="scene1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }} className="relative z-10 w-full h-full flex flex-col items-center justify-between py-10">
            <header className="w-full text-center px-4 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-['Dancing_Script'] text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-red-400 drop-shadow-lg leading-relaxed py-2">
  Happy Women's Day
</h1>
              {/* <p className="mt-2 text-lg text-pink-100 font-light tracking-widest uppercase opacity-70">To the light of my life</p> */}
            </header>

            <main className="flex flex-col items-center justify-center gap-10 px-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-pink-500/30 blur-[100px] rounded-full animate-pulse scale-150"></div>
                <motion.div animate={{ y: [0, -25, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="relative animate-float-gentle text-center z-10">
                  <span className="text-[12rem] md:text-[16rem] leading-none filter drop-shadow-[0_20px_40px_rgba(255,182,193,0.9)]">💐</span>
                </motion.div>
                <div className="absolute inset-0 overflow-visible z-20">
                  {floatingItems.map((item) => (
                    <motion.span key={item.id} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], x: [item.x, item.x + 25], y: [item.y, item.y - 180], rotate: 360 }}
                      transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 5 }}
                      className="absolute text-4xl" style={{ left: `calc(50% + ${item.x}px)`, top: `calc(50% + ${item.y}px)`, color: item.color, textShadow: `0 0 15px ${item.color}` }}>
                      {item.icon}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="relative">
                {!isLetterOpen ? (
                  <motion.div whileHover={{ scale: 1.1 }} onClick={() => setIsLetterOpen(true)} className="cursor-pointer flex flex-col items-center">
                    <div className="text-8xl drop-shadow-2xl filter hue-rotate-15">✉️</div>
                    <p className="text-pink-200 text-sm mt-3 animate-pulse font-semibold bg-pink-800/40 px-4 py-1 rounded-full">Chạm để mở thư...</p>
                  </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-md" onClick={() => setIsLetterOpen(false)}>
                    <motion.div className="bg-[#fffdfa] p-8 rounded-xl shadow-2xl w-full max-w-sm border-t-[15px] border-pink-400 relative text-gray-800" onClick={(e) => e.stopPropagation()}>
                      <button className="absolute top-2 right-4 text-gray-400 text-2xl" onClick={() => setIsLetterOpen(false)}>✕</button>
                      <h2 className="text-3xl font-['Dancing_Script'] text-pink-600 mb-4 border-b border-pink-100 pb-2">Thân gửi bạn,</h2>
                      <div className="space-y-4 leading-relaxed text-lg min-h-[120px]">
                        {/* HIỆU ỨNG GÕ CHỮ TẠI ĐÂY */}
                        <p><Typewriter text="Chúc mừng 8/3, chúc Nhã 3 đừng, 3 không, 3 nhớ.
Đừng quá khắt khe với bản thân, đừng hoài nghi chính mình đừng quên cậu là phiên bản duy nhất và tuyệt vời nhất.
Không buồn nhiều quá, không áp lực quá và không để khó khăn làm cậu quên mất cách yêu thương chính mình.
Nhớ giữ sức khỏe, nhớ cười nhiều hơn và nhớ là có một người đáng yêu luôn sẵn sàng lắng nghe cậu (đáng yêu ý là đáng yêu ấy, không phải đáng yêu kia đâu!)." /></p>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }}>Hãy nhấn nút bên dưới để xem điều bất ngờ tiếp theo nhé!</motion.p>
                      </div>
                      <button 
  onClick={() => { 
    setShowGallery(true); 
    // Ép nhạc phát khi người dùng tương tác
    audioRef.current?.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
  }} 
  className="mt-6 w-full py-3 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
>
  Tiếp tục ✨
</button>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </main>

            <footer className="w-full text-center pb-6">
              <p className="text-xs text-pink-200 opacity-60 font-light">From ngkhson</p>
            </footer>
          </motion.div>
        ) : (
          <motion.div key="scene2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 w-full h-full">
            <div className="absolute top-10 w-full text-center z-20 pointer-events-none">
              <h2 className="text-4xl font-['Dancing_Script'] text-pink-300 drop-shadow-md">Khoảnh khắc rạng rỡ</h2>
            </div>

            {fallingPhotos.map((photo) => (
              <motion.div key={photo.id} initial={{ y: "110vh", x: `${photo.left}vw`, opacity: 0 }} animate={{ y: "-20vh", opacity: [0, 1, 1, 0] }}
                transition={{ duration: photo.duration, ease: "linear" }}
                className="absolute bg-white p-2 shadow-2xl rounded-sm w-32 md:w-48 -translate-x-1/2" style={{ rotate: `${photo.rotate}deg` }}>
                <img src={photo.url} className="w-full h-auto rounded-sm" alt="Memory" />
                <p className="text-center text-pink-500 font-['Dancing_Script'] mt-1 text-sm md:text-base">Beautiful</p>
              </motion.div>
            ))}

            <button onClick={() => setShowGallery(false)} className="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs z-50 hover:bg-white/20">
              Quay lại
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        .animate-twinkle { animation: twinkle linear infinite; }
        @keyframes float-gentle { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(2deg); } }
        .animate-float-gentle { animation: float-gentle 6s ease-in-out infinite; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 2s ease-out; }
        @keyframes shooting-star {
          0% { transform: translateX(0) translateY(0) rotate(-45deg) scale(1); opacity: 1; }
          100% { transform: translateX(100vw) translateY(100vh) rotate(-45deg) scale(0); opacity: 0; }
        }
        .shooting-star { position: absolute; animation-name: shooting-star; animation-timing-function: linear; animation-iteration-count: infinite; box-shadow: 0 0 10px 2px #fff; }
        html, body { overflow: hidden; height: 100%; position: fixed; width: 100%; }
      `}</style>
    </div>
  );
};

export default App;