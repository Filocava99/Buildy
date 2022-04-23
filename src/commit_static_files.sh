git clone https://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@github.com/Filocava99/Buildy.git Buildy
rm "Buildy/projects.json"
cp "projects.json" "Buildy/projects.json"
cp "public/stylesheets/style.css" "Buildy/public/stylesheets/style.css"
cd Buildy
git add projects.json
git add public/*
git commit -m "Update static files"
git push
rm -rf ../Buildy