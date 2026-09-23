import { motion } from "framer-motion";
import { useEffect } from "react";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      
      <motion.svg
        width="400"
        height="120"
        viewBox="0 0 400 120"
        fill="none"
        stroke="#C60000"   // Blood red
        strokeWidth="3"
        className="drop-shadow-[0px_0px_10px_#C60000]"
      >
        <motion.path
          d="
            M0 60 
            L60 60 
            L80 60 
            L100 20 
            L120 100 
            L140 60 
            L200 60 
            L260 60 
            L280 20 
            L300 100 
            L320 60 
            L400 60
          "
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2.2,
            ease: "easeInOut",
          }}
        />

        {/* Moving glowing dot */}
        <motion.circle
          r="5"
          fill="#C60000"
          className="drop-shadow-[0px_0px_6px_#C60000]"
          initial={{ x: 0 }}
          animate={{ x: 400 }}
          transition={{ duration: 2.2, ease: "linear" }}
          cy="60"
        />
      </motion.svg>

    </div>
  );
}