function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function splitLines(ctx, text, maxW, maxLines) {
  const source = String(text || '');
  const lines = [];
  let line = '';
  for (let i = 0; i < source.length; i++) {
    const next = line + source[i];
    if (ctx.measureText(next).width > maxW && line) {
      lines.push(line);
      line = source[i];
      if (lines.length === maxLines - 1) {
        let rest = source.slice(i);
        while (rest.length > 1 && ctx.measureText(rest + '…').width > maxW) {
          rest = rest.slice(0, -1);
        }
        lines.push(rest + (rest.length < source.slice(i).length ? '…' : ''));
        return lines;
      }
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function fitText(ctx, text, x, y, maxW, baseSize, weight) {
  let size = baseSize;
  const value = String(text || '');
  ctx.font = `${weight || 'bold'} ${size}px sans-serif`;
  while (ctx.measureText(value).width > maxW && size > 18) {
    size -= 2;
    ctx.font = `${weight || 'bold'} ${size}px sans-serif`;
  }
  ctx.fillText(value, x, y);
}

function setupCanvas(canvas) {
  const W = 750;
  const H = 1334;
  const ctx = canvas.getContext('2d');
  let dpr = 2;
  try {
    if (wx.getWindowInfo) dpr = wx.getWindowInfo().pixelRatio || 2;
    else if (wx.getSystemInfoSync) dpr = wx.getSystemInfoSync().pixelRatio || 2;
  } catch (e) {}
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);
  return { W, H, ctx, dpr };
}

function drawBackground(ctx, W, H, themeRgb) {
  const grd = ctx.createLinearGradient(0, 0, W, H);
  grd.addColorStop(0, '#090918');
  grd.addColorStop(0.48, '#11112c');
  grd.addColorStop(1, '#070713');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W / 2, 250, 0, W / 2, 250, 610);
  glow.addColorStop(0, `rgba(${themeRgb}, 0.28)`);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = `rgba(${themeRgb}, 0.1)`;
  ctx.lineWidth = 1;
  for (let y = 120; y < H; y += 82) {
    ctx.beginPath();
    ctx.moveTo(44, y);
    ctx.lineTo(W - 44, y);
    ctx.stroke();
  }
}

function drawAvatar(canvas, ctx, data, cx, cy, r) {
  return new Promise((resolve) => {
    const drawFallback = () => {
      ctx.fillStyle = `rgba(${data.themeRgb || '160,168,192'}, 0.14)`;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '116px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(data.avatar || '🌀', cx, cy);
      ctx.textBaseline = 'alphabetic';
      resolve();
    };

    if (data.avatarUrl && canvas.createImage) {
      const img = canvas.createImage();
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
        ctx.restore();
        resolve();
      };
      img.onerror = drawFallback;
      img.src = data.avatarUrl;
    } else {
      drawFallback();
    }
  });
}

function toTempFile(canvas, W, H, dpr, resolve, reject) {
  wx.canvasToTempFilePath({
    canvas,
    x: 0,
    y: 0,
    width: W,
    height: H,
    destWidth: W * dpr,
    destHeight: H * dpr,
    fileType: 'png',
    success: r => resolve(r.tempFilePath),
    fail: reject,
  });
}

function drawShareCanvas(canvas, data) {
  return new Promise((resolve, reject) => {
    if (!canvas) {
      reject(new Error('画布尚未就绪，请稍后重试'));
      return;
    }

    const { W, H, ctx, dpr } = setupCanvas(canvas);
    const themeColor = data.themeColor || '#a0a8c0';
    const themeRgb = data.themeRgb || '160,168,192';
    const cx = W / 2;

    drawBackground(ctx, W, H, themeRgb);

    ctx.fillStyle = themeColor;
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('赛博档案', 44, 78);
    ctx.fillStyle = 'rgba(255,255,255,0.52)';
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(data.genDate || '', W - 44, 78);

    const avatarY = 236;
    const avatarR = 102;
    ctx.shadowColor = `rgba(${themeRgb}, 0.82)`;
    ctx.shadowBlur = 36;
    ctx.fillStyle = `rgba(${themeRgb}, 0.16)`;
    ctx.beginPath();
    ctx.arc(cx, avatarY, avatarR + 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = `rgba(${themeRgb}, 0.72)`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, avatarY, avatarR + 2, 0, Math.PI * 2);
    ctx.stroke();

    drawAvatar(canvas, ctx, Object.assign({}, data, { themeRgb }), cx, avatarY, avatarR).then(() => {
      ctx.textAlign = 'center';
      ctx.fillStyle = themeColor;
      ctx.font = '23px sans-serif';
      const factionLine = `${data.factionIcon || ''} ${data.faction || '神秘'}阵营 · ${data.factionSlogan || ''}`;
      fitText(ctx, factionLine, cx, 392, W - 92, 23, 'normal');

      let titleTop = 430;
      if (data.rarity) {
        ctx.fillStyle = data.rarity.rare ? themeColor : 'rgba(255,255,255,0.64)';
        ctx.font = '21px sans-serif';
        ctx.fillText(`稀有度 ${data.rarity.pct}% · ${data.rarity.tier}`, cx, 430);
        titleTop = 462;
      }

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = `rgba(${themeRgb}, 0.58)`;
      ctx.shadowBlur = 24;
      fitText(ctx, data.heroType || '???', cx, titleTop + 78, W - 120, 84, 'bold');
      ctx.shadowBlur = 0;

      ctx.fillStyle = 'rgba(255,255,255,0.86)';
      fitText(ctx, data.heroTitle || '待解锁', cx, titleTop + 128, W - 130, 34, 'bold');

      let personaBottom = titleTop + 184;
      if (data.persona) {
        ctx.fillStyle = 'rgba(255,255,255,0.64)';
        ctx.font = '25px sans-serif';
        const lines = splitLines(ctx, data.persona, W - 112, 3);
        lines.forEach((line, i) => ctx.fillText(line, cx, titleTop + 184 + i * 40));
        personaBottom = titleTop + 184 + (lines.length - 1) * 40;
      }

      const gridTop = Math.max(742, personaBottom + 58);
      ctx.strokeStyle = `rgba(${themeRgb}, 0.24)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, gridTop - 34);
      ctx.lineTo(W - 50, gridTop - 34);
      ctx.stroke();

      const cellW = 156;
      const cellH = 128;
      const gap = 18;
      const startX = (W - 4 * cellW - 3 * gap) / 2;
      (data.miniCells || []).slice(0, 8).forEach((c, i) => {
        const x = startX + (i % 4) * (cellW + gap);
        const y = gridTop + Math.floor(i / 4) * (cellH + gap);
        ctx.fillStyle = c.done ? `rgba(${themeRgb}, 0.1)` : 'rgba(255,255,255,0.025)';
        roundRect(ctx, x, y, cellW, cellH, 14);
        ctx.fill();
        ctx.strokeStyle = c.done ? `rgba(${themeRgb}, 0.42)` : 'rgba(255,255,255,0.13)';
        ctx.lineWidth = 1.5;
        roundRect(ctx, x, y, cellW, cellH, 14);
        ctx.stroke();

        const mx = x + cellW / 2;
        ctx.textAlign = 'center';
        ctx.fillStyle = c.done ? '#ffffff' : 'rgba(255,255,255,0.38)';
        ctx.font = '32px sans-serif';
        ctx.fillText(c.emoji || '◇', mx, y + 46);
        ctx.fillStyle = c.done ? '#ffffff' : 'rgba(255,255,255,0.42)';
        fitText(ctx, c.done ? (c.typeCode || '—') : '—', mx, y + 84, cellW - 18, 24, 'bold');
        ctx.fillStyle = 'rgba(255,255,255,0.43)';
        ctx.font = '17px sans-serif';
        ctx.fillText(c.name || '', mx, y + 108);
      });

      ctx.strokeStyle = `rgba(${themeRgb}, 0.22)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, H - 112);
      ctx.lineTo(W - 50, H - 112);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillStyle = themeColor;
      ctx.font = '22px sans-serif';
      ctx.fillText(`已捕捉 ${data.doneCount || 0}/8 · ${data.archiveTitle || ''}`, cx, H - 72);
      ctx.fillStyle = 'rgba(255,255,255,0.36)';
      ctx.font = '20px sans-serif';
      ctx.fillText('微信搜「赛博档案」测测你自己', cx, H - 40);

      toTempFile(canvas, W, H, dpr, resolve, reject);
    });
  });
}

module.exports = {
  drawShareCanvas,
};
