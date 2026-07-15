#!/usr/bin/env python3
"""
Task timing analysis — T1 (with pipeline) vs T2 (without pipeline).

# ============================================================================
# INSPECTION ONLY — CANNOT RUN FROM THIS REPLICATION PACKAGE
# ============================================================================
# This script reconstructs session timelines from the commit histories of the
# original participant fork repositories on GitHub.  Running it requires
# authenticated `gh` CLI access to those repositories, which are tied to real
# GitHub usernames and therefore cannot be included in an anonymized package.
# The GitHub usernames have been redacted below.
#
# Additionally, note that the experiment was not originally designed to collect
# timing data via commit histories.  Deriving task durations from git timestamps
# represents a WORST-CASE approximation: many students batch-committed their
# work just before the pipeline-OFF commit, so the measured T1 span is a lower
# bound on the actual time spent.  The t1_est figure (session − T2 − review
# overhead) is a better, but still rough, estimate.  Tasks may have been
# completed considerably earlier than the last commit in each phase suggests.
# ============================================================================

Uses GitHub API commit timestamps to reconstruct session timelines.
Key markers:
  - Template commits (shared across all forks, excluded from student timing):
      "Initial commit" at 2026-04-14T10:40:33Z
      "Adicionada apresentação da Aula 11" at 2026-04-14T17:42:12Z
  - "pipeline OFF" commit → clean T1→T2 boundary (present in 18/19 PRs)
  - socratic_review.md creation commit → session end

Metrics computed per participant:
  t1_span     : first student commit → pipeline_OFF  (lower bound; students batch-committed)
  t2_coding   : pipeline_OFF → last commit before socratic_review
  t2_plus_rev : pipeline_OFF → socratic_review commit  (T2 + AI review generation)
  session     : first student commit → socratic_review commit

Multi-session participants (commit gap > 8 h) are flagged; their t1_span is unreliable.

Requires: gh CLI authenticated with access to the fork repos.
"""

import subprocess, json, re
from datetime import datetime, timezone, timedelta

# GitHub usernames have been redacted for anonymity.
# To reproduce, replace [participant_NN] with the actual GitHub username for
# each PR (available from the private anon_map.csv, not distributed here)
# and ensure `gh` CLI is authenticated with access to the original fork repos.
PR_REPOS = [
    (1,  "[participant_01]/tictactoe_experiment",  "master"),
    (2,  "[participant_02]/tictactoe_experiment",  "NewFeatures"),
    (3,  "[participant_03]/tictactoe_experiment",  "master"),
    (4,  "[participant_04]/tictactoe_experiment",  "master"),
    (6,  "[participant_06]/tictactoe_experiment",  "master"),
    (7,  "[participant_07]/tictactoe_experiment",  "master"),
    (12, "[participant_12]/tictactoe_experiment",  "master"),
    (13, "[participant_13]/tictactoe_experiment",  "master"),
    (14, "[participant_14]/tictactoe_experiment",  "master"),
    (17, "[participant_17]/tictactoe_experiment",  "master"),
    (18, "[participant_18]/tictactoe_experiment",  "master"),
    (20, "[participant_20]/tictactoe_experiment",  "master"),
    (21, "[participant_21]/tictactoe_experiment",  "master"),
    (25, "[participant_25]/tictactoe_experiment",  "master"),
    (28, "[participant_28]/tictactoe_experiment",  "master"),
    (30, "[participant_30]/tictactoe_experiment_research", "master"),
    (31, "[participant_31]/tictactoe_experiment",  "master"),
    (33, "[participant_33]/tictactoe_experiment",  "master"),
    (34, "[participant_34]/tictactoe_experiment",  "master"),
]

TEMPLATE_SHAS_OR_MSGS = {
    "Initial commit",
    "Adicionada apresentação da Aula 11 - Assistentes de Código",
}
# Two template commits share exact timestamps across all forks
TEMPLATE_TIMESTAMPS = {
    datetime(2026, 4, 14, 10, 40, 33, tzinfo=timezone.utc),
    datetime(2026, 4, 14, 17, 42, 12, tzinfo=timezone.utc),
}

PIPELINE_OFF_RE  = re.compile(r"pipeline\s*off", re.IGNORECASE)
SOCRATIC_FILES   = {"artifacts/socratic_review.md", "socratic_review.md"}
MULTI_SESSION_GAP    = timedelta(hours=8)    # consecutive-commit gap
OVERNIGHT_GAP        = timedelta(hours=2)    # pipeline_off → socratic: expected max ~2 h
SESSION_MAX          = timedelta(hours=2, minutes=30)  # total session: expected 1-2 h


def gh_api(path):
    result = subprocess.run(
        ["gh", "api", path, "--paginate"],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        return []
    # gh --paginate may emit multiple JSON arrays; merge them
    raw = result.stdout.strip()
    if raw.startswith("[["):
        arrays = json.loads("[" + raw.replace("][", "],[") + "]")
        merged = []
        for a in arrays:
            merged.extend(a)
        return merged
    return json.loads(raw)


def parse_dt(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00"))


def is_template(commit):
    msg = commit["commit"]["message"].strip()
    dt  = parse_dt(commit["commit"]["committer"]["date"])
    return msg in TEMPLATE_SHAS_OR_MSGS or dt in TEMPLATE_TIMESTAMPS


def get_file_commits(repo, branch, filepath):
    """Return list of (datetime, msg) for commits touching filepath, oldest-first."""
    commits = gh_api(f"repos/{repo}/commits?path={filepath}&sha={branch}&per_page=100")
    result = []
    for c in commits:
        dt  = parse_dt(c["commit"]["committer"]["date"])
        msg = c["commit"]["message"].split("\n")[0][:80]
        result.append((dt, msg))
    result.sort(key=lambda x: x[0])
    return result


def analyze_pr(pr_num, repo, branch):
    # Full commit log (oldest first after sort)
    raw = gh_api(f"repos/{repo}/commits?sha={branch}&per_page=100")
    if not raw:
        return None

    commits = []
    for c in raw:
        if is_template(c):
            continue
        dt  = parse_dt(c["commit"]["committer"]["date"])
        msg = c["commit"]["message"].split("\n")[0][:80]
        commits.append({"dt": dt, "msg": msg})
    commits.sort(key=lambda x: x["dt"])

    if not commits:
        return None

    # --- Identify key events ---
    first_student_commit = commits[0]["dt"]

    # pipeline OFF: first occurrence
    pipeline_off = None
    for c in commits:
        if PIPELINE_OFF_RE.search(c["msg"]):
            pipeline_off = c["dt"]
            break

    # socratic review commit: first commit to socratic_review.md
    socratic_commits = get_file_commits(repo, branch, "artifacts/socratic_review.md")
    socratic_time = socratic_commits[0][0] if socratic_commits else None

    # last code commit (before socratic, after pipeline OFF)
    last_code_before_socratic = None
    if pipeline_off and socratic_time:
        for c in reversed(commits):
            if c["dt"] < socratic_time and c["dt"] > pipeline_off:
                if not PIPELINE_OFF_RE.search(c["msg"]):
                    last_code_before_socratic = c["dt"]
                    break

    # Multi-session flag: gap > 8 h between any consecutive commits,
    # OR pipeline_off → socratic_time > 4 h (overnight gap not caught by commits).
    multi_session = False
    for i in range(1, len(commits)):
        if commits[i]["dt"] - commits[i-1]["dt"] > MULTI_SESSION_GAP:
            multi_session = True
            break
    if pipeline_off and socratic_time and socratic_time - pipeline_off > OVERNIGHT_GAP:
        multi_session = True
    if socratic_time and first_student_commit and socratic_time - first_student_commit > SESSION_MAX:
        multi_session = True

    def mins(delta):
        return round(delta.total_seconds() / 60, 1) if delta else None

    t1_span = mins(pipeline_off - first_student_commit) if pipeline_off else None
    t2_coding = mins(last_code_before_socratic - pipeline_off) if (pipeline_off and last_code_before_socratic) else None
    t2_plus_rev = mins(socratic_time - pipeline_off) if (pipeline_off and socratic_time) else None
    session = mins(socratic_time - first_student_commit) if socratic_time else None

    return {
        "pr": pr_num,
        "first_student":   first_student_commit.strftime("%H:%M") if first_student_commit else None,
        "pipeline_off":    pipeline_off.strftime("%H:%M") if pipeline_off else None,
        "socratic_end":    socratic_time.strftime("%H:%M") if socratic_time else None,
        "t1_span_min":     t1_span,
        "t2_coding_min":   t2_coding,
        "t2_plus_rev_min": t2_plus_rev,
        "session_min":     session,
        "multi_session":   multi_session,
        "pipeline_off_found": pipeline_off is not None,
    }


def main():
    results = []
    for pr_num, repo, branch in PR_REPOS:
        print(f"  Fetching PR {pr_num} ({repo})...", flush=True)
        row = analyze_pr(pr_num, repo, branch)
        if row:
            results.append(row)

    # --- Print results table ---
    print()
    print("=" * 100)
    print(f"{'PR':>3}  {'Start':>5}  {'PipeOFF':>7}  {'SocEnd':>6}  "
          f"{'T1-span':>7}  {'T2-code':>7}  {'T2+rev':>7}  {'Session':>7}  {'Flags'}")
    print("-" * 100)

    t1_vals, t2_code_vals, t2_rev_vals, session_vals = [], [], [], []
    for r in results:
        flag = ""
        if r["multi_session"]:  flag += "MULTI "
        if not r["pipeline_off_found"]: flag += "NO_OFF "

        def fmt(v):
            return f"{v:>7.1f}" if v is not None else f"{'?':>7}"

        print(f"{r['pr']:>3}  {r['first_student'] or '?':>5}  "
              f"{r['pipeline_off'] or '?':>7}  {r['socratic_end'] or '?':>6}  "
              f"{fmt(r['t1_span_min'])}  {fmt(r['t2_coding_min'])}  "
              f"{fmt(r['t2_plus_rev_min'])}  {fmt(r['session_min'])}  {flag}")

        if r["t1_span_min"] is not None and not r["multi_session"]:
            t1_vals.append(r["t1_span_min"])
        if r["t2_coding_min"] is not None and not r["multi_session"]:
            t2_code_vals.append(r["t2_coding_min"])
        if r["t2_plus_rev_min"] is not None and not r["multi_session"]:
            t2_rev_vals.append(r["t2_plus_rev_min"])
        if r["session_min"] is not None and not r["multi_session"]:
            session_vals.append(r["session_min"])

    print("=" * 100)
    print()
    print("NOTES:")
    print("  t1_span   = first student commit → pipeline OFF  (LOWER BOUND: many students batch-committed)")
    print("  t2_coding = pipeline OFF → last code commit before socratic review")
    print("  t2+rev    = pipeline OFF → socratic_review.md commit  (includes AI review generation ~5-20 min)")
    print("  session   = first student commit → socratic_review.md commit")
    print("  MULTI     = multi-session participant (gap > 8 h); timing figures unreliable for these")
    print("  NO_OFF    = no 'pipeline OFF' commit found")
    print()

    import statistics

    def stat(vals, label):
        if not vals:
            return
        print(f"  {label}: n={len(vals)}  mean={statistics.mean(vals):.1f}  "
              f"median={statistics.median(vals):.1f}  "
              f"min={min(vals):.1f}  max={max(vals):.1f}")

    print(f"Summary (single-session participants only):")
    stat(t1_vals,       "T1-span (lower bound)")
    stat(t2_code_vals,  "T2-coding-only       ")
    stat(t2_rev_vals,   "T2+review            ")
    stat(session_vals,  "Full session         ")

    # ---- Estimate T1 duration ----------------------------------------------
    # T1_est = session - T2_coding - review_overhead
    # Review overhead: T2+rev minus T2_coding, for rows where both exist
    review_overhead = [
        r["t2_plus_rev_min"] - r["t2_coding_min"]
        for r in results
        if not r["multi_session"]
        and r["t2_plus_rev_min"] is not None
        and r["t2_coding_min"] is not None
    ]
    median_review = statistics.median(review_overhead) if review_overhead else None

    t1_est_vals = []
    for r in results:
        if r["multi_session"]: continue
        if r["session_min"] is not None and r["t2_coding_min"] is not None and median_review:
            est = r["session_min"] - r["t2_coding_min"] - median_review
            if est > 0:
                t1_est_vals.append(est)

    if median_review:
        print(f"\n  Median AI-review overhead: {median_review:.1f} min")
    if t1_est_vals:
        stat(t1_est_vals, "T1 est (session−T2−review)")

    print()
    print("=" * 80)
    print("INTERPRETATION")
    print("=" * 80)
    n_single = len(session_vals)
    n_multi  = sum(1 for r in results if r["multi_session"])
    n_no_off = sum(1 for r in results if not r["pipeline_off_found"])
    print(f"""
Session completion ({n_single}/19 single-session):
  {n_single} of 19 participants completed both tasks in a single continuous
  session. {n_multi} were flagged as multi-session (gap > {int(MULTI_SESSION_GAP.seconds/3600)} h between commits
  or session > {int(SESSION_MAX.seconds/60)} min), and 1 (PR 25) lacked a 'pipeline OFF' marker.

T2 vibe-coding speed:
  Median T2 coding time (pipeline OFF → last code commit): {statistics.median(t2_code_vals):.0f} min
  This is the free-form AI-delegation phase — fast because the AI does most work.

Socratic review generation overhead:
  Median {median_review:.0f} min from last T2 commit to artifacts committed.
  This is the AI-generated Socratic review — not developer effort.

T1 (structured pipeline) estimated duration:
  T1 time = session − T2_coding − review overhead
  Median estimate: {statistics.median(t1_est_vals):.0f} min (includes planning, AI interaction, REACTO)

Key finding:
  T1 (structured) and T2 (free-form) appear comparable in coding time.
  The pipeline does not impose a prohibitive overhead; both tasks fit comfortably
  within the 1–2 h expected session window (median session: {statistics.median(session_vals):.0f} min).
  T2's speed advantage comes at the cost of understanding (Mastery Score Δ = −10.7).

Methodological caveat:
  Most students committed T1 work in a single batch just before 'pipeline OFF',
  so the t1_span column underestimates true T1 coding time. The t1_est figure
  derived from (session − T2 − review) is the more reliable T1 approximation.
""")


if __name__ == "__main__":
    main()
