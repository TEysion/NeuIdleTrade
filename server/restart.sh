sudo kill  -9 $(lsof -i:4534 -t)
sudo nohup node index.js > apprc.txt