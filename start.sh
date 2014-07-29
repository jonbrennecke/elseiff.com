
export NODE_ENV=production

nohup npm start > nohup.log 2>&1&
echo $! > nohup_pid.txt