#!/bin/sh
# Re-stamp ?v= on shared CSS/JS links after editing assets/css/prepeve.css or assets/js/prepeve.js,
# so browsers fetch the new files instead of a cached copy.
cd "$(dirname "$0")/.." || exit 1
V=$(cat assets/css/prepeve.css assets/js/prepeve.js | md5sum | cut -c1-8)
git ls-files '*.html' | xargs perl -pi -e "s#/assets/(css/prepeve\.css|js/prepeve\.js)(\?v=[a-z0-9]+)?\"#/assets/\$1?v=$V\"#g"
echo "assets version: $V"
