# start db
sudo mongod --logpath /data/logs/mongo.log --port 21989 --fork

# connect
mongo 127.0.0.1:21989 -u "heyadmin" -p "ec]gI2[4jdif9cod#3fUnIb>=qj8tith"

# change db
use hey-backend

# list collections
db.getCollectionNames()

# find
db.collection.find({type:'user'});