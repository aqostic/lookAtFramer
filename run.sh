curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
sudo source ~/.bashrc
nvm install 10
npm init
npm install express --save-dev
node worker.js --host "http://ec2-18-219-93-244.us-east-2.compute.amazonaws.com:3000/link"