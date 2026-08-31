# The @twobots/ui-theme documentation site — static nginx.
#
# Built multi-arch on Ruxa (amd64 + arm64), pushed to 192.168.4.9:5000, pulled on Lumra.
# Fronted by Ayula at docs.twobots.dev/otso/ (public) and docs.bjornbasar.com/otso/
# (Cloudflare Access). Both names hit THIS container.
#
# amd64 would be enough for Lumra today. arm64 is built anyway so the site can move to
# Hurska without a rebuild — the same reason sleuth does it.
#
# `site/` is produced by ci/deploy.sh BEFORE the build (ci_mkdocs in ../ci/lib.sh):
# mkdocs-material is Python, and running pip under arm64 emulation to produce static HTML
# would be minutes of waste per deploy.
#
# COPY is an explicit ALLOWLIST. The build context is the package repo, so src/, tests/,
# node_modules/, package.json and the raw docs/ markdown must never be served. An allowlist
# fails closed — a new directory in the repo cannot leak by default. ci/deploy.sh asserts the
# important ones 404 after deploy.
FROM nginx:alpine

LABEL org.opencontainers.image.source=https://github.com/bjornbasar/otso
LABEL org.opencontainers.image.description="@twobots/ui-theme — API reference (docs.twobots.dev/otso/)"

COPY nginx.conf /etc/nginx/conf.d/default.conf

# ⚠ THE /otso/ SUBDIRECTORY IS REQUIRED, NOT COSMETIC. The site is served at its real
# public path so MkDocs' trailing-slash redirects stay correct behind a path-routed proxy —
# see the header of nginx.conf. Changing this to `html/` breaks every directory URL.
COPY site/ /usr/share/nginx/html/otso/

EXPOSE 80
