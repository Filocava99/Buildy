git clone "https://${1}@github.com/Filocava99/Buildy.git" Buildy
rm "Buildy/projects.json"
rm "Buildy/index.html"
cp "projects.json" "Buildy/projects.json"
cp "public/stylesheets/projects.css" "Buildy/public/stylesheets/projects.css"
cp "public/stylesheets/index.css" "Buildy/public/stylesheets/index.css"
cp "index.html" "Buildy/index.html"
cd Buildy
git add projects.json
git add index.html
git add public/*
git commit -m "Update static files"
git push
rm -rf ../Buildy