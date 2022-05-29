git clone "https://${4}@github.com/Filocava99/Buildy.git" Buildy
mkdir -p "Buildy/builds/${1}"
mv "builds/${1}/${2}" "Buildy/builds/${1}/${2}"
mv "builds/${1}/${3}" "Buildy/builds/${1}/${3}"
rm "Buildy/builds/${1}/${1}-build.svg"
mv "builds/${1}/${1}-build.svg" "Buildy/builds/${1}/${1}-build.svg"
cd Buildy
git add builds/*
git commit -m "Add build for ${1}"
git push
rm -rf ../Buildy