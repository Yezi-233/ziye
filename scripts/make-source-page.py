from pathlib import Path

src_path = Path(__file__).resolve().parents[1] / 'public' / 'code' / 'checkin-optimization.py'
out_path = src_path.with_suffix('.html')
src = src_path.read_text(encoding='utf-8')
esc = src.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>值机柜台优化 · 源码</title>
  <style>
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      background: #f4f7fb;
      color: #0f2744;
    }}
    header {{
      position: sticky; top: 0; z-index: 2;
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
      padding: 14px 22px; background: #0b3d6e; color: #fff;
      box-shadow: 0 8px 24px rgba(11,61,110,.18);
    }}
    header h1 {{ margin: 0; font-size: 16px; font-weight: 600; }}
    header p {{ margin: 4px 0 0; font-size: 12px; opacity: .78; }}
    .actions {{ display: flex; gap: 10px; flex-wrap: wrap; }}
    a.btn, button.btn {{
      appearance: none; border: 1px solid rgba(255,255,255,.35); background: transparent;
      color: #fff; border-radius: 999px; padding: 8px 14px; font-size: 13px; cursor: pointer;
      text-decoration: none;
    }}
    a.btn:hover, button.btn:hover {{ background: rgba(255,255,255,.12); }}
    main {{ max-width: 1100px; margin: 24px auto; padding: 0 16px 40px; }}
    pre {{
      margin: 0; padding: 22px 20px; overflow: auto;
      background: #0d1b2a; color: #e8eef7; border-radius: 14px;
      font: 13px/1.55 Consolas, "Cascadia Code", monospace;
      box-shadow: 0 16px 40px rgba(13,27,42,.12);
    }}
  </style>
</head>
<body>
  <header>
    <div>
      <h1>机场值机柜台优化 · Python 源码</h1>
      <p>CheckinOptimization · 多目标 / TOPSIS / Pareto</p>
    </div>
    <div class="actions">
      <a class="btn" href="./checkin-optimization.py" download>下载 .py</a>
      <button class="btn" type="button" id="copyBtn">复制源码</button>
    </div>
  </header>
  <main>
    <pre id="src"><code>{esc}</code></pre>
  </main>
  <script>
    document.getElementById('copyBtn').addEventListener('click', async function () {{
      const text = document.getElementById('src').innerText;
      await navigator.clipboard.writeText(text);
      this.textContent = '已复制';
      setTimeout(() => {{ this.textContent = '复制源码'; }}, 1200);
    }});
  </script>
</body>
</html>
"""

out_path.write_text(html, encoding='utf-8')
print(f'wrote {out_path} ({out_path.stat().st_size} bytes)')
