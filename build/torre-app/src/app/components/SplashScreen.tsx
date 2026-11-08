import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Building2 } from "lucide-react";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onFinish(), 300);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-[#090924] z-50 flex items-center justify-center overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `
              linear-gradient(#A4F4E7 1px, transparent 1px),
              linear-gradient(90deg, #A4F4E7 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Subtle radial gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(164, 244, 231, 0.06) 0%, transparent 60%)',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-12 px-6 max-w-md">
        
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1] // Cubic bezier for professional easing
          }}
          className="relative"
        >
          <div className="relative bg-[#A4F4E7] rounded-2xl p-5 shadow-2xl">
            <Building2 className="h-14 w-14 text-[#090924]" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight">
            Torre de Controle
          </h1>
          
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#A4F4E7]/40" />
            <p className="text-base text-[#A4F4E7]/80 font-light tracking-wide uppercase text-sm">
              Cliente
            </p>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#A4F4E7]/40" />
          </div>
        </motion.div>

        {/* Partnership */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.4,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="text-center space-y-2"
        >
          <p className="text-xs text-gray-500 uppercase tracking-widest font-light">
            em parceria com
          </p>
          <p className="text-sm text-white/70 font-normal tracking-wide">
            Chronus Performance AI
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.5,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="w-full max-w-xs space-y-3"
        >
          {/* Progress track */}
          <div className="relative h-0.5 bg-white/5 rounded-full overflow-hidden">
            {/* Progress fill */}
            <motion.div
              className="absolute left-0 top-0 h-full bg-[#A4F4E7] rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
          
          {/* Loading text */}
          <div className="flex items-center justify-center gap-2">
            <p className="text-xs text-gray-500 font-light tracking-wide">
              Carregando sistema
            </p>
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-[#A4F4E7]/60"
            >
              ...
            </motion.span>
          </div>
        </motion.div>

        {/* Progress percentage */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.6,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <p className="text-xs text-gray-600 font-light tabular-nums">
            {progress}%
          </p>
        </motion.div>
      </div>
    </div>
  );
}