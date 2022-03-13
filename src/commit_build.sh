git clone https://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@github.com/Filocava99/Buildy.git Buildy
rsync -a --mkpath projects/ Buildy/projects/
cd Buildy
git commit projects/ -m "Added build"
git push
read -p "Press enter to continue"
