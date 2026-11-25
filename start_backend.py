"""Set up and start the local AgriSensing API from an extracted project."""

import os
from pathlib import Path
import secrets
import subprocess
import sys
import venv


BACKEND = Path(__file__).resolve().parent / "backend"


def main():
    if sys.version_info < (3, 10):
        print("AgriSensing requires Python 3.10 or newer.")
        return 1

    settings_file = BACKEND / ".env"
    if not settings_file.exists() and not os.environ.get("DATABASE_URL"):
        template = (BACKEND / ".env.example").read_text(encoding="utf-8")
        template = template.replace(
            "replace_with_a_random_secret_of_at_least_32_bytes", secrets.token_urlsafe(48)
        )
        with settings_file.open("x", encoding="utf-8") as stream:
            stream.write(template)
        print("Created backend/.env with a new signing key. Open it and set the PostgreSQL")
        print("connection and email (SMTP) settings. Then run this command again.")
        print("See 'Windows quick start' in README.md for the setup steps.")
        return 1

    env_dir = BACKEND / ".venv"
    python = env_dir / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
    if not python.exists():
        venv.EnvBuilder(with_pip=True).create(env_dir)

    def run(*arguments, **options):
        return subprocess.run([str(python), *arguments], cwd=BACKEND, **options)

    installed = run(
        "-m", "pip", "show", "agrisensing-backend",
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    if installed.returncode:
        run("-m", "pip", "install", "-e", ".", check=True)

    print("Applying migrations to the configured AgriSensing database.", flush=True)
    run("-m", "alembic", "upgrade", "head", check=True)
    return run("-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "5001").returncode


if __name__ == "__main__":
    try:
        sys.exit(main())
    except subprocess.CalledProcessError as exc:
        sys.exit(exc.returncode)
    except KeyboardInterrupt:
        sys.exit(0)
