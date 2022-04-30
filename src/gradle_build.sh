cd "projects/${1}"
if ./gradlew build; then
  exit 0
else
  exit 1
fi