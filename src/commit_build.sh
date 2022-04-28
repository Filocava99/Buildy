git clone "https://${5}@github.com/Filocava99/Buildy.git" Buildy
mkdir -p "Buildy/builds/${1}"
mv "builds/${1}/${2}" "Buildy/builds/${1}/${2}"
mv "builds/${1}/${1}.html" "Buildy/builds/${1}/${1}.html"
mv "builds/${1}/${3}" "Buildy/builds/${1}/${3}"
mv "builds/${1}/${4}" "Buildy/builds/${1}/${4}"
cd Buildy
git add builds/*
git commit -m "Add build for ${1}"
git push
rm -rf ../Buildy