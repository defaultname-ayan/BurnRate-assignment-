"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";

const navLinks = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing Data", href: "#pricing-data" },
  { label: "For CTOs", href: "#for-ctos" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const navVariants = {
    initial: {
      width: "100%",
      paddingLeft: "3rem",
      paddingRight: "3rem",
      height: "72px",
      borderRadius: "0px",
      backgroundColor: "rgba(245, 244, 240, 0.0)",
      border: "1px solid transparent",
      top: 0,
      boxShadow: "none",
    },
    scrolled: {
      width: "680px",
      paddingLeft: "1.5rem",
      paddingRight: "1.5rem",
      height: "56px",
      borderRadius: "9999px",
      backgroundColor: "rgba(250, 249, 247, 0.95)",
      border: "1px solid rgba(8, 104, 65, 0.12)",
      top: "20px",
      boxShadow:
        "0 8px 32px rgba(8, 104, 65, 0.10), 0 2px 8px rgba(0,0,0,0.05)",
    },
  };

  return (
    <motion.nav
      initial="initial"
      animate={isScrolled ? "scrolled" : "initial"}
      variants={navVariants}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: "fixed",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: isScrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(16px)" : "none",
        left: "50%",
        transform: "translateX(-50%)",
        overflow: "visible",
        maxWidth: "90vw",
      }}
    >
      <AnimatePresence>
        {!isScrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              bottom: 0,
              left: "3rem",
              right: "3rem",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(8,104,65,0.15), transparent)",
            }}
          />
        )}
      </AnimatePresence>

      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: "#086841",
            letterSpacing: "-0.03em",
            fontFamily: "var(--font-body, Inter, sans-serif)",
          }}
        >
          BurnRate
        </span>
      </Link>

      <ul
        className="hidden md:flex"
        style={{
          listStyle: "none",
          gap: "2px",
          margin: 0,
          padding: 0,
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        {navLinks.map((item) => (
          <li key={item.label} style={{ flexShrink: 0 }}>
            <motion.a
              href={item.href}
              whileHover={{
                color: "#086841",
                backgroundColor: "rgba(8,104,65,0.06)",
              }}
              style={{
                display: "inline-block",
                padding: "6px 12px",
                fontSize: "13.5px",
                fontWeight: 500,
                color: "#52525b",
                textDecoration: "none",
                borderRadius: "8px",
                fontFamily: "var(--font-body, Inter, sans-serif)",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </motion.a>
          </li>
        ))}
      </ul>

      <div
        className="hidden md:flex items-center"
        style={{ gap: "8px", flexShrink: 0, whiteSpace: "nowrap" }}
      >
        <motion.a
          href="#sample"
          whileHover={{ color: "#086841" }}
          style={{
            padding: "6px 14px",
            fontSize: "13.5px",
            fontWeight: 500,
            color: "#52525b",
            textDecoration: "none",
            fontFamily: "var(--font-body, Inter, sans-serif)",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          Sample report
        </motion.a>

        <motion.a
          href="#audit"
          whileHover={{
            backgroundColor: "#065733",
            boxShadow: "0 4px 16px rgba(8,104,65,0.28)",
          }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "8px 18px",
            backgroundColor: "#086841",
            color: "#ffffff",
            borderRadius: "8px",
            fontSize: "13.5px",
            fontWeight: 600,
            textDecoration: "none",
            fontFamily: "var(--font-body, Inter, sans-serif)",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Audit my stack →
        </motion.a>
      </div>

      <div className="flex md:hidden items-center">
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.94 }}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          style={{
            background: "none",
            border: "1px solid rgba(8,104,65,0.2)",
            borderRadius: "8px",
            color: "#086841",
            fontSize: "18px",
            cursor: "pointer",
            padding: "6px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: isScrolled ? "68px" : "76px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "calc(100vw - 2rem)",
              maxWidth: "360px",
              backgroundColor: "rgba(250,249,247,0.98)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(8,104,65,0.1)",
              borderRadius: "16px",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              boxShadow:
                "0 16px 48px rgba(8,104,65,0.1), 0 4px 12px rgba(0,0,0,0.06)",
              zIndex: 999,
            }}
          >
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  padding: "10px 14px",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#3f3f46",
                  textDecoration: "none",
                  borderRadius: "10px",
                  transition: "all 0.15s ease",
                  fontFamily: "var(--font-body, Inter, sans-serif)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "rgba(8,104,65,0.06)";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "#086841";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "#3f3f46";
                }}
              >
                {item.label}
              </a>
            ))}

            <div
              style={{
                height: "1px",
                backgroundColor: "rgba(8,104,65,0.08)",
                margin: "6px 0",
              }}
            />

            <a
              href="#audit"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                display: "block",
                textAlign: "center",
                padding: "12px",
                backgroundColor: "#086841",
                color: "#fff",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "var(--font-body, Inter, sans-serif)",
                letterSpacing: "-0.01em",
              }}
            >
              Audit my stack →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
