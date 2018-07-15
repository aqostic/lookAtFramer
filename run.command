git clone https://github.com/aqostic/lookAtFramer.git
cd lookAtFramer/
chmod u+x run.sh
./run.sh
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
source ~/.bashrc
nvm install 10
npm init
npm install express --save-dev
npm install -g forever

forever start worker.js --host "http://ec2-18-219-93-244.us-east-2.compute.amazonaws.com:3000/link"

node worker.js --host "http://ec2-18-219-93-244.us-east-2.compute.amazonaws.com:3000/link"
npm install -g forever