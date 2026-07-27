npm run dev > dev.log 2>&1 &
PID=$!
sleep 15
curl -s http://localhost:3000
kill $PID
