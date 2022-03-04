import json
import config
import mysql.connector
#連線資料庫
mydb=mysql.connector.connect(
    host=config.mysql["host"],
    user=config.mysql["user"],
    password=config.mysql["password"],
    database="taipeiAttraction"
) 
#讀取JSON資料
with open("taipei-day-trip-website/data/taipei-attractions.json", mode="r", encoding="utf-8") as file:
    data=json.load(file)
siteList=data["result"]["results"]
# print(type(siteList)) #資料型態list
for site in siteList:
    name=site["stitle"]
    category=site["CAT2"]
    description=site["xbody"]
    address=site["address"]
    mrt=site["MRT"]
    latitude=site["latitude"]
    longitude=site["longitude"]
    transport=site["info"]
#解析圖片路徑
    modContent=site["file"].lower()
    imgUrl=modContent.split("jpg")
    imgUrl=list(filter(None, imgUrl))#None為一種function, 會將是None的資料判斷為false, 所以才能顯示非None的資料。刪除split後產生的空值
    imgUrl=list(filter(lambda x:('mp3'not in x) and ('flv' not in x), imgUrl)) #filter'mp3' & 'flv'
    # # print(imgUrl) #資料型態為list ['jpg','jpg']['jpg','jpg']
    imgList=[]
    for url in imgUrl:
        newimgUrl=url+"jpg" #tuple相加=tuple1+tuple2
        imgList.append(newimgUrl)
        imgResult=', '.join(imgList)
    # print(type(imgList)) #資料型態list, 
    # print(result) #資料型態str
#將JSON資料存入mysql資料庫attraction table中
    mycursor = mydb.cursor()
    sql="INSERT INTO attraction(name, category, description, address, mrt, latitude, longitude, transport, imageUrl) VALUES(%s, %s, %s,%s,%s,%s,%s,%s,%s)"
    val=(name, category, description, address, mrt, latitude, longitude, transport, imgResult)
    mycursor.execute(sql, val)
mydb.commit()
print(mycursor.rowcount, "record inserted")
