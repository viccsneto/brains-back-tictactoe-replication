import os, re, glob, subprocess, statistics as st
from scipy.stats import wilcoxon

ROOT   = os.path.dirname(os.path.abspath(__file__))
BASE   = os.path.join(ROOT, "experiment_project_baseline")
PRS    = os.path.join(ROOT, "PRs")
SCORED = [1,2,3,4,6,7,12,13,14,17,18,20,21,25,28,30,31,33,34]
FILES  = ['game.js','script.js','index.html','style.css']

EMOJI=re.compile(r'[\U0001F300-\U0001FAFF\U0001F000-\U0001F0FF]')
EMOJI_ID=re.compile(r'PLAYER_SYMBOLS|getPlayerSymbol|\bSYMBOLS?\b|emoji|Array\.from|split\(\s*[\'"]\s*[\'"]\s*\)|codePointAt|fromCodePoint',re.I)
SCORE_ID=re.compile(r'\bscore|placar|scoreboard|\bwins?\b|vit[oó]ria|\bvenc|\bround\b|\btally\b|\bpoints?\b',re.I)
DEC=re.compile(r'\bif\b|\belse\s+if\b|\bfor\b|\bwhile\b|\bcase\b|\bcatch\b|&&|\|\||\?(?![.:])')

def added_lines(basefile, finalfile):
    """Return list of added/changed lines (the '+' side of a unified diff)."""
    if not os.path.exists(finalfile):
        return []
    if not os.path.exists(basefile):
        # whole file is new
        return [l for l in open(finalfile,encoding='utf-8',errors='ignore').read().splitlines()]
    out=subprocess.run(['diff','--unchanged-line-format=','--old-line-format=',
                        '--new-line-format=%L', basefile, finalfile],
                       capture_output=True,text=True)
    return out.stdout.splitlines()

def classify(folder):
    e_js=e_cc=e_mk=s_js=s_cc=s_mk=0
    for fn in FILES:
        bf=os.path.join(BASE,fn)
        ff=os.path.join(folder,fn)
        js=fn.endswith('.js')
        for ln in added_lines(bf,ff):
            s=ln.strip()
            if not s or s.startswith('//') or s.startswith('*') or s.startswith('<!--'): continue
            is_s=bool(SCORE_ID.search(ln))
            is_e=bool((EMOJI.search(ln) or EMOJI_ID.search(ln)) and not is_s)
            dec=len(DEC.findall(ln))
            if is_e:
                if js: e_js+=1; e_cc+=dec
                else:  e_mk+=1
            if is_s:
                if js: s_js+=1; s_cc+=dec
                else:  s_mk+=1
    return e_js,e_cc,e_mk,s_js,s_cc,s_mk

rows=[]
for n in SCORED:
    folder=glob.glob(os.path.join(PRS,f"PR_{n:02d}_SOCRATIC"))[0]
    rows.append((n,)+classify(folder))

print("ADDED-LINES vs baseline (per task)")
h=f"{'PR':>3} | {'T1 js':>5} {'cc':>3} {'mk':>3} | {'T2 js':>5} {'cc':>3} {'mk':>3}"
print(h); print('-'*len(h))
for n,ej,ec,em,sj,sc,sm in rows:
    print(f"{n:>3} | {ej:>5} {ec:>3} {em:>3} | {sj:>5} {sc:>3} {sm:>3}")

def c(i): return [r[i] for r in rows]
def summ(l,v): print(f"  {l:16} mean={st.mean(v):4.1f} median={st.median(v):4.1f} sd={st.pstdev(v):3.1f} range=[{min(v)},{max(v)}]")
print(f"\n=== Aggregate added lines (n={len(rows)}) ===")
summ("T1 emoji JS LOC",c(1)); summ("T2 score JS LOC",c(4))
summ("T1 emoji JS CC ",c(2)); summ("T2 score JS CC ",c(5))
summ("T1 emoji mk LOC",c(3)); summ("T2 score mk LOC",c(6))
def wt(l,a,b):
    if all(x-y==0 for x,y in zip(a,b)): print(f"  {l}: all zero"); return
    w,p=wilcoxon(a,b,zero_method='wilcox'); print(f"  {l}: W={w:.1f} p={p:.3f} -> {'NO sig diff' if p>=0.05 else 'sig diff'}")
print("\n=== Equivalence (T1 vs T2 added) ===")
wt("JS logic LOC",c(1),c(4)); wt("JS cyclomatic",c(2),c(5)); wt("markup LOC ",c(3),c(6))
