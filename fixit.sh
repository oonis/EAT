dos2unix server.js
dos2unix README.md
find ./parsing/ -type f -regextype posix-extended -regex '.*((\.ejs)|(\.js))' -print0 | xargs -0 dos2unix --
find ./views/ -type f -regextype posix-extended -regex '.*((\.ejs)|(\.js))' -print0 | xargs -0 dos2unix --
find ./routes/ -type f -regextype posix-extended -regex '.*((\.ejs)|(\.js))' -print0 | xargs -0 dos2unix --
