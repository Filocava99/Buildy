git clone https://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@github.com/Filocava99/Buildy.git Buildy
mkdir -p "Buildy/builds/${1}"
mv "builds/${1}/${2}" "Buildy/builds/${1}/${2}"
mv "builds/${1}/${1}.html" "Buildy/builds/${1}/${1}.html"
cd Buildy
git add builds/*
git commit -m "Add build for ${1}"
git push
rm -rf ../Buildy