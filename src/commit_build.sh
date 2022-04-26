git clone "https://${4}@github.com/Filocava99/Buildy.git" Buildy
git config user.email "filippo.cavallari99@gmail.com"
git config user.name "Buildy"
mkdir -p "Buildy/builds/${1}"
mv "builds/${1}/${2}" "Buildy/builds/${1}/${2}"
mv "builds/${1}/${1}.html" "Buildy/builds/${1}/${1}.html"
mv "builds/${1}/${3}" "Buildy/builds/${1}/${3}"
cd Buildy
git add builds/*
git commit -m "Add build for ${1}"
git push
rm -rf ../Buildy