# Enable globstar for recursive matching
shopt -s globstar

for file in src/**/*.jsx
do
  mv -v "$file" "${file%.jsx}.js"
done
