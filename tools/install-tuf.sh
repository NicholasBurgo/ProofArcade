#!/usr/bin/env bash
# Sets the Proof Arcade up on an always-on Linux box (tuf): serve.py as a systemd user
# service that starts at boot, even with nobody logged in, and starts again 5 seconds after
# it stops for any reason, so after a crash the arcade comes back by itself. If the repo is a
# git clone, a timer pulls from GitHub every 15 minutes and restarts the server when its
# Python changes. Run it on that box, from the repo:
#   bash tools/install-tuf.sh            (PORT=9000 bash tools/install-tuf.sh for another port)
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8230}"
NAME="${NAME:-proof-arcade}"
UNITS="$HOME/.config/systemd/user"
LOG="$HOME/.cache/proof-arcade"
mkdir -p "$UNITS" "$LOG"
PY="$(command -v python3)" || { echo "python3 is missing: install it first (sudo apt install python3)."; exit 1; }
# a user service gets a bare PATH; give it this shell's, so the grader finds claude (~/.local/bin)
SVC_PATH="$HOME/.local/bin:$PATH"

cat > "$UNITS/$NAME.service" <<UNIT
[Unit]
Description=Proof Arcade on port $PORT (Math 2230, with Check my writing)
After=network-online.target
Wants=network-online.target
# never stop trying to restart it
StartLimitIntervalSec=0

[Service]
WorkingDirectory=$REPO
ExecStart=$PY -u $REPO/serve.py $PORT
Restart=always
RestartSec=5
Environment=PATH=$SVC_PATH
StandardOutput=append:$LOG/serve.log
StandardError=append:$LOG/serve.log

[Install]
WantedBy=default.target
UNIT

if git -C "$REPO" remote get-url origin >/dev/null 2>&1; then
  cat > "$UNITS/$NAME-update.service" <<UNIT
[Unit]
Description=Pull the Proof Arcade from GitHub, and restart it if its Python changed

[Service]
Type=oneshot
Environment=PATH=$SVC_PATH
ExecStart=/usr/bin/env bash -c 'cd "$REPO" && before=\$(git rev-parse HEAD) && git pull --ff-only --quiet && if ! git diff --quiet "\$before" HEAD -- serve.py grader.py; then systemctl --user restart $NAME.service; fi'
UNIT
  cat > "$UNITS/$NAME-update.timer" <<UNIT
[Unit]
Description=Pull the Proof Arcade from GitHub every 15 minutes

[Timer]
OnBootSec=2min
OnUnitActiveSec=15min

[Install]
WantedBy=timers.target
UNIT
fi

systemctl --user daemon-reload
systemctl --user enable --now "$NAME.service"
[ -f "$UNITS/$NAME-update.timer" ] && systemctl --user enable --now "$NAME-update.timer"

# start at boot without anyone logging in: after a crash and reboot, nobody does
if [ "${NO_LINGER:-}" != 1 ] && [ "$(loginctl show-user "$USER" -p Linger --value 2>/dev/null)" != yes ]; then
  loginctl enable-linger "$USER" 2>/dev/null || sudo loginctl enable-linger "$USER"
fi

sleep 2
echo
if curl -s -m 5 "http://127.0.0.1:$PORT/grade/ping" | grep -q '"ok"'; then
  echo "The arcade is running on port $PORT."
else
  echo "It didn't answer yet. See: systemctl --user status $NAME   and   tail $LOG/serve.log"
fi
TS="$(tailscale ip -4 2>/dev/null | head -1 || true)"
[ -n "$TS" ] && echo "On the tablet: http://$TS:$PORT"

# Check my writing runs the Claude Code CLI on this box, signed in to your account
if ! command -v claude >/dev/null 2>&1 && [ ! -x "$HOME/.local/bin/claude" ]; then
  echo
  echo "Claude Code isn't installed here, so Check my writing won't work yet. Install it, then sign in:"
  echo "  curl -fsSL https://claude.ai/install.sh | bash"
  echo "  CLAUDE_CONFIG_DIR=~/.claude-personal claude auth login"
elif ! { [ -f "$HOME/.claude-personal/.credentials.json" ] || PATH="$SVC_PATH" claude auth status --json 2>/dev/null | grep -q '"loggedIn": *true'; }; then
  echo
  echo "Claude Code isn't signed in here yet. Sign in to your personal account:"
  echo "  CLAUDE_CONFIG_DIR=~/.claude-personal claude auth login"
fi
