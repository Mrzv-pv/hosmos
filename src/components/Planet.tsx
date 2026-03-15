"use client";

import { useRef, useEffect, useState } from "react";

const BLUE = "#1E6FD9";
const BLUE_MID = "#5B9CF6";
const VIOLET = "#6B3FA0";
const VIOLET_MID = "#9B6FD4";

const SATS = [
  { name: "Carbon",  r: 0.56, tilt: -22, spd: 0.38, sz: 13, col: BLUE,       icon: "E"  },
  { name: "People",  r: 0.69, tilt:  14, spd: 0.26, sz: 13, col: VIOLET,     icon: "S"  },
  { name: "Govern.", r: 0.81, tilt: -10, spd: 0.18, sz: 12, col: BLUE_MID,   icon: "G"  },
  { name: "Reports", r: 0.62, tilt:  30, spd: 0.32, sz: 12, col: VIOLET_MID, icon: "R"  },
  { name: "Supply",  r: 0.75, tilt: -30, spd: 0.22, sz: 12, col: BLUE,       icon: "SC" },
  { name: "Goals",   r: 0.86, tilt:  18, spd: 0.15, sz: 11, col: VIOLET,     icon: "OK" },
  { name: "API",     r: 0.92, tilt:  -8, spd: 0.12, sz: 11, col: BLUE_MID,   icon: "AP" },
];

interface SatDef { name: string; r: number; tilt: number; spd: number; sz: number; col: string; icon: string }
interface Pos { x: number; y: number; z: number; sz: number; isBehind: boolean; sat: SatDef }

export default function Planet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ t: 0, drag: false, lastX: 0, rotY: 0.3 });
  const tipRef = useRef<HTMLDivElement>(null);
  const positionsRef = useRef<Pos[]>([]);
  const rafRef = useRef<number>(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const cw = container.clientWidth;
      const w = Math.min(cw, 720);
      const h = Math.round(w * 0.82);
      setDims({ w, h });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dims.w === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dims.w * dpr;
    canvas.height = dims.h * dpr;
    ctx.scale(dpr, dpr);

    const W = dims.w, H = dims.h;
    const cx = W / 2, cy = H / 2 - H * 0.02;
    const R = Math.min(W, H) * 0.17;
    const st = stateRef.current;

    function orbitXY(sat: SatDef, angle: number) {
      const orbitR = sat.r * (W / 2);
      const tiltR = (sat.tilt * Math.PI) / 180;
      const x = cx + orbitR * Math.cos(angle) * Math.cos(st.rotY) - orbitR * Math.sin(angle) * Math.sin(tiltR) * Math.sin(st.rotY);
      const y = cy + orbitR * Math.cos(angle) * Math.sin(st.rotY) * 0.38 + orbitR * Math.sin(angle) * Math.cos(tiltR) * 0.62;
      const z = orbitR * Math.cos(angle) * Math.sin(st.rotY) + orbitR * Math.sin(angle) * Math.sin(tiltR);
      return { x, y, z };
    }

    function drawPlanet() {
      const t = st.t;
      const glow = ctx!.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.8);
      glow.addColorStop(0, "rgba(107,63,160,.18)");
      glow.addColorStop(0.5, "rgba(30,111,217,.10)");
      glow.addColorStop(1, "rgba(245,240,235,0)");
      ctx!.beginPath(); ctx!.arc(cx, cy, R * 1.8, 0, Math.PI * 2);
      ctx!.fillStyle = glow; ctx!.fill();

      const atm = ctx!.createRadialGradient(cx - R * 0.25, cy - R * 0.25, R * 0.3, cx, cy, R * 1.08);
      atm.addColorStop(0, "rgba(91,156,246,.4)");
      atm.addColorStop(0.6, "rgba(155,111,212,.3)");
      atm.addColorStop(1, "rgba(107,63,160,.08)");
      ctx!.beginPath(); ctx!.arc(cx, cy, R * 1.08, 0, Math.PI * 2);
      ctx!.fillStyle = atm; ctx!.fill();

      const hue1 = `hsl(${215 + Math.sin(t * 0.4) * 18},72%,${52 + Math.sin(t * 0.3) * 6}%)`;
      const hue2 = `hsl(${270 + Math.cos(t * 0.35) * 20},55%,${44 + Math.cos(t * 0.25) * 5}%)`;
      const hue3 = `hsl(${235 + Math.sin(t * 0.5) * 15},65%,${60 + Math.sin(t * 0.45) * 8}%)`;
      const grad = ctx!.createRadialGradient(
        cx - R * 0.3 + Math.sin(t * 0.6) * R * 0.12,
        cy - R * 0.25 + Math.cos(t * 0.5) * R * 0.1,
        R * 0.05, cx, cy, R
      );
      grad.addColorStop(0, hue3);
      grad.addColorStop(0.35, hue1);
      grad.addColorStop(0.7, hue2);
      grad.addColorStop(1, "#1a1040");
      ctx!.beginPath(); ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.fillStyle = grad; ctx!.fill();

      ctx!.save(); ctx!.beginPath(); ctx!.arc(cx, cy, R, 0, Math.PI * 2); ctx!.clip();
      for (let i = 0; i < 3; i++) {
        const bx = cx + Math.sin(t * 0.3 + i * 2.1) * R * 0.45;
        const by = cy + Math.cos(t * 0.25 + i * 1.7) * R * 0.35;
        const br = ctx!.createRadialGradient(bx, by, 0, bx, by, R * 0.55);
        br.addColorStop(0, `rgba(255,255,255,${0.06 + Math.sin(t * 0.4 + i) * 0.03})`);
        br.addColorStop(1, "rgba(255,255,255,0)");
        ctx!.beginPath(); ctx!.arc(bx, by, R * 0.55, 0, Math.PI * 2);
        ctx!.fillStyle = br; ctx!.fill();
      }
      ctx!.restore();

      const spec = ctx!.createRadialGradient(cx - R * 0.38, cy - R * 0.38, 0, cx - R * 0.38, cy - R * 0.38, R * 0.48);
      spec.addColorStop(0, "rgba(255,255,255,.32)");
      spec.addColorStop(0.5, "rgba(255,255,255,.08)");
      spec.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.beginPath(); ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.fillStyle = spec; ctx!.fill();

      ctx!.beginPath(); ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.strokeStyle = "rgba(255,255,255,.18)"; ctx!.lineWidth = 1; ctx!.stroke();
    }

    function drawRing(isFront: boolean) {
      const rx = R * 1.72, ry = R * 0.38;
      ctx!.save();
      ctx!.translate(cx, cy);
      ctx!.rotate(st.rotY);

      const rg = ctx!.createLinearGradient(-rx, 0, rx, 0);
      rg.addColorStop(0, "rgba(30,111,217,.0)");
      rg.addColorStop(0.15, "rgba(30,111,217,.55)");
      rg.addColorStop(0.45, "rgba(107,63,160,.70)");
      rg.addColorStop(0.55, "rgba(91,156,246,.65)");
      rg.addColorStop(0.85, "rgba(155,111,212,.50)");
      rg.addColorStop(1, "rgba(107,63,160,.0)");
      ctx!.beginPath(); ctx!.ellipse(0, 0, rx, ry, 0, isFront ? 0 : Math.PI, isFront ? Math.PI : Math.PI * 2);
      ctx!.strokeStyle = rg; ctx!.lineWidth = isFront ? 9 : 7;
      ctx!.globalAlpha = isFront ? 0.85 : 0.55; ctx!.stroke();

      const rg2 = ctx!.createLinearGradient(-rx * 0.8, 0, rx * 0.8, 0);
      rg2.addColorStop(0, "rgba(155,111,212,.0)");
      rg2.addColorStop(0.2, "rgba(255,255,255,.25)");
      rg2.addColorStop(0.5, "rgba(255,255,255,.18)");
      rg2.addColorStop(0.8, "rgba(255,255,255,.22)");
      rg2.addColorStop(1, "rgba(255,255,255,.0)");
      ctx!.beginPath(); ctx!.ellipse(0, 0, rx * 0.78, ry * 0.78, 0, isFront ? 0 : Math.PI, isFront ? Math.PI : Math.PI * 2);
      ctx!.strokeStyle = rg2; ctx!.lineWidth = 3; ctx!.globalAlpha = isFront ? 0.6 : 0.35; ctx!.stroke();

      ctx!.globalAlpha = 1;
      ctx!.restore();
    }

    function drawOrbit(sat: SatDef) {
      ctx!.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.06) {
        const { x, y } = orbitXY(sat, a);
        if (a === 0) { ctx!.moveTo(x, y); } else { ctx!.lineTo(x, y); }
      }
      ctx!.closePath();
      ctx!.strokeStyle = "rgba(107,63,160,.12)";
      ctx!.lineWidth = 0.8; ctx!.stroke();
    }

    function drawSat(sat: SatDef, angle: number): Pos {
      const { x, y, z } = orbitXY(sat, angle);
      const isBehind = z < 0;
      const alpha = isBehind ? 0.35 : 1;
      const scale = isBehind ? 0.78 : 1;
      const sz = sat.sz * scale;

      ctx!.save();
      ctx!.globalAlpha = alpha;

      const g = ctx!.createRadialGradient(x, y, 0, x, y, sz * 2.2);
      g.addColorStop(0, sat.col + "55");
      g.addColorStop(1, "transparent");
      ctx!.beginPath(); ctx!.arc(x, y, sz * 2.2, 0, Math.PI * 2);
      ctx!.fillStyle = g; ctx!.fill();

      const dg = ctx!.createRadialGradient(x - sz * 0.25, y - sz * 0.25, 0, x, y, sz);
      dg.addColorStop(0, "rgba(255,255,255,.7)");
      dg.addColorStop(0.4, sat.col);
      dg.addColorStop(1, "rgba(0,0,0,.3)");
      ctx!.beginPath(); ctx!.arc(x, y, sz, 0, Math.PI * 2);
      ctx!.fillStyle = dg; ctx!.fill();
      ctx!.strokeStyle = "rgba(255,255,255,.35)"; ctx!.lineWidth = 0.8; ctx!.stroke();

      if (!isBehind) {
        ctx!.fillStyle = "#fff";
        ctx!.font = `bold ${sz * 0.85}px DM Sans,sans-serif`;
        ctx!.textAlign = "center"; ctx!.textBaseline = "middle";
        ctx!.fillText(sat.icon, x, y + 0.5);
      }

      ctx!.globalAlpha = 1;
      ctx!.restore();
      return { x, y, z, sz, isBehind, sat };
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      st.t += 0.012;
      const positions: Pos[] = [];

      SATS.forEach(s => drawOrbit(s));
      drawRing(false);

      SATS.forEach((sat, i) => {
        const angle = st.t * sat.spd + i * 1.1;
        const pos = drawSat(sat, angle);
        positions.push(pos);
      });

      drawPlanet();
      drawRing(true);

      SATS.forEach((sat, i) => {
        const angle = st.t * sat.spd + i * 1.1;
        const { z } = orbitXY(sat, angle);
        if (z >= 0) {
          const pos = drawSat(sat, angle);
          positions[i] = pos;
        }
      });

      positionsRef.current = positions;
      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [dims]);

  // Mouse / touch handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    const tip = tipRef.current;
    const scene = canvas?.parentElement;
    if (!canvas || !tip || !scene) return;
    const st = stateRef.current;

    const getScale = () => canvas.clientWidth / (dims.w || 1);

    const onMouseDown = (e: MouseEvent) => { st.drag = true; st.lastX = e.clientX; };
    const onMouseUp = () => { st.drag = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (st.drag) { st.rotY += (e.clientX - st.lastX) * 0.005; st.lastX = e.clientX; }
      const rect = canvas.getBoundingClientRect();
      const scale = getScale();
      const mx = (e.clientX - rect.left) / scale, my = (e.clientY - rect.top) / scale;
      let found: Pos | undefined = undefined;
      for (const p of positionsRef.current) {
        if (!p.isBehind && Math.hypot(mx - p.x, my - p.y) < p.sz * 2.5) found = p;
      }
      if (found) {
        const f = found;
        tip.style.opacity = "1";
        const tipX = f.x * scale + rect.left - scene.getBoundingClientRect().left + 14;
        const tipY = f.y * scale + rect.top - scene.getBoundingClientRect().top - 16;
        tip.style.left = tipX + "px";
        tip.style.top = tipY + "px";
        tip.textContent = f.sat.name;
      } else {
        tip.style.opacity = "0";
      }
    };
    const onTouchStart = (e: TouchEvent) => { st.lastX = e.touches[0].clientX; };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        st.rotY += (e.touches[0].clientX - st.lastX) * 0.005;
        st.lastX = e.touches[0].clientX;
      }
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchstart", onTouchStart);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
    };
  }, [dims]);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-center w-full">
      <canvas
        ref={canvasRef}
        className="block w-full cursor-grab active:cursor-grabbing"
        style={{ maxWidth: 720, height: dims.h || "auto", width: dims.w || "100%" }}
      />
      <div
        ref={tipRef}
        className="absolute pointer-events-none bg-white/92 backdrop-blur-sm border border-black/8 rounded-[10px] px-3 py-1.5 text-xs text-gray-900 whitespace-nowrap opacity-0 shadow-lg"
        style={{ transition: "opacity 0.2s" }}
      />
      <p className="text-xs text-gray-400 tracking-wider -mt-2">
        <strong className="text-gray-500 font-medium">Hosmos</strong> · ESG control centre · drag to rotate
      </p>
    </div>
  );
}
